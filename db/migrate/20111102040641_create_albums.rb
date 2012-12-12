class CreateAlbums < ActiveRecord::Migration
  def self.up
    create_table :albums do |t|
      t.string :slug
      t.string :name
      t.string :polaroid_file_name
      t.string :polaroid_content_type
      t.integer :polaroid_file_size
      t.datetime :polaroid_updated_at
      t.integer :category_id

      t.timestamps
    end
    add_index :albums, :category_id
    add_index :albums, :slug, :unique => true
  end
  
  

  def self.down
    drop_table :albums
  end
end
