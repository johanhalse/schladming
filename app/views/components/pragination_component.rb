class PraginationComponent < ApplicationComponent
  LINK_CLASS = %w[block text-jaffa hover:text-zest transition-colors underline]

  def initialize(pagy:, url:)
    @pagy = pagy
    @url = URL.parse(url)
  end

  def render?
    @pagy.limit.positive?
  end

  def next_link
    return unless @pagy.next

    a(href: @url.merge("page" => @pagy.next).to_s, class: LINK_CLASS) { t(".next") }
  end

  def prev_link
    return unless @pagy.prev

    a(href: @url.merge("page" => @pagy.prev).to_s, class: LINK_CLASS) { t(".prev") }
  end

  def pages
    return if @pagy.pages < 3

    (1..@pagy.pages).each do |i|
      if (i == @pagy.page)
        span { i }
      else
        a(href: @url.merge("page" => i).to_s, class: LINK_CLASS) { i }
      end
    end
  end

  def view_template
    div(class: "flex gap-2") do
      prev_link
      pages
      next_link
    end
  end
end
