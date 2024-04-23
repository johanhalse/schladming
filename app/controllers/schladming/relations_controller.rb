module Schladming
  class RelationsController < ActionController::Base
    def index
      @model = params[:m]
      @query = params[:q].downcase

      resources = model_class.where(id: resource_ids).limit(5)
      render Admin::SearchView.new(resources:, model_class:)
    end

    private

    def resource_ids
      model_class.pluck(searchable_properties).select do |instance|
        instance.any? { |field| field&.to_s&.downcase&.include?(@query) }
      end.map(&:first)
    end

    def model_class
      raise ActiveRecord::RecordNotFound if Schladming.searchable_models.exclude?(@model)

      @model.camelize.constantize
    end

    def searchable_properties
      ["id"] + (Schladming.searchable_properties & model_class.column_names)
    end
  end
end
