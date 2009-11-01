require 'appengine-rack'
require 'app'

AppEngine::Rack.configure_app(
  :application => 'twtrapid',
  :version => 'current')

run Sinatra::Application
