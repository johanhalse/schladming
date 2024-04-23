module UI
  module Images
    def strat_url(filename)
      if Stratocaster.config.uploader == :cloud
        "https://#{Stratocaster.config.cloud_config[:bucket]}.fra1.cdn.digitaloceanspaces.com/#{filename}"
      else
        "/images/#{filename}"
      end
    end
  end
end
