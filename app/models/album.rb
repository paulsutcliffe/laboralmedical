class Album < ActiveRecord::Base
  belongs_to :category
  has_many :photos
  
  has_attached_file :polaroid,
                      :styles => {
                      :original => ["800x600", :jpg],
		                  :regular => ["200x135", :jpg],
                      :thumb => ["120x80", :jpg]
                      }
end
