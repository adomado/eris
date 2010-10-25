Feature: Contest Description

  So that I create a new contest
  As a contest admin
  I want to see accurate created contests


  Scenario: Create new contest with all fields entry

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill full form
    When I press create
    Then I should see "successfully created"
    
  Scenario: Create new contest without start date fields entry

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill form without start date 
    When I press create
    Then I should see "Start date and end date should not be nil"  
    
  Scenario: Create new contest without end date fields entry

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill form without end date
    When I press create
    Then I should see "Start date and end date should not be nil"  

  Scenario: Create new contest with repeated codes entry

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill full form but repeat contest code 
    When I press create
    Then I should see "Enter unique code for this contest"  


  Scenario: Do not create  contest while code is missing

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill form without code entry
    When I press create
    Then I should see "Check your contest codes in numbers"


  Scenario: Do not create  contest if Result interval and Winners per result are not integer

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill form without integer value in Result interval and Winners per result
    When I press create
    Then I should see "Enter your valid Result interval or Winners per result"


  Scenario: Do not create  contest if Result interval and Winners per result are blank

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill form without  Result interval and Winners per result value
    When I press create
    Then I should see "Enter your valid Result interval or Winners per result"


  Scenario: Do not create  contest  Start date is greater then End date

    Given I am on contest admin UI
    When I follow  New contest
    Then I should be on create page
    When I fill full form but start date is greater then end date
    When I press create
    Then I should see "Start date should be less then end date"
    
    
  Scenario: Calculate if we need a winner for the contest
    
    Given a contest with 10 winners in 5 days with 2 winners per day
    Then it should declare 2 winners in 1 days
    
  Scenario: Find result is needed or not needed
  
    Given A contest dates are givens for date 14 Oct, 2010
    When start date "15 Sep 2010" end date "20 Oct 2010" and last result on "18 Sep 2010" and result interval is 3 days
    Then it should declare result
#    And it should declare winner
    When start date "15 Sep 2010" end date "20 Sep 2010" and last result on "18 Sep 2010" and result interval is 3 days
    Then it should not declare result
    When start date "29 Sep 2010" end date "26 Oct 2010" and last result on "02 Oct 2010" and result interval is 3 days
    Then it should declare result
#    And it should declare winner
    #And it should save value in contest winner table
    When start date "28 sep Oct 2010" end date "15 Oct 2010" and last result on "4 Oct 2010" and result interval is 2 days
#    Then it should declare result
     
