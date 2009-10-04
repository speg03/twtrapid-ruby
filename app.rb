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

get '/friends_timeline' do
  response = access_token.get(
    key['site'] + '/statuses/friends_timeline.json' +
    (params['since_id'] ? '?since_id=' + params['since_id'] : '')
  )
  response.body
end

post '/update_status' do
  response = access_token.post(
    key['site'] + '/statuses/update.json',
    'status' => params['status']
  )
  response.body
end
