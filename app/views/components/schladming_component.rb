# frozen_string_literal: true

class SchladmingComponent < Phlex::HTML
	include Phlex::Rails::Helpers::Routes

  register_value_helper :controller_name
  register_value_helper :current_user
  register_value_helper :devise_controller?
  register_value_helper :flash
  register_value_helper :params
  register_value_helper :request

	if Rails.env.development?
		def before_template
			comment { "Before #{self.class.name}" }
			super
		end
	end
end
