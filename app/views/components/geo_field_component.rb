class GeoFieldComponent< SchladmingComponent
  include UI::Classes

  register_element :geo_search_controller

  def initialize(form:, name:, **field_data)
    @form = form
    @name = name
    @field_data = {
      data: {
        geo_search_target: "visibleField",
        action: "geo-search#change"
      }
    }.merge(field_data)
  end

  def results
    div(class:"absolute top-full left-0 bg-white z-10", data: { geo_search_target: "results" })
  end

  def view_template
    geo_search_controller(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      div(class: "w-full @lg:w-auto @lg:grow relative") do
        @form.text_field(
          @name,
          type: "text",
          class: %w[block w-full text-neutral-600 rounded border-neutral-300],
          **@field_data
        )
        results
      end
      @form.hidden_field("#{@name}_lat", data: { geo_search_target: "lat" })
      @form.hidden_field("#{@name}_lng", data: { geo_search_target: "lng" })
    end
  end
end
