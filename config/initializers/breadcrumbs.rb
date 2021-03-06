Gretel::Crumbs.layout do
 
  crumb :root do
    link "Home", root_path
  end
 
  crumb :posts do
    link "Posts", posts_path
  end
 
  crumb :post do |post|
    link post.title, post_path(post)
    parent :posts
  end
 
end
  
  # Remember to restart your application after editing this file.
  
  # Example crumbs:
  
  # crumb :root do
  #   link "Home", root_path
  # end
  
  # crumb :projects do
  #   link "Projects", projects_path
  # end
  
  # crumb :project do |project|
  #   link lambda { |project| "#{project.name} (#{project.id.to_s})" }, project_path(project)
  #   parent :projects
  # end
  
  # crumb :project_issues do |project|
  #   link "Issues", project_issues_path(project)
  #   parent :project, project
  # end
  
  # crumb :issue do |issue|
  #   link issue.name, issue_path(issue)
  #   parent :project_issues, issue.project
  # end