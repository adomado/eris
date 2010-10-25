require "spec_helper"

describe ContestsController do
  

#  before do
#    @attrs = Factory.create(:contest)
#    @code = Factory.create(:contest_code)
#  end
  hash_val = {"end_date(3i)" => "3",
                                "start_date(1i)" => "2010",
                                "name" => "Free SMS",
                                "winners_per_result" => "1",     
                                "start_date(2i)" => "10", 
                                "start_date(3i)" => "1", 
                                "is_active" => "1", 
                                "result_interval" => "1", 
                                "end_date(1i)" => "2010", 
                                "end_date(2i)" => "10"}

  h_val = {"start_date" => "2010-10-15",
                        "end_date"  =>  "2010-10-26",
                        "name" => "Free SMS",
                        "winners_per_result" => "1",     
                        "is_active" => "1", 
                        "result_interval" => "1",
                        "id" => "41" }
                                                   
  def save_contest
    @contest = mock_model(Contest, :save => nil)
    Contest.stub!(:new).and_return @message
  end
  
  def create_contest(options = {},options1 = {})
    post :create, :contest => {"end_date(3i)" => "3",
                                "start_date(1i)" => "2010",
                                "name" => "Free SMS",
                                "winners_per_result" => "1",     
                                "start_date(2i)" => "10", 
                                "start_date(3i)" => "1", 
                                "is_active" => "1", 
                                "result_interval" => "1", 
                                "end_date(1i)" => "2010", 
                               "end_date(2i)" => "10"}.merge(options), :contest_code => {"code" => "aa,bb,cc"}.merge(options1)
  end
  

  it "should save value in contest table" do 
  end  

  it "should create new contest" do    
    create_contest
    flash[:notice].should == "Contest successfully created."

  end
    
    it "should error msg if winner per result is not integer" do
      create_contest("winners_per_result" => "a")
      flash[:notice].should == "Enter your valid Result interval or Winners per result"
    end
   
  it "should error msg if winner per result is blank" do
      create_contest("winners_per_result" => nil)
      flash[:notice].should == "Enter your valid Result interval or Winners per result"
    end

  it "should error msg if result interval is not integer" do
      create_contest("result_interval" => "a")
      flash[:notice].should == "Enter your valid Result interval or Winners per result"
    end
   
  it "should error msg if result interval is blank" do
      create_contest("result_interval" => nil)
      flash[:notice].should == "Enter your valid Result interval or Winners per result"
    end
    
  it "should error msg if contest code is blank" do
    create_contest(hash_val,"code" => "")
    flash[:notice].should == "Check your contest codes in numbers"
  end

  it "should error msg if contest code is more then required" do
    create_contest(hash_val,"code" => "aa,bb,cc,dd")
    flash[:notice].should == "Check your contest codes in numbers"
  end
  
  it "should error msg if contest code is less then required" do
    create_contest(hash_val, "code" => "aa, bb")
    flash[:notice].should == "Check your contest codes in numbers"
  end


    it "should deactive contest status" do
      put :deactivate, :id => "41"
      response.template.assigns["contest"]["is_active"].should be_false 
    end

  it "should active contest status" do
    put :activate, :id => "41"
    response.template.assigns["contest"]["is_active"].should be_true 
  end

  it "should delete contest" do
    :destory
    response.should be_success

  end     
end
