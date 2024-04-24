class SelectFieldComponent< SchladmingComponent
  include UI::Classes

  def initialize(form:, name:, options:, translate: false, **field_data)
    @form = form
    @name = name
    @options = translate_options(options, translate)
    @field_data = field_data
  end

  def translate_options(options, translate)
    return options unless translate

    options.map { translated_key(_1) }.zip(options)
  end

  def translated_key(key)
    I18n.t("activerecord.attributes.#{@form.object.model_name.singular}.#{@name}/#{key}")
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      @form.select(@name, @options, @field_data, class: FIELD_INPUT, **@field_data)
    end
  end
end
