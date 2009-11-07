# -*- mode: ruby -*-

require 'appengine-rack'
require 'app'

AppEngine::Rack.configure_app(
  :application => 'twtrapid',
  :version => 'current'
#  :version => 'test'
)

run Sinatra::Application
