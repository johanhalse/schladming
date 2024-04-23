# frozen_string_literal: true

class SchladmingView< SchladmingComponent
	# The ApplicationView is an abstract class for all your views.

	# By default, it inherits from `ApplicationComponent`, but you
	# can change that to `Phlex::HTML` if you want to keep views and
	# components independent.

	def t(key)
		I18n.t(key)
	end
end
