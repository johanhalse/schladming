module Schladming
  class ApplicationController < ActionController::Base
    include Devise::Controllers::Helpers
    include Pagy::Backend
    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError, with: :not_allowed

    layout -> { SchladmingLayout }
    class NoSuchScopeError < StandardError; end

    after_action :verify_authorized
    helper_method :current_user

    def index
      @columns = []
      @columns = columns
      pagy, resources = pagy(filtered_resources, items: 25)
      authorize resources, policy_class: Admin::ApplicationPolicy
      render index_view.new(columns: @columns, scopes:, resources:, multi_actions:, pagy:)
    end

    def edit
      resource = find(params[:id])
      authorize resource, policy_class: Admin::ApplicationPolicy
      render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
    end

    def update
      resource = find(params[:id])
      authorize resource, policy_class: Admin::ApplicationPolicy

      if resource.update(permitted_params)
        after_update(resource) if respond_to?(:after_update)
        redirect_to edit_url(resource), notice: t("admin.update.successful", resource:)
      else
        flash.now[:alert] = t("admin.update.unsuccessful", resource:)
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:), status: :unprocessable_entity
      end
    end

    def new
      resource = resource_class.new
      authorize resource, policy_class: Admin::ApplicationPolicy
      before_new(resource) if respond_to?(:before_new)
      render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
    end

    def create
      resource = authorize resource_class.new(permitted_params), policy_class: Admin::ApplicationPolicy
      before_create(resource) if respond_to?(:before_create)

      if resource.save
        after_create(resource) if respond_to?(:after_create)
        redirect_to edit_url(resource), notice: t("admin.create.successful", resource:)
      else
        flash.now[:alert] = t("admin.create.unsuccessful", resource_name: resource_class.model_name.human)
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:), status: :unprocessable_entity
      end
    end

    def destroy
      resource = find(params[:id])
      authorize resource, policy_class: Admin::ApplicationPolicy

      if resource.destroy
        redirect_to [:admin, resource.model_name.plural.to_sym], notice: t(".successful")
      else
        flash[:error] = t(".unsuccessful")
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
      end
    end

    def batch
      resources = authorize resource_class.where(id: params[:ids]), policy_class: Admin::ApplicationPolicy
      send("multi_#{params[:function]}", resources)
    end

    def edit_url(resource)
      [:edit, :admin, resource.model_name.singular.to_sym, id: resource.id]
    end

    def scopes
      []
    end

    def multi_actions; end

    def current_user
      return if current_login.blank?

      @current_user ||= User.preload(:notifications, :seller_auctions).where(login: current_login).first
    end

    private

    def index_view
      Admin::IndexView
    end

    def not_allowed
      store_location_for(:login, request.fullpath)
      redirect_to login_methods_path(locale: I18n.locale), alert: t("access_denied")
    end

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

    def column(name, as:, sort_key: nil)
      @columns << [name, as, sort_key || name]
      @columns
    end

    def with_scope(all)
      if params[:scope].blank?
        cookies.delete("return_to_#{controller_name.singularize}_tab")
        return all if scopes.blank?

        params[:scope] = scopes.first.to_s
      end
      raise NoSuchScopeError if scopes.exclude?(params[:scope].to_sym)

      cookies["return_to_#{controller_name.singularize}_tab"] = params[:scope]
      all.send(params[:scope])
    end

    def with_sorting(all)
      return all.order(created_at: "desc") if params[:sort].blank?
      prop = params[:sort]
      direction = params[:direction]

      if params[:sort].include?("/")
        table, prop = prop.split("/")
        all.joins(table.to_sym).order(prop => direction)
      else
        all.order(prop => direction)
      end
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
