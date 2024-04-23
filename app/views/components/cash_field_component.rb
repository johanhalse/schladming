class CashFieldComponent< SchladmingComponent
  include UI::Classes

  register_element :admin_cleave_controller

  def initialize(form:, name:)
    @form = form
    @name = name
  end

  def view_template
    admin_cleave_controller(class: FIELD_CONTAINER) do
      @form.label("#{@name}_without_cents", class: FIELD_LABEL)
      div(class: "flex justify-between items-center gap-2 grow") do
        @form.text_field("#{@name}_without_cents", class: FIELD_INPUT + ["grow"], data: { action: "admin-cleave#cleave" })
        span { @form.object.send("#{@name}_currency") }
      end
    end
  end
end
