class Home < ActiveRecord::Base
  
  has_attached_file :slide,
                      :styles => {
                      :original => ["960>x960>", :jpg],
                      :slide => ["615x250#", :jpg]
                      }
  
end
