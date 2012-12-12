class AlliancesController < ApplicationController
  # GET /alliances
  # GET /alliances.xml
  def index
    @alliances = Alliance.all

    respond_to do |format|
      format.html { render :layout => 'application-alt' } # index.html.erb
      format.xml  { render :xml => @alliances }
    end
  end
  
  def adminlist
    @alliances = Alliance.all
    
    respond_to do |format|
      format.html { render :layout => 'admin' }
      format.xml  { render :xml => @alliances }
    end
  end

  # GET /alliances/1
  # GET /alliances/1.xml
  def show
    @alliance = Alliance.find(params[:id])

    respond_to do |format|
      format.html { render :layout => 'admin' } # show.html.erb
      format.xml  { render :xml => @alliance }
    end
  end

  # GET /alliances/new
  # GET /alliances/new.xml
  def new
    @alliance = Alliance.new

    respond_to do |format|
      format.html { render :layout => 'admin' } # new.html.erb
      format.xml  { render :xml => @alliance }
    end
  end

  # GET /alliances/1/edit
  def edit
    @alliance = Alliance.find(params[:id])

   respond_to do |format|
      format.html { render :layout => 'admin' } # new.html.erb
      format.xml  { render :xml => @alliance }
    end
  end

  # POST /alliances
  # POST /alliances.xml
  def create
    @alliance = Alliance.new(params[:alliance])

    respond_to do |format|
      if @alliance.save
        format.html { redirect_to(@alliance, :notice => 'Alliance was successfully created.') }
        format.xml  { render :xml => @alliance, :status => :created, :location => @alliance }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @alliance.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /alliances/1
  # PUT /alliances/1.xml
  def update
    @alliance = Alliance.find(params[:id])

    respond_to do |format|
      if @alliance.update_attributes(params[:alliance])
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @alliance.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /alliances/1
  # DELETE /alliances/1.xml
  def destroy
    @alliance = Alliance.find(params[:id])
    @alliance.destroy

    respond_to do |format|
      format.html { redirect_to(:action => 'adminlist') }
      format.xml  { head :ok }
    end
  end
end
