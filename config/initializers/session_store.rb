# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_eris_session',
  :secret      => '2bb656cdaad72548bb63f46e8d03bbd209714950ec1e121f76f62096a88ed43613d27ea144b654a63361836cb218e12407b0fe4d02a11923ef38e4d8c3e5d90a'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
