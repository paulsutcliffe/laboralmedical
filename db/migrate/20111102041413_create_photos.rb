class CreatePhotos < ActiveRecord::Migration
  def self.up
    create_table :photos do |t|
      t.string :photo_file_name
      t.string :photo_content_type
      t.integer :photo_file_size
      t.datetime :photo_updated_at
      t.string :name
      t.integer :album_id
      t.integer :category_id

      t.timestamps
    end
    add_index :photos, :album_id
    add_index :photos, :category_id
  end
  
  

  def self.down
    drop_table :photos
  end
end
