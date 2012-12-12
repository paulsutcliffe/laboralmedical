DynamicSitemaps::Sitemap.draw do

  # Product.all.each do |product|
  #   url product_url(product), :last_mod => product.updated_at, :change_freq => 'monthly', :priority => 0.8
  # end

  # new_page!
  
  # autogenerate  :products, :categories,
  #               :last_mod => :updated_at,
  #               :change_freq => 'monthly',
  #               :priority => 0.8
                
  # new_page!
  
  # autogenerate  :users,
  #               :last_mod => :updated_at,
  #               :change_freq => lambda { |user| user.very_active? ? 'weekly' : 'monthly' },
  #               :priority => 0.5
  
  per_page 30

  url root_url, :last_mod => DateTime.now, :change_freq => 'daily', :priority => 1
  
  autogenerate  :posts,
                :last_mod => :updated_at,
                :change_freq => 'daily',
                :priority => 0.8
  
end