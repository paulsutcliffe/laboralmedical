require 'test_helper'

class AlliancesControllerTest < ActionController::TestCase
  setup do
    @alliance = alliances(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:alliances)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create alliance" do
    assert_difference('Alliance.count') do
      post :create, :alliance => @alliance.attributes
    end

    assert_redirected_to alliance_path(assigns(:alliance))
  end

  test "should show alliance" do
    get :show, :id => @alliance.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @alliance.to_param
    assert_response :success
  end

  test "should update alliance" do
    put :update, :id => @alliance.to_param, :alliance => @alliance.attributes
    assert_redirected_to alliance_path(assigns(:alliance))
  end

  test "should destroy alliance" do
    assert_difference('Alliance.count', -1) do
      delete :destroy, :id => @alliance.to_param
    end

    assert_redirected_to alliances_path
  end
end
