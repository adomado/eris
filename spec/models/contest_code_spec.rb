require "spec_helper"

describe ContestCode do
 
  before(:each) do
    @contest = Contest.new({"end_date(3i)" => "3",
                                "start_date(1i)" => "2010",
                                "name" => "Free SMS",
                                "winners_per_result" => "1",     
                                "start_date(2i)" => "10", 
                                "start_date(3i)" => "1", 
                                "is_active" => "1", 
                                "result_interval" => "1", 
                                "end_date(1i)" => "2010", 
                                "end_date(2i)" => "10"})

  end   
  
  it "should belongs to contest" do
    ContestCode.reflect_on_association(:contest).macro.should == :belongs_to
  end
  
  it "should validate csv format" do
    contest_code = ContestCode.new({"code" => "aa, bb, cc"})
    code = ContestCode.validate_csv(@contest, contest_code.code)
    code[:status].should be_true
  end
  
  it "should not validate csv format is code in csv format is less then required" do
    code = ContestCode.validate_csv(@contest, ["aa, bb, cc, dd"])
    code[:status].should be_false
  end
  
  it "should save contest code" do
    contest_code = ContestCode.new({"code" => "aa, bb, cc"})
    save_contest = ContestCode.create_new_csv("141", contest_code)
debugger
    save_contest.should be_true
  end
  
end
