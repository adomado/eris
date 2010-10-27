class AuthController < ApplicationController

  def login
    db = configatron.contest.database
    tbl = configatron.contest.table
    if request.post?
      resp = Net::HTTP.post_form(URI.parse('http://adomado.com/api/auth/start'),{:email => params[:email], :password =>  params[:password], :format => 'json'})
      if JSON::parse(resp.body)["status"]["code"] == 200
        session[:user_id] = true
        session[:email] = params[:email]
        if session[:pre_uri]
          redirect_to(session[:pre_uri])
        else  
          redirect_to(:action => "index" , :controller => 'contests')
        end
      else
        flash.now[:notice] = "Invalid user/password combination"
      end
    end
  end

  def logout
    if session[:user_id]
      reset_session
      redirect_to(:controller => 'auth', :action => 'login')
    end  
  end


  
end
