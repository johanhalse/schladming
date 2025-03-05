class TopBarComponent< SchladmingComponent
  register_element :hamburger_menu_controller

  def hamburger_svg
    <<-SVG
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round"
      stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Menu</title><g id="Page-1" stroke="none"
      stroke-width="1" fill="none" fill-rule="evenodd"><g id="Menu"><rect id="Rectangle" fill-rule="nonzero"
      x="0" y="0" width="24" height="24"></rect><line x1="5" y1="7" x2="19" y2="7" id="Path" stroke="#fff"
      stroke-width="2" stroke-linecap="round"></line><line x1="5" y1="17" x2="19" y2="17" id="Path" stroke="#fff"
      stroke-width="2" stroke-linecap="round"></line><line x1="5" y1="12" x2="19" y2="12" id="Path" stroke="#fff"
      stroke-width="2" stroke-linecap="round"></line></g></g></g></svg>
    SVG
  end

  def data
    { action: "click->hamburger-menu#toggle" }
  end

  def view_template(&block)
    div(class: "w-full bg-racing relative") do
      div(class: "flex flex-wrap pr-10 lg:pr-0", &block)
      hamburger_menu_controller(class: "md:hidden absolute top-2 right-2 w-8 h-8") do
        svg(viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", data: data) do
          raw safe(hamburger_svg)
        end
      end
    end
  end
end
