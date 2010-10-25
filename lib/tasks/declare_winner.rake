namespace :adomado do
  namespace :contest do
    desc "Declare winner for contest and send him email notifications"
    task :declare_winner => :environment do
      contests = Contest.find(:all, :conditions => ["is_active = ? and end_date >= ?", true, Date.today])
        contests.each do |contest|
          if contest.need_winner?    
            contest.declare_winner
            contest.update_attributes(:last_result_on => Date.today)
          end  
        end
      Contest.deactivate_contest 
    end
  end  
end
