module ActionDispatch::Routing
  class Mapper
    def admin_resources(*resources)
      resources.each do |resource|
        namespace :admin do
          resources resource
        end
      end
    end
  end
end
