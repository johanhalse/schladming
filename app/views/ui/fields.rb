module UI
  module Fields
    def tab(name, open: false, &block)
      render TabComponent.new(name:, open:, &block)
    end

    def panel(name, &block)
      render PanelComponent.new(name:, &block)
    end

    def boolean_field(name, **)
      render BooleanFieldComponent.new(form: @form, name:, **)
    end

    def cash_field(name, *)
      render CashFieldComponent.new(form: @form, name:)
    end

    def datetime_field(name, *)
      render DateTimeFieldComponent.new(form: @form, name:)
    end

    def enum_field(name, *)
      render EnumFieldComponent.new(form: @form, name:)
    end

    def image_field(name, *)
      render ImageFieldComponent.new(form: @form, name:)
    end

    def relation_field(name, model_name, **)
      render RelationFieldComponent.new(form: @form, name:, model_name:, **)
    end

    def relation_listing(resources, fields, link = false)
      render RelationListingComponent.new(resources:, fields:, link:)
    end

    def text_area(name, **)
      render TextAreaComponent.new(form: @form, name:, **)
    end

    def text_field(name, **)
      render TextFieldComponent.new(form: @form, name:, **)
    end

    def trix_area(name, **)
      render TrixComponent.new(form: @form, name:, **)
    end
  end
end
