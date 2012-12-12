class Post < ActiveRecord::Base
  belongs_to :category
  
  has_attached_file :picture,
                      :styles => {
                      :original => ["800x600", :jpg],
                      :regular => ["400x250#", :jpg],
		                  :thumb => ["120x100#", :jpg]
                      }
  
  extend FriendlyId
  friendly_id :title, :use => :slugged
end
