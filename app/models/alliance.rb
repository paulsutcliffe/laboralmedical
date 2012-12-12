class Alliance < ActiveRecord::Base
  
  has_attached_file :logo,
                      :styles => {
                      :original => ["800x600", :jpg],
                      :thumb => ["300x240", :jpg]
                      }
end
