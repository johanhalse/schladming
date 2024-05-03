module ActionDispatch::Routing
  class Mapper
    def admin_resources(*resources)
      resources.each do |resource|
        resource_name = resource.is_a?(Symbol) ? resource : resource.keys.first
        namespace :admin do
          resources(resource_name)
        end
      end
    end
  end
end
