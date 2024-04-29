class RelationFieldComponent< SchladmingComponent
  include UI::Classes

  register_element :relation_search_controller

  def initialize(form:, name:, model_name:, **field_data)
    @form = form
    @name = name
    @model_name = model_name
    @field_data = {
      data: {
        relation_search_target: "visibleField",
        action: "relation-search#change"
      }
    }.merge(field_data)
  end

  def results
    div(class:"absolute top-full left-0 bg-white z-10", data: { relation_search_target: "results" })
  end

  def view_template
    relation_search_controller(class: FIELD_CONTAINER, data: { relation_search_model_value: @model_name }) do
      @form.label(@name, class: FIELD_LABEL)
      div(class: "w-full @lg:w-auto @lg:grow relative") do
        input(type: "text", class: %w[block w-full text-neutral-600 rounded border-neutral-300], value: @form.object.send(@name), **@field_data)
        results
      end
      @form.hidden_field("#{@name}_id", data: { relation_search_target: "field" })
    end
  end
end
