  class Contest < ActiveRecord::Base

  has_many :contest_codes
  validates_presence_of :name, :start_date, :end_date, :result_interval, :winners_per_result
  validates_numericality_of :result_interval, :winners_per_result, :only_integer => true, :message => "can only be whole number."


  cattr_reader :per_page
  @@per_page = 10
  
  def declare_winner
    db = configatron.contest.database
    tbl = configatron.contest.table
    updated_date = configatron.contest.updated_date
    
    #Initialize variables as array
    contestants_list = []   #this will contain valid usesr for prize draw
    collect_winners = []    # This will contain winners list
    
    # Fetch all users who has already won contests    
    already_won_users = ContestWinner.find(:all, :select => "user_id", :conditions => ["updated_at <= :updated_date",{:updated_date => updated_date}])
    if already_won_users.length != 0       
      already_won_users = already_won_users.collect {|c| c.user_id} 
      
      # Fetch all valid users from earth.users table    
      winner = ActiveRecord::Base.connection.execute("select id,name,email from #{db}.#{tbl} where activated = true and id NOT IN (#{already_won_users.join(",")}) ORDER BY RAND() LIMIT #{self.winners_per_result}")
    else
      winner = ActiveRecord::Base.connection.execute("select id,name,email from #{db}.#{tbl} where activated = true ORDER BY RAND() LIMIT #{self.winners_per_result}")
    end
debugger
    winner.each do |users|
      contestants_list << users
    end
    save_winner = save_contest_winner(contestants_list)     
    return true if save_winner
        
  end


  def need_winner?
    if Date.today <= self.end_date and self.is_active == true    
      return true if Date.today >= self.last_result_on + self.result_interval.days
    end
    return false
  end
  
  def self.deactivate_contest    
    contests = Contest.find(:all, :conditions => ["end_date <= ?", Date.today])
    contests.each do |contest|    
      contest.update_attributes(:is_active => false)
    end
  end
  

  private
  
  def save_contest_winner(winners_list)
    
    contest_code = ContestCode.find(:all, :select => "id", 
                              :conditions => ["is_used = ? and contest_id = ?", false, self.id], 
                              :limit => self.winners_per_result, :order => "RAND()")
    contest_code = contest_code.collect {|c| c.id} if contest_code 
    winners_list.each_with_index do |winner, i|
      contest_code_used = ContestCode.find_by_id(contest_code[i])
      ContestWinner.create(:user_id => winner[0], :name => winner[1], :email => winner[2], 
                           :contest_id => self.id, 
                           :contest_code_id => contest_code[i]) if contest_code_used.update_attributes(:is_used => true)
    end    
    return true 
  end

end
