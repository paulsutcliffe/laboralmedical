class CreateHomes < ActiveRecord::Migration
  def self.up
    create_table :homes do |t|
      t.string :slide_file_name
      t.string :slide_content_type
      t.integer :slide_file_size
      t.datetime :slide_updated_at
      t.text :caption

      t.timestamps
    end
  end

  def self.down
    drop_table :homes
  end
end
