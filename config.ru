
if ENV['RAILS_ENV'] == 'production'
  ENV['HOME'] = "/home/railsmedlab"
  ENV['GEM_HOME'] = "/home/railsmedlab/.gems"
  ENV['GEM_PATH'] = "/home/railsmedlab/.gems"
end

# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run LaboralmedicalperuCom::Application
