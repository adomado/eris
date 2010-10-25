When /^I follow  New contest$/ do
  click_link("Add new contest")
end

When /^I fill full form$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => 1
  fill_in "Winners per result", :with => 1
  fill_in "Code", :with => "aa,bb"
  fill_in "Start date", :with => "2010-10-25"
  fill_in "End date", :with => "26 Oct 2010"
  fill_in "Code expires in", :with => 4
end

When /^I fill form without start date$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => 1
  fill_in "Winners per result", :with => 1
  fill_in "End date", :with => "2010-10-25"
end

When /^I fill form without end date$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => 1
  fill_in "Winners per result", :with => 1
  fill_in "Start date", :with => "2010-10-25"
end

When /^I fill full form but repeat contest code$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => 1
  fill_in "Winners per result", :with => 2
  fill_in "Code", :with => "aa,aa,bb,cc"
  fill_in "Start date", :with => "2010-10-25"
  fill_in "End date", :with => "26 Oct 2010"
end

When /^I fill form without code entry$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => 1
  fill_in "Winners per result", :with => 1
  fill_in "Start date", :with => "2010-10-25"
  fill_in "End date", :with => "26 Oct 2010"
end

When /^I fill form without integer value in Result interval and Winners per result$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Result interval", :with => "a"
  fill_in "Winners per result", :with => "b"
  fill_in "Start date", :with => "2010-10-25"
  fill_in "End date", :with => "25 Oct 2010"
end

When /^I fill form without  Result interval and Winners per result value$/ do
  fill_in "Name", :with => "kashif"
  fill_in "Winners per result", :with => "b"
  fill_in "Start date", :with => "2010-10-25"
  fill_in "End date", :with => "25 Oct 2010"
end

When /^I fill full form but start date is greater then end date$/ do
  fill_in "Start date", :with => "2010-10-29"
  fill_in "End date", :with => "26 Oct 2010"
end

When /^I press create$/ do
  click_button("Create")
end




Given /^a contest with (\d+) winners in (\d+) days with (\d+) winners per day$/ do |num_winners, num_days, interval|
    @contest = Contest.create(:name => "Test Contest", :start_date => Date.today, 
                         :end_date => Date.today + num_days.to_i, 
                         :result_interval => interval.to_i,
                         :winners_per_result => num_winners.to_i, :is_active => true)
    @contest.errors.should_not be_nil
end

Then /^it should declare (\d+) winners in (\d+) days$/ do |num_winners, num_days|
  @contest = Contest.new(:name => "Test Contest", :start_date => Date.today - 5, 
                         :end_date => Date.today + 5, 
                         :result_interval => num_days.to_i,
                         :winners_per_result => num_winners.to_i, 
                         :is_active => true,
                         :last_result_on => Date.today - num_days.to_i)
                                            
    @contest.need_winner?.should be_true
end

Given /^A contest dates are givens for date (\d+) Oct, (\d+)$/ do |arg1, arg2|
  
end

When /^start date "([^"]*)" end date "([^"]*)" and last result on "([^"]*)" and result interval is (\d+) days$/ do |start_date, end_date, last_result_on, result_interval|
  @contest = Contest.create(:name => "Test Contest", :start_date => start_date, 
                         :end_date => end_date, 
                         :result_interval => result_interval.to_i,
                         :winners_per_result => 2, 
                         :is_active => true,
                         :last_result_on => last_result_on) 
                                         
end

Then /^it should declare result$/ do
  @contest.need_winner?.should be_true
end

Then /^it should not declare result$/ do
  @contest.need_winner?.should be_false
end

Then /^it should declare winner$/ do
  @contest.declare_winner.should be_true
end

Then /^it should save value in contest winner table$/ do
  @contest.save_contest_winner.should be_true
end

