class Contact < ActiveRecord::Base
  
  EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  
  validates :name, :presence => true, :length => { :maximum => 200 }
  validates :mobile, :presence => true, :length => { :maximum => 20 }
  validates :email, :presence => true, :length => { :maximum => 100 }, 
    :format => EMAIL_REGEX
  validates :phone, :presence => true, :length => { :maximum => 20 }
  validates :message, :presence => true
  
end
