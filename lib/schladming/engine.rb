module Schladming
  class Engine < ::Rails::Engine
    isolate_namespace Schladming

    ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
      parts = html_tag.split('>', 2)
      parts[0] += ' class="field_with_errors">'
      (parts[0] + parts[1]).html_safe
    end

    initializer "schladming.init" do |app|
      require "phlex-rails"
      require "url"

      ActiveSupport::Inflector.inflections(:en) do |inflect|
        inflect.acronym "UI"
      end

      Rails.autoloaders.main.push_dir("#{root}/app/views")
      Rails.autoloaders.main.push_dir("#{root}/app/views/layouts")
      Rails.autoloaders.main.push_dir("#{root}/app/views/components")
      Rails.application.config.assets.precompile += %w[schladming-tailwind.css inter-font.css flatpickr.min.css schladming.js]
    end
  end
end
