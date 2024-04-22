class PanelComponent < ApplicationComponent
  def initialize(name:)
    @name = name
  end

  def view_template(&block)
    div(class: "mb-4") do
      h2(class: "text-xl my-4") { @name }
      div(class: "panel bg-white rounded p-4", &block)
    end
  end
end
