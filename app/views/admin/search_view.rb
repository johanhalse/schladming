module Admin
  class SearchView < Phlex::HTML
    def initialize(resources:, model_class:)
      @resources = resources
      @model_class = model_class
    end

    def search_component
      "admin/#{@model_class.model_name.plural}/search_component".camelize.constantize
    end

    def data
      { action: "click->relation-search#select" }
    end

    def view_template
      ul(class: "border max-h-80 overflow-auto") do
        @resources.each do |resource|
          li(class: "border-t first:border-0 p-2 hover:bg-neutral-100 cursor-pointer", id: resource.id, name: resource.to_s, data:) do
            render search_component.new(resource:)
          end
        end
      end
    end
  end
end
