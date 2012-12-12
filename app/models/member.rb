class Member < ActiveRecord::Base
  belongs_to :category

  has_attached_file :avatar,
                    :styles => {
                    :original => ["800x600", :jpg],
			              :thumb => ["210x210#", :jpg]
  			}
  
end
