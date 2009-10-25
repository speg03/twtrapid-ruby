#!/usr/bin/env ruby

require 'yaml'

require 'rubygems'
require 'rb-gae-support'
require 'oauth'
require 'sinatra'

key = YAML::load_file('key.yml')
consumer = OAuth::Consumer.new(
  key['consumer_key'],
  key['consumer_secret'],
  :site => key['site']
)
access_token = OAuth::AccessToken.new(
  consumer,
  key['access_token'],
  key['access_token_secret']
)

before do
  unless GAE::User.logged_in?
    redirect GAE::User.login_url('/')
  end
end

get '/logout' do
  redirect GAE::User.logout_url('/')
end

get '/' do
  redirect '/index.html'
end

get '/friends_timeline' do
  access_token.get(
    "http://twitter.com/statuses/friends_timeline.json?#{request.query_string}"
  ).body
end
