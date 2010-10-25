# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.5' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')


Rails::Initializer.run do |config|
  
  config.gem "configatron"
  config.gem "httparty"
  config.gem "jrails"
  config.gem 'will_paginate', :version => '~> 2.3.11', :source => 'http://gemcutter.org'
#  config.gem "smtp_tls"
  config.time_zone = 'UTC'
#  config.action_mailer.delivery_method = :sendmail
#  config.action_mailer.perform_deliveries = false
#  config.action_mailer.default_charset = "utf-8"
  
end
configatron.configure_from_yaml(File.join(File.dirname(__FILE__), 'app.yml'))

