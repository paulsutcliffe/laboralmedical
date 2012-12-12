LaboralmedicalperuCom::Application.routes.draw do
  root :to => "homes#index"
  
  match "/admin" =>'access#menu'
  match "/login" =>'access#login'
  match "/attempt_login" =>'access#attempt_login'
  match "/logout" =>'access#logout'
  
  match "sitemap.xml" => 'sitemaps#sitemap'
  
  match "/contacto" => 'contacts#new'
  match "/inicio" => 'homes#index'
  match "/fotos" => 'albums#index'
  match "/staff" => 'members#index'
  match "/blog" => 'posts#index'
  match "/servicios" => 'services#index'
  match "/alianzas" => 'alliances#index'
  match "/trabaja" => 'workwithus#index'  
  
  get "albums/adminlist"
  get "alliances/adminlist"
  get "contacts/adminlist"
  get "homes/adminlist"
  get "members/adminlist"
  get "photos/adminlist"
  get "posts/adminlist"
  get "services/adminlist"
  get "workwithus/adminlist"  

  resources :homes
  resources :photos
  resources :albums do
    resources :photos
  end
  resources :contacts
  resources :alliances
  resources :members
  resources :posts
  resources :services
  resources :categories
  
 
  
  
end
