require 'appengine-rack'
require 'app'

AppEngine::Rack.configure_app(
  :application => 'twtrapid',
  :version => 1)

run Sinatra::Application
