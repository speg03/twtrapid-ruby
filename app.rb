require 'yaml'

require 'rubygems'
require 'sinatra'

require 'twtrapid'


configure do
  key = YAML::load_file('key.yml')
  SITE = 'http://twitter.com'

  Twtrapid.init(
    :consumer_key => key['consumer_key'],
    :consumer_secret => key['consumer_secret'],
    :site => SITE)
end


get '/login' do
  redirect Twtrapid.login_url('/')
end

get '/logout' do
  redirect Twtrapid.logout_url('/')
end

get '/oauth_callback' do
  Twtrapid.authorize(
    :oauth_token => params[:oauth_token],
    :oauth_verifier => params[:oauth_verifier])

  redirect '/'
end

get '/' do
  if not Twtrapid.logged_in?
    redirect '/login'
  elsif not Twtrapid.authorized?
    redirect Twtrapid.authorize_url(
      "http://#{request.host}:#{request.port}/oauth_callback")
  end
  redirect '/timeline.html'
end

get '/friends_timeline' do
  since_id = params[:since_id] ? params[:since_id] : nil
  query = since_id ? "?since_id=#{since_id}" : ""
  Twtrapid.get(
    "#{SITE}/statuses/friends_timeline.json#{query}")
end

post '/update' do
  Twtrapid.post(
    "#{SITE}/statuses/update.json", params)
end

post '/favorites_create' do
  id = params[:id]
  Twtrapid.post(
    "#{SITE}/favorites/create/#{id}.json", {})
end

post '/favorites_destroy' do
  id = params[:id]
  Twtrapid.post(
    "#{SITE}/favorites/destroy/#{id}.json", {})
end
