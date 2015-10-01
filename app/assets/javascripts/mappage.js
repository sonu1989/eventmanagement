$(document).ready(function(){
  initmap()
  autocomplete()

  $("button.find").click(function(){
    $("input").trigger("geocode");
  });

})

function initmap(){
  handler = Gmaps.build('Google');
  handler.buildMap({ provider: {}, internal: {id: 'map'}}, function(){
    markers = handler.addMarkers([
      {
        "lat": 28.6100,
        "lng": 77.2300,
        "picture": {
          "url": "https://addons.cdn.mozilla.net/img/uploads/addon_icons/13/13028-64.png",
          "width":  36,
          "height": 36
        },
        "infowindow": "hello!"
      }
    ]);
    handler.bounds.extendWith(markers);
    handler.fitMapToBounds();
  });
}

function autocomplete(){
  $("input").geocomplete({ 
    details: "form",
    map: "#map"
     }).bind("geocode:result", function(event, result){
      $.ajax({
        type: "GEt",
        url: "/welcome/index",
        data: { meetup_params: {
          lat: result.geometry.location.A,
          lon: result.geometry.location.F,
          category: 2,
          status: 'upcoming',
          page: 50}
        },
        success: function(data) {
          addMarkers(data.results, result.geometry.location.A, result.geometry.location.F)
          return false;
        },
        error: function(data) {
          return false;
        }
      });
  });
}

function addMarkers(events, lat, lon){
  var locations = []
  for(i=0; i < events.length; i++){
    if (events[i].venue){
      var location = [events[i].name, events[i].venue.lat, events[i].venue.lon]
      locations.push(location)
    }
  }
  
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(lat, lon),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  var infowindow = new google.maps.InfoWindow();
  var marker, i;
  
  for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}