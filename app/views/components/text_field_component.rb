class TextFieldComponent < ApplicationComponent
  include UI::Classes

  def initialize(form:, name:)
    @form = form
    @name = name
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      @form.text_field(@name, class: FIELD_INPUT)
    end
  end
end
