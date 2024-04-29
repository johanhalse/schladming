class ImageFieldComponent< SchladmingComponent
  include Phlex::Rails::Helpers::T
  include UI::Classes
  include UI::Images

  register_element :image_preview_controller

  def initialize(form:, name:)
    @form = form
    @name = name
  end

  def filename
    @form.object.send("#{@name}_filename")
  end

  def filled_preview_field
    return if filename.blank?

    @form.label(@name, class: "grow cursor-pointer") do
      img(src: strat_url(filename), alt: "")
    end
  end

  def empty_preview_field
    return if filename.present?

    @form.label(@name, class: "cursor-pointer bg-neutral-200 w-full h-[180px] flex items-center justify-center") do
      t(".empty")
    end
  end

  def view_template
    image_preview_controller(class: FIELD_CONTAINER) do
      @form.label(@name, class: FIELD_LABEL)

      div(class: "w-2/3 max-w-sm") do
        div(class: "flex", data: { image_preview_target: "container" }) do
          filled_preview_field
          empty_preview_field
        end
        @form.file_field(@name, class: "shrink", data: { action: "change->image-preview#preview" })
      end
    end
  end
end
