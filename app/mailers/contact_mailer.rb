class ContactMailer < ActionMailer::Base
  default :from => "info@laboralmedicalperu.com"
  
  def send_message(contact)
    @contact = contact
    mail(:to => "info@laboralmedicalperu.com", :subject => "Mensaje desde la web")
  end
  
  def message_confirmation(contact)
    @contact = contact
    mail(:to => "#{contact.name} <#{contact.email}>", :subject => "Mensaje Enviado")
  end
end
