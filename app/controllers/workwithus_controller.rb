class WorkwithusController < ApplicationController
  def index
    render :layout => 'application-alt'
  end
  
  def adminlist
    @members = Member.all
    
    respond_to do |format|
      format.html { render :layout => 'application-alt' }
      format.xml  { render :xml => @members }
    end
  end

end
