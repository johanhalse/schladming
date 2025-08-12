class SchladmingLayout < SchladmingView
  include Phlex::Rails::Helpers::CSRFMetaTags
  include Phlex::Rails::Helpers::CSPMetaTag
  include Phlex::Rails::Helpers::Flash
  include Phlex::Rails::Helpers::JavascriptIncludeTag
  include Phlex::Rails::Helpers::LinkTo
  include Phlex::Rails::Helpers::StylesheetLinkTag

  LEFT_MENU_CLASS = %w[w-full -translate-x-full max-w-xs md:translate-x-0 md:w-1/6 md:h-auto md:static md:block absolute z-10 bg-neutral-700
                       text-white transition-all]

  def route_link(route)
    route.is_a?(Symbol) ? [:admin, route] : [:admin, route.keys.first, route.values.first]
  end

  def route_name(route)
    route_name = route.is_a?(Symbol) ? route : route.keys.first
    t("activerecord.models.#{route_name.to_s.singularize}.other")
  end

  def translated_controller
    I18n.t("activerecord.models.#{controller_name.singularize}.other")
  end

  def page_title
    "#{translated_controller} - Admin"
  end

  def around_template(&block)
    doctype

    html(lang: I18n.locale) do
      head do
        title { page_title }
        csrf_meta_tags
        csp_meta_tag
        meta(name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no")
        meta(name: "format-detection", content: "telephone=no")

        stylesheet_link_tag("tagify", "data-turbo-track": "reload")
        stylesheet_link_tag("schladming-tailwind", "inter-font", "flatpickr.min", "data-turbo-track": "reload")
        javascript_include_tag("schladming", "data-turbo-track": "reload", defer: true)
        link(rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.snow.css")
        link(rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
        script do
          raw(
            safe(
              <<-KEYS
              window.imageClientId = "#{ENV["IMAGES_CLIENT_ID"]}";
              window.imageClientSecret = "#{ENV["IMAGES_CLIENT_SECRET"]}";
              window.imageBucketId = "#{ENV["IMAGES_BUCKET_ID"]}";
              KEYS
            )
          )
        end
      end

      # md:w-1/4 lg:w-1/5 xl:w-1/7 2xl:w-1/8
      body(lang: I18n.locale) do
        render FlashMessageComponent.new
        div(class: "flex min-h-[100dvh] bg-neutral-50") do
          render Filter::LeftMenuComponent.new
          main(class: "w-full md:w-3/4 lg:w-4/5 xl:w-6/7 2xl:w-7/8 overflow-auto") do
            render GlobalSearchBarComponent.new
            yield
          end
        end
      end
    end
  end
end
