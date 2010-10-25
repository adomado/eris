Factory.define :contest do |a|
  a.name                {Factory.next(:test)}
  a.start_date          "2010-10-15"
  a.end_date            "2010-10-26"
  a.result_interval     3
  a.winners_per_result  2
  a.is_active           true 
end

Factory.define :contest1, :class => Contest do |a|
  a.name                {Factory.next(:test)}
  a.start_date          "2010-10-15"
  a.end_date            "2010-10-26"
  a.result_interval     3
  a.winners_per_result  2
  a.is_active           true
  a.id                  41
end
