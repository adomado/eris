class CreateContestWinners < ActiveRecord::Migration
  def self.up
    create_table :contest_winners do |t|
      t.string :name
      t.string :email
      t.integer :user_id
      t.integer :contest_id
      t.integer :contest_code_id

      t.timestamps
    end
  end

  def self.down
    drop_table :contest_winners
  end
end
