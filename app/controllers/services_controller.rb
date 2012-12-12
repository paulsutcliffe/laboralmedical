class ServicesController < ApplicationController
  
  def index
    @services = Service.all
    @servicesmed = Service.where(:category_id => "1")
    @serviceslms = Service.where(:category_id => "2")
    

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @services }
    end
  end
  
  def adminlist
    @services = Service.all
    @servicesmed = Service.where(:category_id => "1")
    @serviceslms = Service.where(:category_id => "2")
    
    respond_to do |format|
      format.html { render :layout => 'application-cms' }
      format.xml  { render :xml => @services }
    end
  end

  def show
    @service = Service.find(params[:id])

    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @service }
    end
  end

  def new
    @service = Service.new
    @categories = Category.order('name ASC')

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @service }
    end
  end

  def edit
    @service = Service.find(params[:id])
    @categories = Category.all

    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @service }
    end
  end

  def create
    @service = Service.new(params[:service])

    respond_to do |format|
      if @service.save
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { render :xml => @service, :status => :created, :location => @service }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @service.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @service = Service.find(params[:id])

    respond_to do |format|
      if @service.update_attributes(params[:service])
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @service.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @service = Service.find(params[:id])
    @service.destroy

    respond_to do |format|
      format.html { redirect_to(:action => 'adminlist') }
      format.xml  { head :ok }
    end
  end
  
end
