class TopBarComponent < ApplicationComponent
  def view_template(&block)
    div(class: "w-full bg-racing flex", &block)
  end
end
