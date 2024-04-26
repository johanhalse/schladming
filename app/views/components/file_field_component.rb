class FileFieldComponent< SchladmingComponent
  include UI::Classes

  def initialize(form:, name:, **field_data)
    @form = form
    @name = name
    @field_data = field_data
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      @form.file_field(@name, class: FIELD_INPUT, **@field_data)
    end
  end
end
