Feature: Contest Winner Description

  So that I have an existing contest 
  As a contest admin
  I want to declare winners and send then notification
  So that they can clam there prize


  Scenario: Find valid users for a running contest
    
    Given A contest which is valid and running
    When we have valid contestants
    Then pick a users who are registred 
    And are activated
    And have not already won recently
     
  Scenario: Draw a winner for an existing contest
  
    Given A contest which is valid and running 
    When A winner is selected from valid contestants
    Then He should get an email and sms notifications
      
    
  Scenario: User claims his prize
  
    Given A user is contest winner
    When he visits ADOMADO to claim his prize
    And contest code has not expired
    Then he is shown a congratulation page with his contest code
    And he is also sent the code in his email
    And contest is maked as used



