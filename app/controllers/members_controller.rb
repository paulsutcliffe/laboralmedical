class MembersController < ApplicationController
  # GET /members
  # GET /members.xml
  def index
    @membersmed = Member.where(:category_id => "1").paginate :page => params[:page], :per_page => 10
    @memberslms = Member.where(:category_id => "2").paginate :page => params[:page], :per_page => 10
    @members = Member.all
    respond_to do |format|
      format.html { render :layout => 'application-alt' } # index.html.erb
      format.xml  { render :xml => @members }
    end
  end

  def adminlist
    @members = Member.all
    @membersmed = Member.where(:category_id => "1").paginate :page => params[:page], :per_page => 10
    @memberslms = Member.where(:category_id => "2").paginate :page => params[:page], :per_page => 10
	
    respond_to do |format|
      format.html { render :layout => 'application-cms' }
      format.xml  { render :xml => @members }
    end
  end

  # GET /members/1
  # GET /members/1.xml
  def show
    @member = Member.find(params[:id])

    respond_to do |format|
      format.html { render :layout => 'admin' } # show.html.erb
      format.xml  { render :xml => @member }
    end
  end

  # GET /members/new
  # GET /members/new.xml
  def new
    @member = Member.new
    @categories = Category.order('name ASC')

    respond_to do |format|
      format.html { render :layout => 'admin' } # new.html.erb
      format.xml  { render :xml => @member }
    end
  end

  # GET /members/1/edit
  def edit
    @member = Member.find(params[:id])
    @categories = Category.all

    respond_to do |format|
      format.html { render :layout => 'admin' } # new.html.erb
      format.xml  { render :xml => @member }
    end
  end

  # POST /members
  # POST /members.xml
  def create
    @member = Member.new(params[:member])

    respond_to do |format|
      if @member.save
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { render :xml => @member, :status => :created, :location => @member }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @member.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /members/1
  # PUT /members/1.xml
  def update
    @member = Member.find(params[:id])

    respond_to do |format|
      if @member.update_attributes(params[:member])
        format.html { redirect_to(:action => 'adminlist') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @member.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /members/1
  # DELETE /members/1.xml
  def destroy
    @member = Member.find(params[:id])
    @member.destroy

    respond_to do |format|
      format.html { redirect_to(:action => 'adminlist') }
      format.xml  { head :ok }
    end
  end
end
