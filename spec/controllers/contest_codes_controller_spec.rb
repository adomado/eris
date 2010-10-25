require "spec_helper"

describe ContestCodesController do

  it "should show login interface to unlogged users" do
    get :show
    flash[:notice].should == "You must be logged in to access this section"
  end
  
  it "should show error message for wrong password" do
    post :login, {:email => "syedkashif.kde1@gmail.com", :password => ""}
    flash[:notice] == "Invalid user/password combination"
  end

  it "should show error message for wrong username" do
    post :login, {:email => "syedkashif.kde@gmail.com", :password => ""}
    flash[:notice] == "Invalid user/password combination"
  end
  
  it "should redirect to show page" do
    post :login, {:email => "syedkashif.kde1@gmail.com", :password => "226504"}
    response.should redirect_to(:action => "show")
  end
  
#  it "should redirect to show page" do
#    post :login, {:email => "syedkashif.kde1@gmail.com", :password => "226504"}
#    response.should redirect_to(:action => "show")
#  end
  
end
