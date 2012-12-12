class Service < ActiveRecord::Base
  belongs_to :category

  has_attached_file :image,
			:styles => {
			:original => ["800x600", :jpg],
			:thumb => ["620x250#", :jpg],
			:teaser => ['']
			}
  extend FriendlyId
  friendly_id :name, :use => :slugged
end
