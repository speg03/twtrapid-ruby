# -*- mode: ruby -*-

require 'appengine-rack'
require 'app'

AppEngine::Rack.configure_app(
  :application => 'twtrapid',
  :precompilation_enabled => true,
  :version => 'current'
#  :version => 'test'
)

run Sinatra::Application
