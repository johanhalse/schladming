module Admin
  class IndexView < SchladmingView
    include Phlex::Rails::Helpers::DOMID
    include Phlex::Rails::Helpers::L
    include Phlex::Rails::Helpers::LinkTo
    include UI::Classes
    include UI::Images

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
        span(class: "whitespace-nowrap") { l(val, format: :short) }
      when :image
        img(src: strat_url(val), alt: "", width: "30")
      when :resource
        link_to(val.to_s || "-", [:edit, :admin, val], class: LINK)
      when :enum
        translated_enum(resource, column, val)
      else
        span(class: "whitespace-nowrap") { val&.to_s&.truncate(40) }
      end
    end

    def translated_enum(resource, column, val)
      resource.class.human_attribute_name("#{column}.#{val}")
    end

    def multi_actions?
      false
    end

    def resource_row(resource)
      tr(class: "transition-colors", data: { action: "clickable-row#click", link: url_for([:edit, :admin, resource]) }) do
        td(class: "pl-2 w-0") { check_box(resource) } if multi_actions?
        @columns.each do |column|
          td(class: "px-2 py-1 first:pl-0") do
            format_column(resource, column.first, column.last)
          end
        end
        # td(class: "px-2 py-1 last:pr-0 flex gap-2 justify-end") do
        #   link_to("Visa", [:admin, resource], class: PILL_BUTTON)
        # end
      end
    end

    def check_box(resource)
      input(type: "checkbox", id: dom_id(resource), data: { select_all_target: "resource" })
    end

    def scopes
      return if @scopes.blank?

      ul(class: "flex flex-wrap gap-1 py-2") do
        li do
          a(href: scope_url(nil), class: scope_class(nil)) { "Alla" }
        end

        @scopes.each do |scope|
          li do
            a(href: scope_url(scope), class: scope_class(scope)) { @resources.model.human_attribute_name("scopes.#{scope}") }
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

    def sort_url(prop)
      current_url = URL.parse(helpers.request.original_url)
      if current_url.query["sort"].nil?
        current_url.merge(sort: prop, direction: "desc")
      else
        reverse_direction = current_url.query["direction"] == "desc" ? "asc" : "desc"
        current_url.merge(sort: prop, direction: reverse_direction)
      end
    end

    def view_template
      render TopBarComponent.new do
        link_to("Ny", [:new, :admin, @resources.model_name.singular.to_sym], class: BUTTON_PRIMARY)
        render SearchBarComponent.new(query: helpers.params[:q])
      end
      div(class: "p-4", id: "main") do
        h1(class: H1) { @resources.model_name.human(count: 2) }
        scopes
        clickable_row_controller(class: "block w-full overflow-auto") do
          select_all_controller(class: "block w-full") do
            table(class: "w-full overflow-x-scroll text-mid") do
              thead do
                tr do
                  if multi_actions?
                    th(class: "pl-2 w-0") { input(type: "checkbox", data: { action: "change->select-all#change" }) }
                  end
                  @columns.each do |column|
                    th(class: "px-2 py-1 text-left first:pl-0") do
                      a(href: sort_url(column.first)) do
                        next "Namn" if column.first == :to_s
                        @resources.model.human_attribute_name(column.first)
                      end
                    end
                  end
                  th(class: "px-2 py-1") { whitespace }
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

        render PraginationComponent.new(pagy: @pagy, url: helpers.request.original_url)
      end
    end
  end
end
