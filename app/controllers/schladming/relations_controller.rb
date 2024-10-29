module Schladming
  class RelationsController < ActionController::Base
    def index
      model_class = params[:m].camelize.constantize
      resources = SearchItem
        .includes(:searchable)
        .where(searchable_type: model_class.to_s)
        .search(params[:q]).limit(10)
        .map(&:searchable)

      render Admin::SearchView.new(resources:, model_class:)
    end
  end
end
