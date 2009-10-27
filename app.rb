#!/usr/bin/env ruby

require 'yaml'

require 'rubygems'
require 'rb-gae-support'
require 'oauth'
require 'sinatra'

configure do
  enable :sessions
  key = YAML::load_file('key.yml')
  SITE = 'http://twitter.com'
  CONSUMER = OAuth::Consumer.new(
    key['consumer_key'], key['consumer_secret'], :site => SITE)
end

def twitter
  user = GAE::User.current
  access_token = GAE::Memcache[user.email + '(access token)']
  access_secret = GAE::Memcache[user.email + '(access secret)']

  return nil unless access_token && access_secret
  OAuth::AccessToken.new(CONSUMER, access_token, access_secret)
end

def verify
  if not GAE::User.logged_in?
    redirect GAE::User.login_url('/')
  elsif not twitter
    request_token = CONSUMER.get_request_token(
      :oauth_callback => "http://#{request.host}:#{request.port}/oauth_callback")
    session[:request_token] = request_token.token
    session[:request_token_secret] = request_token.secret
    redirect request_token.authorize_url
  end
end

get '/logout' do
  user = GAE::User.current
  GAE::Memcache.delete(user.email + '(access token)')
  GAE::Memcache.delete(user.email + '(access secret)')
  redirect GAE::User.logout_url('/')
end

get '/oauth_callback' do
  request_token = OAuth::RequestToken.new(
    CONSUMER, session[:request_token], session[:request_token_secret])

  puts "oauth_token: #{params[:oauth_token]}"
  puts "oauth_verifier: #{params[:oauth_verifier]}"
  access_token = request_token.get_access_token(
    {}, :oauth_token => params[:oauth_token], :oauth_verifier => params[:oauth_verifier])

  user = GAE::User.current
  GAE::Memcache[user.email + '(access token)'] = access_token.token
  GAE::Memcache[user.email + '(access secret)'] = access_token.secret

  redirect '/'
end

get '/' do
  verify
  redirect '/timeline.html'
end

get '/friends_timeline' do
  twitter.get(
    "#{SITE}/statuses/friends_timeline.json?#{request.query_string}"
  ).body
end

post '/update' do
  twitter.post(
    "#{SITE}/statuses/update.json",
    params
  ).body
end
