class SchladmingLayout < SchladmingView
  include Phlex::Rails::Layout
  include Phlex::Rails::Helpers::Flash
  include Phlex::Rails::Helpers::JavascriptIncludeTag
  include Phlex::Rails::Helpers::LinkTo
  include Phlex::Rails::Helpers::StylesheetLinkTag

  def left_menu
    ul(class: "w-1/6 hidden md:block") do
      comptrollers.each do |route|
        li do
          link_to(route_name(route), [:admin, route.to_sym], class: "block w-full px-4 py-2")
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
        stylesheet_link_tag("schladming-tailwind", "inter-font", "flatpickr.min", "trix", "data-turbo-track": "reload")
        javascript_include_tag("schladming", "data-turbo-track": "reload", defer: true)
      end

      body(lang: I18n.locale) do
        render FlashMessageComponent.new
        div(class: "flex min-h-[100dvh] bg-neutral-50") do
          left_menu
          main(class: "grow flex flex-col", &block)
        end
      end
    end
  end
end
