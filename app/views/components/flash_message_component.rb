class FlashMessageComponent < ApplicationComponent
  def view_template
    div(class: "bg-neutral-300") do
      helpers.flash.each do |type, msg|
        div(class: "alert w-full flex items-center justify-center gap-2") do
          span { msg }
        end
      end
    end
  end

  def render?
    helpers.flash.any?
  end

  def color(type)
    return "red" if type.to_sym == :alert

    "yellow"
  end
end
