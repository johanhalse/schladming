module Schladming
  class ApplicationController < ActionController::Base
    PAGINATION_LIMIT = 25

    layout -> { SchladmingLayout }
    class NoSuchScopeError < StandardError; end

    def index
      @columns = []
      @scopes = []
      render Admin::IndexView.new(columns:, scopes:, resources:, count:)
    end

    def edit
      resource = resource_class.find(params[:id])
      render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
    end

    def update
      resource = resource_class.find(params[:id])

      if resource.update(permitted_params)
        after_update if respond_to?(:after_update)
        redirect_to [:edit, :admin, resource], notice: t("admin.update.successful", resource: @resource)
      else
        flash.now[:alert] = t("admin.update.unsuccessful", resource: @resource)
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
        redirect_to [:edit, :admin, resource], notice: t("admin.create.successful", resource: @resource)
      else
        flash.now[:alert] = t("admin.create.unsuccessful", resource: @resource)
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:), status: :unprocessable_entity
      end
    end

    def destroy
      resource = resource_class.find(params[:id])
      if resource.destroy
        redirect_to [:admin, resource.model_name.plural.to_sym], notice: t(".successful")
      else
        flash[:error] = t(".unsuccessful")
        render "admin/#{controller_name}/edit_view".camelize.constantize.new(resource:, resource_name:, resource_class:)
      end
    end

    private

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

    def with_pagination(all)
      all.offset(page).limit(PAGINATION_LIMIT)
    end

    def with_sorting(all)
      return all if params[:sort].blank?
      prop = params[:sort]
      direction = params[:direction]

      all.order(prop => direction)
    end

    def count
      with_scope(Post.all).count
    end

    def resources
      with_pagination(
        with_sorting(
          with_scope(Post.all)
        )
      )
    end

    def page
      params[:page].to_i * PAGINATION_LIMIT
    end
  end
end
