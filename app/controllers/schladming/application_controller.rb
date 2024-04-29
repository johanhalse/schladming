module Schladming
  class ApplicationController < ActionController::Base
    include Devise::Controllers::Helpers
    include Pagy::Backend

    layout -> { SchladmingLayout }
    class NoSuchScopeError < StandardError; end

    helper_method :current_user

    def index
      @columns = []
      @scopes = []
      pagy, resources = pagy(filtered_resources, items: 25)
      render Admin::IndexView.new(columns:, scopes:, resources:, pagy:)
    end

    def edit
      resource = find(params[:id])
      render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
    end

    def update
      resource = find(params[:id])

      if resource.update(permitted_params)
        after_update if respond_to?(:after_update)
        redirect_to [:edit, :admin, resource], notice: t("admin.update.successful", resource:)
      else
        flash.now[:alert] = t("admin.update.unsuccessful", resource:)
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:), status: :unprocessable_entity
      end
    end

    def new
      resource = resource_class.new
      render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
    end

    def create
      resource = resource_class.new(permitted_params)

      if resource.save
        after_create if respond_to?(:after_create)
        redirect_to [:edit, :admin, resource], notice: t("admin.create.successful", resource:)
      else
        flash.now[:alert] = t("admin.create.unsuccessful", resource_name: resource_class.model_name.human)
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:), status: :unprocessable_entity
      end
    end

    def destroy
      resource = find(params[:id])
      if resource.destroy
        redirect_to [:admin, resource.model_name.plural.to_sym], notice: t(".successful")
      else
        flash[:error] = t(".unsuccessful")
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
      end
    end

    def scopes
      @scopes
    end

    def current_user
      raise ActiveRecord::RecordNotFound if current_login.blank?

      @current_user ||= User.preload(:notifications, :seller_auctions).where(login: current_login).first
    end

    private

    def find(id)
      resource_class.find(id)
    end

    def permitted_params
      params.require(controller_name.singularize).permit! if params[controller_name.singularize].present?
    end

    def resource_name
      controller_name.singularize.camelize
    end

    def resource_class
      resource_name.constantize
    end

    def column(name, as:)
      @columns << [name, as]
      @columns
    end

    def scope(name)
      @scopes << name
      @scopes
    end

    def with_scope(all)
      return all if params[:scope].blank?
      raise NoSuchScopeError if @scopes.exclude?(params[:scope].to_sym)

      all.send(params[:scope])
    end

    def with_sorting(all)
      return all if params[:sort].blank?
      prop = params[:sort]
      direction = params[:direction]

      all.order(prop => direction)
    end

    def with_search(all)
      return all if params[:q].blank?

      props = Schladming.searchable_properties & resource_class.column_names

      join_query = props.map do |prop|
        "#{prop} ILIKE ?"
      end.join(" OR ")
      all.where(join_query, *props.map { "%#{params[:q]}%" })
    end

    def count
      with_search(with_scope(resource_class.all)).count
    end

    def filtered_resources
      with_sorting(
        with_search(
          with_scope(resource_class.all)
        )
      )
    end

    def page
      params[:page].to_i * PAGINATION_LIMIT
    end
  end
end
