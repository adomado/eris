class ContestsController < ApplicationController
  
  before_filter :require_login
  
  # GET /contests
  # GET /contests.xml
  def index
#    if session[:user_id]
      @contests = Contest.paginate :page => params[:page], :order => 'created_at DESC'
      respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @contests }
      end
#    else
#      session[:pre_uri] = request.request_uri
#      redirect_to(:controller => 'auth', :action => 'login')
#    end  
  end

  # GET /contests/1
  # GET /contests/1.xml
  def show
    @contest = Contest.find(params[:id])
    

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @contest }
    end
  end

  # GET /contests/new
  # GET /contests/new.xml
  def new
#  if session[:user_id]
      @contest = Contest.new
      @contest_code = ContestCode.new

      respond_to do |format|
        format.html # new.html.erb
        format.xml  { render :xml => @contest }
      end
#   end   
  end


  # POST /contests
  # POST /contests.xml
  def create
    @contest = Contest.new(params[:contest])
    @contest[:last_result_on] = @contest[:start_date]
    @contest_code = ContestCode.new(params[:contest_code])
    cc_status = ContestCode.validate_csv(@contest, @contest_code.code)

    if cc_status[:status]
      contest_val = @contest.save
      if contest_val == true
        cc_code_saved = ContestCode.create_new_csv(@contest.id, @contest_code)
        if cc_code_saved
          flash[:success] = 'Contest successfully created.'
          redirect_to(@contest)
        else
          flash[:notice] = 'Contest code not created successfully.'
          render :action => "new"
        end
      else
        render :action => "new"
      end
    else
      flash[:notice] = cc_status[:msg]
      render :action => "new"
    end
  end


  # Deactivate /contests/1
  # Deactivate/contests/2
  def deactivate
    @contest = Contest.find(params[:id])
    @contest.is_active = false
    @contest.save
    respond_to do |format|
      format.html { redirect_to(contests_url) }
      format.xml  { head :ok }
    end
  end


  # Activate /contest/1
  # Activate /contest/1.xml
  def activate
    @contest = Contest.find(params[:id])
    @contest.is_active = true
    @contest.save
    respond_to do |format|
      format.html { redirect_to(contests_url) }
      format.xml  { head :ok }
    end
  end

  
  # DELETE /contests/1
  # DELETE /contests/1.xml
  def destroy
    @contest = Contest.find(params[:id])
    @contest.destroy

    respond_to do |format|
      format.html { redirect_to(contests_url) }
      format.xml  { head :ok }
    end
  end

end
