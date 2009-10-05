#!/usr/bin/env ruby

require 'yaml'

require 'rubygems'
require 'oauth'
require 'sinatra'

set :port, 10080

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

get '/*' do
  access_token.get(
    "#{key['site']}#{request.path}?#{request.query_string}"
  ).body
end

post '/*' do
  access_token.post(
    "#{key['site']}#{request.path}",
    params
  ).body
end
