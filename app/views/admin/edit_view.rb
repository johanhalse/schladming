module Admin
  class EditView < SchladmingView
    include Phlex::Rails::Helpers::LinkTo
    include Phlex::Rails::Helpers::FormFor
    include UI::Fields
    include UI::Classes

    register_element :back_to_scope_controller

    def initialize(resource:, resource_name:, resource_class:)
      @resource = resource
      @resource_name = resource_name
      @resource_class = resource_class
      @tabs = []
    end

    def fields_for(name)
      @old_form = @form
      @form.fields_for(name) do |ff|
        @form = ff
        yield
      end
      @form = @old_form
    end

    def name
      [@resource.model_name.human, @resource.to_s].compact.join(": ")
    end

    def delete_link
      link_to(
        [:admin, @resource.model_name.singular.to_sym, id: @resource.id],
        data: { turbo_method: "delete", turbo_confirm: I18n.t("admin.confirm_delete", resource: @resource) },
        class: BUTTON_ALERT + %w[ml-auto]) do
          "Ta bort"
        end
    end

    def form_url
      return [:admin, @resource] unless @resource.persisted?

      [:admin, @resource.model_name.singular.to_sym, id: @resource.id]
    end

    def back_button
      back_to_scope_controller(data: { resource: @resource.model_name.singular }) do
        link_to("Tillbaka", [:admin, @resource_class], class: LINK + %w[block mt-4], data: { action: "back-to-scope#click", turbo_prefetch: "false" })
      end
    end

    def view_template
      form_for([:admin, @resource], url: form_url, multipart: true, html: { class: "submit-form" }) do |f|
        @form = f
        render TopBarComponent.new do
          f.submit(class: BUTTON_PRIMARY)
          top_bar_buttons if respond_to?(:top_bar_buttons)
          delete_link if @resource.persisted?
        end
        render ErrorMessagesComponent.new(resource: @resource)
        div(class: "px-4", id: "main") do
          back_button
          h1(class: H1) { name }

          ul(id: "tabs", class: "flex flex-wrap gap-1 hidden")
          div(class: "lg:flex gap-4") do
            div(class: "lg:w-2/3 only:w-full @container") { main_area }
            if respond_to?(:sidebar)
              aside(class: "lg:w-1/3 @container") { sidebar }
            end
          end
        end
      end
    end
  end
end
