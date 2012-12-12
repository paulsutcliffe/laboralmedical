class CreateServices < ActiveRecord::Migration
  def self.up
    create_table :services do |t|
      t.string :name
      t.text :description
      t.string :image_file_name
      t.string :image_content_type
      t.integer :image_file_size
      t.datetime :image_updated_at
      t.integer :category_id
      t.string :slug

      t.timestamps
    end
    
    add_index :services, :category_id
    add_index :services, :slug, :unique => true
  end
  
  

  def self.down
    drop_table :services
  end
end
