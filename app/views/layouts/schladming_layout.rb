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
      comptrollers.each do |route|
        li do
          link_to(route_name(route), [:admin, route.to_sym], class: "block w-full px-4 py-2 hover:text-neutral-300")
        end
      end
    end
  end

  def route_name(route)
    t("activerecord.models.#{route.singularize}.other")
  end

  def comptrollers
    Rails.application.routes.routes.map do |route|
      route.defaults[:controller]
    end.uniq.compact_blank.select { _1.start_with?("admin/") }.map { _1.split("/").last }
  end

  def view_template(&block)
    doctype

    html(lang: I18n.locale) do
      head do
        title { "Bidders Highway - #{helpers.controller_name} - #{helpers.params[:id]}" }
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
