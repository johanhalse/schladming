class PanelComponent< SchladmingComponent
  def initialize(name:)
    @name = name
  end

  def view_template(&block)
    div(class: "mb-4") do
      h2(class: "text-xl font-light mt-6 mb-2") { @name }
      div(class: "panel bg-white rounded p-4", &block)
    end
  end
end
