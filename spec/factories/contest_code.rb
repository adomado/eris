Factory.define :contest_code do |i|
  i.association(:contest, :factory => :contest)
  i.code  "aa,bb,cc,dd"
end
