module Schladming
  class Engine < ::Rails::Engine
    isolate_namespace Schladming

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
