class PanelComponent< SchladmingComponent
  include UI::Classes

  def initialize(name:)
    @name = name
  end

  def view_template(&block)
    div(class: "mb-4") do
      h2(class: PANEL_HEADER) { @name }
      div(class: "panel bg-white rounded p-4", &block)
    end
  end
end
