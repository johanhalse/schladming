class TabComponent< SchladmingComponent
  include UI::Classes

  register_element :admin_tab_controller

  def initialize(name:, open:)
    @name = name
    @open = open
    @id = "tab_" + name.gsub(" ", "_").gsub(/[^a-zA-Z\d\w]/, "").downcase
  end

  def clickable_tab_template
    template_tag(id: "template_#{@id}") do
      li do
        admin_tab_controller do
          label(class: TAB + TAB_NEUTRAL, data: { action: "click->admin-tab#mark" }, for: @id) { @name }
        end
      end
    end
  end

  def peer_checkbox
    input(type: "radio", class: "peer hidden", name: "tabs", id: @id, value: "visible", checked: @open,
      data: { name: @name })
  end

  def view_template(&block)
    clickable_tab_template
    div do
      peer_checkbox
      div(class: "hidden peer-checked:block", &block)
    end
    script do
      unsafe_raw <<-SKRIPT
        tabs.appendChild(template_#{@id}.content.cloneNode(true));
        tabs.classList.remove("hidden");
      SKRIPT
    end
  end
end
