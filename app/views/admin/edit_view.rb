# shrink text-neutral-500 text-right cursor-pointer text-red-800 hover:text-red-600 rounded-full hover:bg-red-200
# transition-colors text-xl absolute top-3 right-2 md:w-auto peer hidden peer-checked:hidden md:w-[200px] md:pr-2
# bg-neutral-100 rounded relative py-2 cursor-move js-handle block text-xl p-2 text-sm flex gap-2 items-center
module Admin
  class EditView < SchladmingView
    include Phlex::Rails::Helpers::LinkTo
    include Phlex::Rails::Helpers::FormFor
    include UI::Fields
    include UI::Classes

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
        [:admin, @resource],
        data: { turbo_method: "delete", turbo_confirm: I18n.t("admin.confirm_delete", resource: @resource) },
        class: BUTTON_ALERT) do
          "Ta bort"
        end
    end

    def view_template
      form_for([:admin, @resource], multipart: true, html: { class: "submit-form" }) do |f|
        @form = f
        render TopBarComponent.new do
          f.submit(class: BUTTON_PRIMARY)
          top_bar_buttons if respond_to?(:top_bar_buttons)
          delete_link if @resource.persisted?
        end
        render ErrorMessagesComponent.new(resource: @resource)
        div(class: "px-4", id: "main") do
          link_to("Tillbaka", [:admin, @resource_class], class: LINK + %w[block mt-4])
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
