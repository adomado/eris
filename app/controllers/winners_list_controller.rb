class WinnersListController < ApplicationController
  def display
    id = 20
    @winners = ContestWinner.find(:all, :limit => 5, :order => 'created_at DESC')
  end

end
