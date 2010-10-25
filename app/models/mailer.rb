class Mailer < ActionMailer::Base

  def contest_code(name, email, code_id)
    subject    'Congratulations for winning cotest'
    recipients email
    from       'AdomadoTeam'
    sent_on    Time.now()
    body[:name] = name 
    body[:id] = code_id
    body[:host] = ADOMADO_HOST
  end

  def send_code(name, email, code)
    subject     'Congratulations for Contest code'
    recipients  email
    from        'AdoMado Team'
    sent_on     Time.now()
    body[:name] = name
    body[:code] = code
  end  
end
