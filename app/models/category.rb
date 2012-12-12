class Category < ActiveRecord::Base
  has_many :albums
  has_many :members
  has_many :photos
  has_many :posts
  has_many :services
end
