class WelcomeController < ApplicationController
  def index
    meetup_api = MeetupApi.new
    events = meetup_api.open_events(params[:meetup_params]) if params[:meetup_params].present?
    if request.xhr?
      render json: events
    end
  end
end
