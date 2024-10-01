module Admin
  class IndexView < SchladmingView
    include Phlex::Rails::Helpers::DOMID
    include Phlex::Rails::Helpers::L
    include Phlex::Rails::Helpers::LinkTo
    include UI::Classes
    include UI::Images

    register_element :batch_action_controller
    register_element :clickable_row_controller
    register_element :select_all_controller

    def initialize(resources:, columns:, scopes:, pagy:)
      @resources = resources
      @columns = columns
      @scopes = scopes
      @pagy = pagy
    end

    def format_column(resource, column, as)
      val = resource.send(column)
      return if val.blank?
      return as.call(val) if as.is_a?(Proc)

      case as
      when :date
        span { l(val, format: :day) }
      when :image
        img(src: strat_url(val), alt: "", width: "30")
      when :resource
        link_to(val.to_s || "-", resource_url(val), class: LINK)
      when :enum
        translated_enum(resource, column, val)
      else
        span { val&.to_s&.truncate(40) }
      end
    end

    def translated_enum(resource, column, val)
      resource.class.human_attribute_name("#{column}.#{val}")
    end

    def resource_url(resource)
      url_for([:edit, :admin, resource.model_name.singular.to_sym, id: resource.id])
    end

    def resource_row(resource)
      tr(class: "transition-colors even:bg-neutral-150", data: { action: "clickable-row#click", link: resource_url(resource) }) do
        td(class: "pl-2 w-0") { check_box(resource) } if respond_to?(:multi_actions)
        @columns.each do |column|
          td(class: "px-2 py-1 first:pl-0") do
            format_column(resource, column.first, column.second)
          end
        end
        # td(class: "px-2 py-1 last:pr-0 flex gap-2 justify-end") do
        #   link_to("Visa", [:admin, resource], class: PILL_BUTTON)
        # end
      end
    end

    def check_box(resource)
      input(
        type: "checkbox",
        id: dom_id(resource),
        name: "ids[]",
        value: resource.id,
        data: {
          action: "change->batch-action#checkbox",
          select_all_target: "resource",
          batch_action_target: "checkbox"
        })
    end

    def enum_name(enums, scope, parent)
      enums.each do |k, v|
        return parent if k == scope.to_s
        if v.is_a?(Hash)
          result = enum_name(v, scope, k)
          return result unless result.nil?
        end
      end
      nil
    end

    def scope_translation(model, scope)
      if I18n.exists?("activerecord.attributes.#{model.model_name.singular}.#{scope}")
        return model.human_attribute_name(scope)
      end

      model.human_attribute_name("#{enum_name(model.defined_enums, scope, nil)}.#{scope}")
    end

    def scopes
      return if @scopes.blank?

      ul(class: "flex flex-wrap gap-1 py-2") do
        @scopes.each do |scope|
          li do
            a(href: scope_url(scope), class: scope_class(scope)) { scope_translation(@resources.model, scope) }
          end
        end
      end
    end

    def scope_class(scope)
      tokens(
        TAB,
        -> { helpers.params[:scope] != scope&.to_s } => TAB_NEUTRAL,
        -> { helpers.params[:scope] == scope&.to_s } => TAB_SELECTED
      )
    end

    def scope_url(scope)
      current_url = URL.parse(helpers.request.original_url)

      if scope.nil?
        current_url.query.delete("scope")
        current_url.to_s
      else
        current_url.merge(scope: scope).to_s
      end
    end

    def sort_url(sort_key)
      current_url = URL.parse(helpers.request.original_url)
      if current_url.query["sort"].nil?
        current_url.merge(sort: sort_key, direction: "desc")
      else
        reverse_direction = current_url.query["direction"] == "desc" ? "asc" : "desc"
        current_url.merge(sort: sort_key, direction: reverse_direction)
      end
    end

    def listing
      clickable_row_controller(class: "block w-full overflow-auto") do
        select_all_controller(class: "block w-full") do
          table(class: "w-full overflow-x-scroll text-mid whitespace-nowrap") do
            thead do
              tr do
                if respond_to?(:multi_actions)
                  th(class: "pl-2 w-0") do
                    input(
                      type: "checkbox",
                      data: {
                        action: "change->select-all#change",
                        batch_action_target: "all"
                      })
                  end
                end
                @columns.each do |column|
                  th(class: "px-2 py-1 text-left first:pl-0") do
                    a(href: sort_url(column.last)) do
                      next "Namn" if column.first == :to_s
                      @resources.model.human_attribute_name(column.first)
                    end
                  end
                end
                # th(class: "px-2 py-1") { whitespace }
              end
            end
            tbody do
              @resources.each do |resource|
                resource_row(resource)
              end
            end
          end
        end
      end
    end

    def heading
      h1(class: H1) { @resources.model_name.human(count: 2) }
    end

    def top_bar
      render TopBarComponent.new do
        link_to("Ny", [:new, :admin, @resources.model_name.singular.to_sym], class: BUTTON_PRIMARY)
      end
    end

    def view_template
      top_bar
      div(class: "p-4", id: "main") do
        heading
        scopes
        render SearchBarComponent.new(query: helpers.params[:q])
        batch_action_controller do
          form(method: "post", action: url_for([:batch, :admin, @resources.model_name.plural.to_sym])) do
            input(type: "hidden", name: "scope", value: helpers.params[:scope])
            input(type: "hidden", name: "page", value: helpers.params[:page] || 1)
            multi_actions if respond_to?(:multi_actions)
            listing
          end
        end
        render PraginationComponent.new(pagy: @pagy, url: helpers.request.original_url)
      end
    end
  end
end
