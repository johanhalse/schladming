class SearchBarComponent < ApplicationComponent
  include UI::Classes

  def initialize(query:)
    @query = query
  end

  def search_url
    url = URL.parse(helpers.request.url)
    url.query.delete(:q)
    url.to_s
  end

  def view_template
    form(method: "get", action: search_url, class: "flex") do
      input(type: "search", class: %w[max-w-md border-0], name: "q", value: @query, placeholder: "Sök")
    end
  end
end
