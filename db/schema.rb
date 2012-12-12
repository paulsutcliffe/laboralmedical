# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120103212100) do

  create_table "admin_users", :force => true do |t|
    t.string   "first_name",      :limit => 25
    t.string   "last_name",       :limit => 50
    t.string   "username",        :limit => 25
    t.string   "email",           :limit => 100, :default => "", :null => false
    t.string   "hashed_password", :limit => 40
    t.string   "salt",            :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["username"], :name => "index_admin_users_on_username"

  create_table "albums", :force => true do |t|
    t.string   "slug"
    t.string   "name"
    t.string   "polaroid_file_name"
    t.string   "polaroid_content_type"
    t.integer  "polaroid_file_size"
    t.datetime "polaroid_updated_at"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "albums", ["category_id"], :name => "index_albums_on_category_id"
  add_index "albums", ["slug"], :name => "index_albums_on_slug", :unique => true

  create_table "alliances", :force => true do |t|
    t.string   "name"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ckeditor_assets", :force => true do |t|
    t.string   "data_file_name",                  :null => false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "assetable_id"
    t.string   "assetable_type",    :limit => 30
    t.string   "type",              :limit => 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ckeditor_assets", ["assetable_type", "assetable_id"], :name => "idx_ckeditor_assetable"
  add_index "ckeditor_assets", ["assetable_type", "type", "assetable_id"], :name => "idx_ckeditor_assetable_type"

  create_table "contacts", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "phone"
    t.string   "mobile"
    t.text     "message"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "homes", :force => true do |t|
    t.string   "slide_file_name"
    t.string   "slide_content_type"
    t.integer  "slide_file_size"
    t.datetime "slide_updated_at"
    t.text     "caption"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "members", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.integer  "category_id"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "members", ["category_id"], :name => "index_members_on_category_id"

  create_table "photos", :force => true do |t|
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.string   "name"
    t.integer  "album_id"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "photos", ["album_id"], :name => "index_photos_on_album_id"
  add_index "photos", ["category_id"], :name => "index_photos_on_category_id"

  create_table "posts", :force => true do |t|
    t.string   "title"
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
    t.text     "content"
    t.integer  "category_id"
    t.string   "slug"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "posts", ["category_id"], :name => "index_posts_on_category_id"
  add_index "posts", ["slug"], :name => "index_posts_on_slug", :unique => true

  create_table "services", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.integer  "category_id"
    t.string   "slug"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "services", ["category_id"], :name => "index_services_on_category_id"
  add_index "services", ["slug"], :name => "index_services_on_slug", :unique => true

end
