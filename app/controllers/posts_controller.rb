class PostsController < ApplicationController
  # GET /posts
  # GET /posts.xml
  def index
    @postsmed = Post.where(:category_id => "1").paginate :page => params[:page], :per_page => 5
    @postslms = Post.where(:category_id => "2").paginate :page => params[:page], :per_page => 5

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @posts }
    end
  end

  def adminlist
    @postsmed = Post.where(:category_id => "1")
    @postslms = Post.where(:category_id => "2")
    @posts = Post.all

    respond_to do |format|
      format.html { render :layout => 'application-cms' }
      format.xml  { render :xml => @posts }
    end
  end

  # GET /posts/1
  # GET /posts/1.xml
  def show
    @post = Post.find(params[:id])
    #meta :title => @post.title, :description => @post.content
    breadcrumb :post, @post


    respond_to do |format|
      format.html  { render :layout => 'application-alt' }
      format.xml  { render :xml => @post }
    end
  end

  # GET /posts/new
  # GET /posts/new.xml
  def new
    @post = Post.new
    @categories = Category.order('name ASC')

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @post }
    end
  end

  # GET /posts/1/edit
  def edit
    @post = Post.find(params[:id])
    @categories = Category.all

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @post }
    end
  end

  # POST /posts
  # POST /posts.xml
  def create
    @post = Post.new(params[:post])

    respond_to do |format|
      if @post.save
        format.html { redirect_to(@post, :notice => 'Post was successfully created.') }
        format.xml  { render :xml => @post, :status => :created, :location => @post }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /posts/1
  # PUT /posts/1.xml
  def update
    @post = Post.find(params[:id])

    respond_to do |format|
      if @post.update_attributes(params[:post])
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.xml
  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    respond_to do |format|
      format.html { redirect_to(:action => 'adminlist') }
      format.xml  { head :ok }
    end
  end
end
