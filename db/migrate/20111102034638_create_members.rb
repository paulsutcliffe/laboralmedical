class CreateMembers < ActiveRecord::Migration
  def self.up
    create_table :members do |t|
      t.string :name
      t.text :description
      t.string :avatar_file_name
      t.string :avatar_content_type
      t.integer :avatar_file_size
      t.datetime :avatar_updated_at
      t.integer :category_id
      t.string :email

      t.timestamps
    end
    add_index :members, :category_id
  end
  
  

  def self.down
    drop_table :members
  end
end
