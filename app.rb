#!/usr/bin/env ruby

require 'yaml'

require 'rubygems'
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

get '/' do
  redirect '/index.html'
end

get '/friends_timeline' do
  access_token.get(
    "http://twitter.com/statuses/friends_timeline.json?#{request.query_string}"
  ).body
end
