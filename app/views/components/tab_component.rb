class TabComponent < ApplicationComponent
  def initialize(name:, open:)
    @name = name
    @open = open
    @id = name.gsub(" ", "_").gsub(/[^a-zA-Z\d\w]/, "").downcase
  end

  def clickable_tab_template
    template_tag(id: "template_#{@id}") do
      li(class: "p-1 rounded bg-cyan-800 text-white") do
        label(for: @id) { @name }
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
