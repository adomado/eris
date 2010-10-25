Given /^A contest which is valid and running$/ do
   contest = Contest.first
   contest.should be_true
end

When /^we have valid contestants$/ do
  declare_winner = Contest.declare_winner
  declare_winner.should be_true
end

When /^A winner is selected from valid contestants$/ do
  pending # express the regexp above with the code you wish you had
end

Then /^He should get an email and sms notifications$/ do
  pending # express the regexp above with the code you wish you had
end

Given /^A user is contest winner$/ do
  pending # express the regexp above with the code you wish you had
end

When /^he visits ADOMADO to claim his prize$/ do
  pending # express the regexp above with the code you wish you had
end

When /^contest code has not expired$/ do
  pending # express the regexp above with the code you wish you had
end

Then /^he is shown a congratulation page with his contest code$/ do
  pending # express the regexp above with the code you wish you had
end

Then /^he is also sent the code in his email$/ do
  pending # express the regexp above with the code you wish you had
end

Then /^contest is maked as used$/ do
  pending # express the regexp above with the code you wish you had
end

