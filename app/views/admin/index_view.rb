module Admin
  class IndexView < ApplicationView
    include Phlex::Rails::Helpers::L
    include Phlex::Rails::Helpers::LinkTo
    include UI::Classes

    register_element :clickable_row_controller

    def initialize(resources:, columns:, scopes:, count:)
      @resources = resources
      @columns = columns
      @scopes = scopes
      @count = count
    end

    def format_column(resource, column, as)
      val = resource.send(column)
      return as.call(val) if as.is_a?(Proc)

      case as
      when :date
        l(val, format: :short)
      when :resource
        link_to(val, [:edit, :admin, val], class: LINK)
      when :enum
        translated_enum(resource, column, val)
      else
        val.to_s
      end
    end

    def translated_enum(resource, column, val)
      resource.class.human_attribute_name("#{column}.#{val}")
    end

    def resource_row(resource)
      tr(class: "transition-colors", data: { action: "clickable-row#click", link: url_for([:edit, :admin, resource]) }) do
        @columns.each do |column|
          td(class: "text-left last:text-right px-2 py-1") do
            format_column(resource, column.first, column.last)
          end
        end
      end
    end

    def scopes
      return if @scopes.blank?

      ul(class: "flex gap-1 py-2") do
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
        INDEX_SCOPE,
        -> { helpers.params[:scope] != scope&.to_s } => "bg-neutral-300 hover:bg-neutral-200",
        -> { helpers.params[:scope] == scope&.to_s } => "bg-cyan-200"
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
        link_to("Ny", [:new, :admin, @resources.model.name.downcase.to_sym], class: BUTTON_PRIMARY)
      end
      scopes
      clickable_row_controller(class: "grow") do
        table(class: "w-full") do
          thead do
            tr do
              @columns.each do |column|
                th(class: "text-left last:text-right px-2 py-1") do
                  a(href: sort_url(column.first)) { @resources.model.human_attribute_name(column.first) }
                end
              end
            end
          end
          tbody do
            @resources.each do |resource|
              resource_row(resource)
            end
          end
        end
      end

      div { @count }
    end
  end
end
