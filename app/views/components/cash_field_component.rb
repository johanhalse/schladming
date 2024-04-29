class CashFieldComponent< SchladmingComponent
  include UI::Classes

  register_element :admin_cleave_controller

  def initialize(form:, name:, **data)
    @form = form
    @name = name
    @data = { data: { action: "admin-cleave#cleave" }}.merge(data)
  end

  def view_template
    admin_cleave_controller(class: FIELD_CONTAINER) do
      @form.label("#{@name}_without_cents", class: FIELD_LABEL)
      div(class: "flex justify-between items-center gap-2 grow") do
        @form.text_field("#{@name}_without_cents", class: FIELD_INPUT + ["grow"], **@data)
        @form.hidden_field("#{@name}_currency", value: "SEK")
        span { "SEK" }
      end
    end
  end
end
