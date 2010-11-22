class ContestCodesController < ApplicationController

  #layout "contest_codes"
  before_filter :require_login, :only => [:show] 
    
  def show
    session[:code_id] = params[:id]
    id = session[:code_id]
    email = session[:email]
    if session[:user_id]
      winner_email = ContestWinner.find_by_contest_code_id(id)
      if winner_email
        contest = Contest.find_by_id(winner_email.contest_id)
        if winner_email.email == email
          @contest_code = ContestCode.find_by_id(id)
          if @contest_code.created_at + contest.code_expires_in.days > Date.today
            send_mail = Mailer.deliver_send_code(winner_email.name,email,@contest_code.code)
            @contest_code.update_attributes(:is_open => true)
          else
            @contest_code = nil
          end
        else
          @contest_code = nil
        end
      else
        redirect_to(:action => 'error')
      end
    else
      session[:pre_uri] = request.request_uri
      redirect_to(:controller => 'auth', :action => 'login')
    end 
 
  end
  
  def error
    
  end
  
      
end
