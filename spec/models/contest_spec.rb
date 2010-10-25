require "spec_helper"

describe Contest do
  
  before do
    @contest = Factory.build(:contest)
  end

  def contest_value(option ={})
    @contest = Contest.new({:name => "Test Contest", :start_date => "12 Oct 2010", 
                         :end_date => "10 Nov 2010", 
                         :result_interval => 3,
                         :winners_per_result => 1, 
                         :is_active => true,
                         :last_result_on => "15 Oct 2010"}.merge(option)) 
  end
  
  it "should has many contest code" do
    Contest.reflect_on_association(:contest_codes).macro.should == :has_many
  end
  
  it "should return true, if start date 15 Sep 2010, end date 10 Oct 2010 and last result on 18 Sep 2010 and result interval is 3 days" do
    contest_value
    @contest.need_winner?.should be_true
  end
  
  it "shoul return false, if start date 15 Sep 2010 end date 20 Sep 2010 and last result on 18 Sep 2010 and result interval is 3 days" do
    contest_value({:end_date => "20 Sep 2010"})
    @contest.need_winner?.should_not be_true
  end
  
  it "should return true, if start date 29 Sep 2010 end date 15 Oct 2010 and last result on 05 Oct 2010 and result interval is 3 days" do
    contest_value({:start_date => "29 Sep 2010",
                   :end_date => "25 Oct 2010",
                   :last_result_on => "05 Oct 2010",
                   :result_interval => 3})
    @contest.need_winner?.should be_true
  end
  
  it "should return false, if start date '28 sep Oct 2010' end date '15 Oct 2010' and last result on '2 Oct 2010' and result interval is 2 days" do
    contest_value({:start_date => "28 Sep 2010",
                   :end_date => "25 Oct 2010",
                   :last_result_on => "06 Oct 2010",
                   :result_interval => 2})  
    @contest.need_winner?.should be_true
  end
  
  it "should return true, if winner declared successfully" do
    @contest1 = Factory.build(:contest1)    
    @contest1.declare_winner.should be_true            
  end
  
  it "should deactivate old contests" do
    contest_value({:start_date => "29 Sep 2010",
                   :end_date => "15 Oct 2010",
                   :result_interval => 2})
    resp = Contest.deactivate_contest
    resp.should be_true
  end
  

end
