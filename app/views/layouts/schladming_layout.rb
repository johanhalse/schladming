class SchladmingLayout < SchladmingView
  include Phlex::Rails::Layout
  include Phlex::Rails::Helpers::Flash
  include Phlex::Rails::Helpers::JavascriptIncludeTag
  include Phlex::Rails::Helpers::LinkTo
  include Phlex::Rails::Helpers::StylesheetLinkTag

  LEFT_MENU_CLASS = %w[w-full -translate-x-full max-w-xs md:translate-x-0 md:w-1/6 md:h-auto md:static md:block absolute z-10 bg-neutral-700
                       text-white transition-all]

  def left_menu
    ul(class: LEFT_MENU_CLASS + ["min-w-[200px]"], id: "left-menu") do
      Schladming.menu_items.each do |route|
        li do
          link_to(route_name(route), route_link(route), class: "block w-full px-4 py-2 hover:text-neutral-300")
        end
      end
    end
  end

  def route_link(route)
    route.is_a?(Symbol) ? [:admin, route] : [:admin, route.keys.first, route.values.first]
  end

  def route_name(route)
    route_name = route.is_a?(Symbol) ? route : route.keys.first
    t("activerecord.models.#{route_name.to_s.singularize}.other")
  end

  def translated_controller
    I18n.t("activerecord.models.#{helpers.controller_name.singularize}.other")
  end

  def view_template(&block)
    doctype

    html(lang: I18n.locale) do
      head do
        title { "Bidders Highway - #{translated_controller}" }
        csrf_meta_tags
        csp_meta_tag
        meta(http_equiv: "x-ua-compatible", content: "ie=edge")
        meta(name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no")
        meta(name: "format-detection", content: "telephone=no")

        stylesheet_link_tag("schladming-tailwind", "inter-font", "flatpickr.min", "trix", "data-turbo-track": "reload")
        javascript_include_tag("schladming", "data-turbo-track": "reload", defer: true)
        javascript_include_tag("admin", "data-turbo-track": "reload", defer: true)
        link(rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.snow.css")
      end

      body(lang: I18n.locale) do
        render FlashMessageComponent.new
        div(class: "flex min-h-[100dvh] bg-neutral-50") do
          left_menu
          main(class: "w-full overflow-auto", &block)
        end
      end
    end
  end
end
