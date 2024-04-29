class RelationListingComponent < ApplicationComponent
  include Phlex::Rails::Helpers::LinkTo
  include UI::Classes

  register_element :clickable_row_controller

  def initialize(resources:, fields:, link: false)
    @resources = resources
    @fields = fields
    @link = link
  end

  def data(resource)
    { action: "clickable-row#click", link: url_for([:edit, :admin, resource]) } if @link
  end

  def view_template
    clickable_row_controller(class: "w-full") do
      table(class: "w-full") do
        thead do
          tr do
            @fields.each do |field|
              next th(class: "text-left px-2 last:text-right") { "Namn" } if field == :to_s
              th(class: "text-left px-2 last:text-right") { @resources.model.human_attribute_name(field) }
            end
          end
        end
        tbody do
          @resources.each do |resource|
            tr(class: "transition-colors", data: data(resource)) do
              @fields.each do |field|
                td(class: "p-2 text-left last:text-right") { resource.send(field).to_s }
              end
            end
          end
          tr(class: "hidden only:table-row") do
            td(class: "p-2") { "Finns inget att lista." }
          end
        end
      end
    end
  end
end
