class ContestCode < ActiveRecord::Base

  belongs_to :contest
  has_many :contest_winners

  validates_presence_of :code
  validates_uniqueness_of :code, :scope => :contest_id

  # This method used to validate inserted contest code number with required number for contest code for particular contest
  def self.validate_csv(contest, contest_codes)
    return {:status => false, :msg => "Start date and end date should not be nil"} if contest.start_date == nil or contest.end_date == nil 
    total_event_length_in_days = (contest.end_date - contest.start_date).days
    return {:status => false, :msg => "Start date should be less then end date."} if Float(total_event_length_in_days) < 0
    result_interval = contest.result_interval
    winners_per_result = contest.winners_per_result
    return {:status => false, :msg => "Enter your valid Result interval or Winners per result"} if result_interval.to_i == 0 or winners_per_result.to_i == 0
    
    result_interval = result_interval * 24 * 3600 
    number_of_events = (Float(total_event_length_in_days + 1) / result_interval).ceil
    contest_code_number = number_of_events * winners_per_result    
    if contest_code_number == contest_codes.split(",").length
      if contest_codes.split(",").uniq.length == contest_codes.split(",").length
        return {:status => true, :msg => ""}
      else
        return {:status => false, :msg => "Enter unique code for this contest"}
      end    
    else
      return {:status => false, :msg => "Check your contest codes in numbers"}
    end
     
  end


  # Insert value in contest_codes table with contest id.
  def self.create_new_csv(contest_id, contest_codes)
    contest_codes.code.split(",").each do |contest_code|
      new_contest_code = ContestCode.new("contest_id" => contest_id, "code" => contest_code, "is_used" => false, "is_open" => false)      
      return false if !new_contest_code.save
    end    
    return true
  end

  
end
