class RichTextComponent< SchladmingComponent
  include UI::Classes

  register_element :rich_text_editor_controller

  def initialize(form:, name:, **field_data)
    @form = form
    @name = name
    @field_data = field_data
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL + %w[self-start])
      rich_text_editor_controller(class: "shrink-[100] w-full") do
        div(class: "quill") { raw safe(@form.object.send(@name).to_s) }
        @form.text_area(@name, class: "hidden", data: { rich_text_editor_target: "field" })
      end
    end
  end
end
