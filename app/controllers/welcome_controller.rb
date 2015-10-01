class WelcomeController < ApplicationController
  def index
    params = { category: '1',
      city: 'London',
      country: 'GB',
      status: 'upcoming',
      format: 'json',
      page: '50'}
    meetup_api = MeetupApi.new
    events = meetup_api.open_events(params)
  end
end
