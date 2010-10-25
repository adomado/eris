require 'test_helper'

class MailerTest < ActionMailer::TestCase
  test "emailed_code" do
    @expected.subject = 'Mailer#emailed_code'
    @expected.body    = read_fixture('emailed_code')
    @expected.date    = Time.now

    assert_equal @expected.encoded, Mailer.create_emailed_code(@expected.date).encoded
  end

end
