# Load the rails application
require File.expand_path('../application', __FILE__)

require 'extensions'
require 'modules'
#config.gem "authlogic"

# Initialize the rails application
Wikicausality::Application.initialize!
