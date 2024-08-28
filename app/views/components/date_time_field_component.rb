class DateTimeFieldComponent< SchladmingComponent
  include UI::Classes

  register_element :datetime_select_controller

  def initialize(form:, name:, inline: false)
    @form = form
    @name = name
    @inline = inline
  end

  def inlineness
    { inline: "1" } if @inline
  end

  def view_template
    datetime_select_controller(class: FIELD_CONTAINER, data: inlineness) do
      @form.label(@name, class: FIELD_LABEL)
      @form.text_field(@name, class: FIELD_INPUT)
    end
  end
end
