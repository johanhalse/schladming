class GlobalSearchBarComponent < ApplicationComponent
  include UI::Classes

  register_element :global_search_controller

  def view_template
    global_search_controller(class: "flex bg-racing-900 px-4 py-2 justify-center") do
      div(class: "relative") do
        form(method: "get", action: admin_global_searches_path, class: "flex", data: { remote: true }) do
          input(
            type: "search",
            class: %w[max-w-md border-0 rounded-full px-4],
            name: "q",
            autocomplete: "off",
            placeholder: "Globalsök",
            data: {
              action: "keydown->global-search#keydown"
            }
          )
        end
        div(class: "absolute top-full -left-1/4 z-40") do
          div(id: "global-results")
        end
      end
    end
  end
end
