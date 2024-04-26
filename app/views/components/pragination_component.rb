class PraginationComponent < ApplicationComponent
  def initialize(pagy:, url:)
    @pagy = pagy
    @url = URL.parse(url)
  end

  def render?
    @pagy.items.positive?
  end

  def next_link
    return unless @pagy.next

    a(
      href: @url.merge("page" => @pagy.next).to_s,
      class: "block text-jaffa hover:text-zest transition-colors underline"
    ) { t(".next") }
  end

  def prev_link
    return unless @pagy.prev

    a(
      href: @url.merge("page" => @pagy.prev).to_s,
      class: "block text-jaffa hover:text-zest transition-colors underline"
    ) { t(".prev") }
  end

  def view_template
    div do
      prev_link
      next_link
    end
  end
end
