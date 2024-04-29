require_relative "lib/schladming/version"

Gem::Specification.new do |spec|
  spec.authors     = ["Johan Halse"]
  spec.description = "It uses Phlex and is thus superior to everything else, QED"
  spec.email       = ["johan@hal.se"]
  spec.homepage    = "https://schladming.hal.se"
  spec.license     = "MIT"
  spec.name        = "schladming"
  spec.summary     = "Another goddam admin for Rails"
  spec.version     = Schladming::VERSION

  spec.metadata["allowed_push_host"] = "https://rubygems.org"
  spec.metadata["changelog_uri"] = "https://github.com/johanhalse/schladming/CHANGELOG.md"
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/johanhalse/schladming"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "pagy", ">= 8.2.0"
  spec.add_dependency "phlex-rails", ">= 1.1.0"
  spec.add_dependency "pundit", ">= 2.3.0"
  spec.add_dependency "qasa-url", ">= 0.1.0"
  spec.add_dependency "rails", ">= 7.1.0"
  spec.add_dependency "tailwindcss-rails", ">= 2.4.0"
end
