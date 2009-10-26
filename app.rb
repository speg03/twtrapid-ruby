#!/usr/bin/env ruby

require 'yaml'

require 'rubygems'
require 'rb-gae-support'
require 'oauth'
require 'sinatra'

enable :sessions

configure do
  key = YAML::load_file('key.yml')
  CONSUMER_KEY = key['consumer_key']
  CONSUMER_SECRET = key['consumer_secret']
  SITE = 'http://twitter.com'
  consumer = OAuth::Consumer.new(CONSUMER_KEY, CONSUMER_SECRET, :site => SITE)
  set :consumer, consumer
end

# access_token = OAuth::AccessToken.new(
#   consumer,
#   key['access_token'],
#   key['access_token_secret']
# )

def verify
  unless GAE::User.logged_in?
    redirect GAE::User.login_url('/')
  else
    user = GAE::User.current
    access_token = GAE::Memcache[user.email + '(access token)']
    access_secret = GAE::Memcache[user.email + '(access secret)']

    if access_token && access_secret
      @twitter = OAuth::AccessToken.new(options.consumer, access_token, access_secret)
    else
      request_token = options.consumer.get_request_token(
        :oauth_callback => "http://twtrapid.appspot.com/verified")
      session[:request_token] = request_token.token
      session[:request_token_secret] = request_token.secret
      redirect request_token.authorize_url
    end
  end
end

get '/logout' do
  redirect GAE::User.logout_url('/')
end

get '/verified' do
  request_token = OAuth::RequestToken.new(
    options.consumer, session[:request_token], session[:request_token_secret])

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
  # redirect '/timeline.html'
  "Hello, Twitter!"
end

get '/friends_timeline' do
  verify
  @twitter.get(
    "http://twitter.com/statuses/friends_timeline.json?#{request.query_string}"
  ).body
end
