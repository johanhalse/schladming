class TextAreaComponent< SchladmingComponent
  include UI::Classes

  def initialize(form:, name:, **field_data)
    @form = form
    @name = name
    @field_data = field_data
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      @form.text_area(@name, class: FIELD_INPUT + %w[min-h-20], **@field_data)
    end
  end
end
