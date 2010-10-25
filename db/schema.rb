# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101005081300) do

  create_table "contest_codes", :force => true do |t|
    t.integer  "contest_id"
    t.string   "code"
    t.string   "claim_id"
    t.boolean  "is_used"
    t.boolean  "is_open"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contest_winners", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.integer  "user_id"
    t.integer  "contest_id"
    t.integer  "contest_code_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contests", :force => true do |t|
    t.string   "name"
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "result_interval"
    t.integer  "winners_per_result"
    t.boolean  "is_active"
    t.date     "last_result_on"
    t.integer  "code_expires_in"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
