class ErrorMessagesComponent < SchladmingComponent
  def initialize(resource:)
    @resource = resource
  end

  def render?
    @resource.errors.any?
  end

  def view_template
    div(class: "bg-rose-200 text-center p-4") do
      h3(class: "font-medium") do
        "#{@resource.errors.count} fel gjorde att din #{@resource.model_name.human} inte kunde sparas:"
      end
      @resource.errors.full_messages.each do |message|
        div { message.to_s }
      end
    end
  end
end
