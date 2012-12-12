class PhotosController < ApplicationController

  before_filter :find_album

  def index
    @photos = Photo.all

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @photos }
    end
  end
  
  def adminlist
    @photos = Photo.where(:album_id => params[:album_id])
    
    respond_to do |format|
      format.html { render :layout => 'application-cms' }
      format.xml  { render :xml => @photos }
    end
  end

  # GET /photos/1
  # GET /photos/1.xml
  def show
    @photo = Photo.find(params[:id])

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @photo }
    end
  end

  def new
    @photo = Photo.new
    @albums = Album.order('id ASC')
    @categories = Category.order('id ASC')

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @photo }
    end
  end

  # GET /photos/1/edit
  def edit
    @photo = Photo.find(params[:id])
    @albums = Album.all
    
    respond_to do |format|
      format.html { render :layout => 'application-cms' }
      format.xml  { render :xml => @photo }
    end
  end

  def create
    @photo = Photo.new(params[:photo])
    @categories = Category.all
    @albums = Album.all

    respond_to do |format|
      if @photo.save
        format.html { redirect_to(:controller => 'albums', :action => 'adminlist') }
        format.xml  { render :xml => @photo, :status => :created, :location => @photo }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @photo.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @photo = Photo.find(params[:id])

    respond_to do |format|
      if @photo.update_attributes(params[:photo])
        format.html { redirect_to(@photo, :notice => 'Photo was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @photo.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @photo = Photo.find(params[:id])
    @photo.destroy

    respond_to do |format|
      format.html { redirect_to(:controller => 'albums', :action => 'adminlist') }
      format.xml  { head :ok }
    end
  end


  def find_album
    if params[:album_id]
      @album = Album.find_by_id(params[:album_id])
    end
  end

end
