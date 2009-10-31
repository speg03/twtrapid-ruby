require 'rubygems'
require 'rb-gae-support'
require 'oauth'

class Twtrapid
  def self.init(args)
    @@consumer = OAuth::Consumer.new(
      args[:consumer_key], args[:consumer_secret], :site => args[:site])
  end

  def self.logged_in?
    GAE::User.logged_in?
  end

  def self.login_url(callback_url)
    GAE::User.login_url(callback_url)
  end

  def self.authorized?
    token, secret = get_access_token
    token && secret
  end

  def self.authorize_url(callback_url)
    request_token = @@consumer.get_request_token(
      :oauth_callback => callback_url)
    set_request_token(request_token)
    request_token.authorize_url
  end

  def self.authorize(args)
    token, secret = get_request_token
    request_token = OAuth::RequestToken.new(
      @@consumer, token, secret)

    access_token = request_token.get_access_token(
      {}, :oauth_token => args[:oauth_token], :oauth_verifier => args[:oauth_verifier])

    set_access_token(access_token)
    delete_request_token
  end

  def self.logout_url(callback_url)
    delete_access_token
    GAE::User.logout_url(callback_url)
  end

  def self.get(path)
    twitter.get(path).body
  end

  def self.post(path, params)
    twitter.post(path, params).body
  end

  private

  def self.twitter
    access_token, access_secret = get_access_token
    OAuth::AccessToken.new(@@consumer, access_token, access_secret)
  end

  def self.get_access_token
    user = GAE::User.current
    [GAE::Memcache[user.email + '(access token)'], GAE::Memcache[user.email + '(access secret)']]
  end

  def self.set_access_token(access_token)
    user = GAE::User.current
    GAE::Memcache[user.email + '(access token)'] = access_token.token
    GAE::Memcache[user.email + '(access secret)'] = access_token.secret
  end

  def self.delete_access_token
    user = GAE::User.current
    GAE::Memcache.delete(user.email + '(access token)')
    GAE::Memcache.delete(user.email + '(access secret)')
  end

  def self.get_request_token
    user = GAE::User.current
    [GAE::Memcache[user.email + '(request token)'], GAE::Memcache[user.email + '(request secret)']]
  end

  def self.set_request_token(request_token)
    user = GAE::User.current
    GAE::Memcache[user.email + '(request token)'] = request_token.token
    GAE::Memcache[user.email + '(request secret)'] = request_token.secret
  end

  def self.delete_request_token
    user = GAE::User.current
    GAE::Memcache.delete(user.email + '(request token)')
    GAE::Memcache.delete(user.email + '(request secret)')
  end
end
