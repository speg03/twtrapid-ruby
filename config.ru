require 'rubygems'
require 'appengine-rack'
require 'rb-gae-support'
require 'app'

AppEngine::Rack.configure_app(
  :application => 'twtrapid',
  :version => 1)

run Sinatra::Application
