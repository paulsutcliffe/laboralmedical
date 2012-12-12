Post.transaction do
  (1..100).each do |i|
    Post.create(:title => "Título del post #{i}")
  end
end