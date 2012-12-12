class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.string :title
      t.string :picture_file_name
      t.string :picture_content_type
      t.integer :picture_file_size
      t.datetime :picture_updated_at
      t.text :content
      t.integer :category_id
      t.string :slug

      t.timestamps
    end
    
    add_index :posts, :category_id
    add_index :posts, :slug, :unique => true
  end
  
  

  def self.down
    drop_table :posts
  end
end
