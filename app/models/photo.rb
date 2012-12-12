class Photo < ActiveRecord::Base
  belongs_to :album

  has_attached_file :photo,
			    :styles => {
			  	:original => ["780x530#", :jpg],
				  :thumb => ["220x150#", :jpg]
			}
end
