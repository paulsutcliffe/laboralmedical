ActionMailer::Base.smtp_settings = {
  :address              => "mail.laboralmedicalperu.com",
  :port                 => 587,
  :domain               => "laboralmedicalperu.com",
  :user_name            => "info@laboralmedicalperu.com",
  :password             => "Sx3ghmb?",
  :authentication       => "plain",
  :enable_starttls_auto => false
}

ActionMailer::Base.default_url_options[:host] = "laboralmedicalperu.com"
