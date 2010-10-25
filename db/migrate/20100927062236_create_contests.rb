class CreateContests < ActiveRecord::Migration
  def self.up
    create_table :contests do |t|
      t.string :name
      t.date :start_date
      t.date :end_date
      t.integer :result_interval
      t.integer :winners_per_result
      t.boolean :is_active
      t.date :last_result_on
      t.integer :code_expires_in 

      t.timestamps
    end
  end

  def self.down
    drop_table :contests
  end
end
