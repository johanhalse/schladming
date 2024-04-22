class EnumFieldComponent < ApplicationComponent
  include UI::Classes

  def initialize(form:, name:)
    @form = form
    @name = name
    @resource_class = @form.object.class
  end

  def translated_enums
    @resource_class.send(@name.to_s.pluralize).map do |k, v|
      [@resource_class.human_attribute_name("#{@name}.#{k}"), k]
    end
  end

  def view_template
    div(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)
      @form.select(@name, translated_enums, {}, class: FIELD_INPUT)
    end
  end
end
