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

    def cash_field(name, **)
      render CashFieldComponent.new(form: @form, name:, **)
    end

    def datetime_field(name, *)
      render DateTimeFieldComponent.new(form: @form, name:)
    end

    def enum_field(name, *)
      render EnumFieldComponent.new(form: @form, name:)
    end

    def file_field(name, **)
      render FileFieldComponent.new(form: @form, name:, **)
    end

    def geo_field(name, **)
      render GeoFieldComponent.new(form: @form, name:, **)
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

    def select_field(name, options, translate: false, **)
      render SelectFieldComponent.new(form: @form, name:, options:, translate:, **)
    end

    def tag_field(name, **)
      render TagFieldComponent.new(form: @form, name:, **)
    end

    def text_area(name, **)
      render TextAreaComponent.new(form: @form, name:, **)
    end

    def text_field(name, **)
      render TextFieldComponent.new(form: @form, name:, **)
    end

    def rich_text_area(name, **)
      render RichTextComponent.new(form: @form, name:, **)
    end
  end
end
