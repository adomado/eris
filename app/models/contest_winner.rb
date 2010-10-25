class ContestWinner < ActiveRecord::Base

  belongs_to :contest_code
  after_create :send_email
  
  def send_email
    email = Mailer.deliver_contest_code(self.name, self.email, self.contest_code_id)
  end
end
