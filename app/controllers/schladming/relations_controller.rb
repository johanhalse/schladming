module Schladming
  class RelationsController < ActionController::Base
    def index
      model_class = params[:m].camelize.constantize

      resources = model_class.admin_search(params[:q]).limit(5)
      render Admin::SearchView.new(resources:, model_class:)
    end
  end
end
