class CreateContestCodes < ActiveRecord::Migration
  def self.up
    create_table :contest_codes do |t|
      t.integer :contest_id
      t.string :code
      t.string :claim_id
      t.boolean :is_used
      t.boolean :is_open 

      t.timestamps
    end
  end

  def self.down
    drop_table :contest_codes
  end
end
