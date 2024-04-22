module UI
  module Fields
    def tab(name, open: false, &block)
      render TabComponent.new(name:, open:, &block)
    end

    def panel(name, &block)
      render PanelComponent.new(name:, &block)
    end

    def enum_field(name, *)
      render EnumFieldComponent.new(form: @form, name:)
    end

    def text_field(name, *)
      render TextFieldComponent.new(form: @form, name:)
    end
  end
end
