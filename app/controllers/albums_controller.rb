class AlbumsController < ApplicationController

  def index
    @albumsmed = Album.where(:category_id => "1").paginate :page => params[:page], :per_page => 10
    @albumslms = Album.where(:category_id => "2").paginate :page => params[:page], :per_page => 10
    @albums = Album.all

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @albums }
    end
  end
  
  def adminlist
    @albumsmed = Album.where(:category_id => "1").paginate :page => params[:page], :per_page => 10
    @albumslms = Album.where(:category_id => "2").paginate :page => params[:page], :per_page => 10
    @albums = Album.all
    
    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @albums }
    end
  end

  def show
    @album = Album.find(params[:id])

    respond_to do |format|
      format.html { render :layout => 'application-album' }
      format.xml  { render :xml => @album }
    end
  end

  def new
    @album = Album.new
    @categories = Category.order('name ASC')

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @album }
    end
  end

  def edit
    @album = Album.find(params[:id])
    @categories = Category.all
    
    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @album }
    end
	
  end

  def create
    @album = Album.new(params[:album])

    respond_to do |format|
      if @album.save
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { render :xml => @album, :status => :created, :location => @album }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @album.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @album = Album.find(params[:id])

    respond_to do |format|
      if @album.update_attributes(params[:album])
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @album.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @album = Album.find(params[:id])
    @album.destroy

    respond_to do |format|
      format.html { redirect_to(:action => 'adminlist') }
      format.xml  { head :ok }
    end
  end
end
