class FlashMessageComponent< SchladmingComponent
  def view_template
    div(class: "bg-yellow-200") do
      flash.each do |type, msg|
        div(class: "alert w-full flex items-center justify-center gap-2 p-4") do
          span { msg }
        end
      end
    end
  end

  def render?
    flash.any?
  end

  def color(type)
    return "red" if type.to_sym == :alert

    "yellow"
  end
end
