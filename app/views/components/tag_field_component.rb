class TagFieldComponent< SchladmingComponent
  include UI::Classes
  register_element :tag_field_controller

  def initialize(form:, name:, **field_data)
    @form = form
    @name = name
    @field_data = field_data
  end

  def view_template
    tag_field_controller(class: %w[w-full @lg:flex gap-2 items-start mt-2 first:mt-0 fc], **@field_data) do
      @form.label(@name, class: FIELD_LABEL + %w[mt-2])
      @form.text_area(@name, class: "w-full")
    end
  end
end
