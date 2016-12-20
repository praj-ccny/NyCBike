  var map;
  var overlays = [];
  var clusterLoaded = false;
  var directionsService = new google.maps.DirectionsService;
  var polylineOptionsActual = new google.maps.Polyline({
    strokeColor: '#2B1AFF',
    strokeOpacity: 1.0,
    strokeWeight: 10
    });

  var directionsDisplay = new google.maps.DirectionsRenderer({polylineOptions: polylineOptionsActual,suppressBicyclingLayer:true});
  var bikeLayer = new google.maps.BicyclingLayer();
  var image = {
      url: 'http://breatheproject.org/wp-content/uploads/2014/01/Breathe_ActionIcons_v2-28.png', // image is 512 x 512
      scaledSize: new google.maps.Size(32, 32),
  };
  var clusterIcon = {
      url: 'https://cdn3.iconfinder.com/data/icons/earthquake/500/earthquake-24-512.png', // image is 512 x 512
      scaledSize: new google.maps.Size(32, 32),
  };

  function initialize() {
      var mapOptions = {
          zoom: 14,
          center: new google.maps.LatLng(40.7560, -73.9933),
          mapTypeId: google.maps.MapTypeId.ROADMAP	

      };
      map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
     
        bikeLayer.setMap(map);
    
      $.ajax({
          type: "GET",
          dataType: "json",
          url: "dab.php",
          data: {
              sataVariable: "here is some data send with GET method"
          },
          success: function(data) {
         
              pathArr = new Array(2, 2);
              var markers = new Array();;
              for (i = 0; i < data.points.length; i++) {

                  latlng = new google.maps.LatLng(data.points[i].lat, data.points[i].long);
                  var marker = new google.maps.Marker({
                      position: latlng,
                      map: map,
                      icon: image,
                      title: data.streets[i]
                  });
                  infowindow = new google.maps.InfoWindow();
                  streetName = data.streets[i];
                  markers.push(marker);
                  addInfoWindow(marker, streetName);

              }
			 
          },
          error: function(data) {
              console.log(data);
          }
            

      });
	  
      var clusters = [];
      makePostCall = function() {
          return $.ajax({
              type: "GET",
              dataType: "json",
              url: "teken.php",
              data: {
                  sataVariable: "here is some data send with GET method"
              },
              success: function(data) {

                  for (i = 0; i < data.points.length; i++) {

                      latlng = new google.maps.LatLng(data.points[i].lat, data.points[i].long);
                      var marker = new google.maps.Marker({
                          position: latlng,
                          map: map,
                          icon: clusterIcon
                      });
                      clusters.push(marker);
                  }

                  var markerCluster = new MarkerClusterer(map, clusters, {
                      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                  });
				
                  clusterLoaded = true;

              },
              error: function(data) {
                  console.log(data);
              }
          });
      }

  }

  function addInfoWindow(marker, streetName) {
      google.maps.event.addListener(marker, 'click', function() {
          contentString = '<div id="content">' +
              '<div>' +
              '<b>' +
              streetName +
              '</b><div id="bodyContent">' +
              '<button id="startbtn" onclick="myStartFunction()" class="btn btn-primary">Set Start</button> ' +
              '<button id="destbtn" onclick="myDestFunction()" class="btn btn-success">Destination</button>' +
              '<button onclick="calculateAndDisplayRoute()" class="btn btn-success">Go</button>' +
              '</div>';

          infowindow.setContent(contentString);
          infowindow.open(map, marker);
          getLocation(marker.position);

      });

  }

  function myStartFunction() {     
      starting = pointer;
	//  alert(starting);
      $('#startbtn').addClass('lighter');
  }

  function myDestFunction() {
      destination = pointer;
      $('#destbtn').addClass('lighter');
  }

  function getLocation(obj) {
      pointer = obj;
  }

  function calcDistance(p1, p2) {
      return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) /977).toFixed(2);
     // return 2;
  }

  function calculateAndDisplayRoute() {
 //     var disval = calcDistance(starting, destination);
  //    var timeval = disval / 0.33;
  //    var intdisval = (timeval) - (timeval % 1);
  //    var pointdisval = ((timeval % 1) * 60).toFixed(2); 
  
  
//      alert("The distance is : " + disval + " miles, It takes " + intdisval + " Minutes " + pointdisval + " seconds if you ride with max speed limit.");
	 if(!clusterLoaded){      
	  makePostCall();
	   $("#mapContainer").removeClass('col-md-12').addClass('col-md-9');
      $("#panelContainer").removeClass('hidden');
     }
    
      directionsService.route({
          origin: starting,
          destination: destination,
          travelMode: 'BICYCLING'
      }, function(response, status) {
          if (status === 'OK') {
			 
              directionsDisplay.setDirections(response);
			    var route = response.routes[0];
				if(route != undefined){
         
				 
          if (parseInt(route.legs[0].duration.text)>20){alertify.alert("Selected Route Distance is: "+route.legs[0].distance.text + " and Duration is : "+route.legs[0].duration.text+"<br/>"+"<br/>"+" WARNING: SEEMS LIKE YOU CAN'T MAKE IT IN LESS THAN 20 MINUTES, WE RECOMMEND YOU TO SELECT A CLOSER DESTINATION");}
              else { alertify.alert("Selected Route Distance is: "+route.legs[0].distance.text + " and Duration is : "+route.legs[0].duration.text);}
        }
			  
          } else {
              window.alert('Directions request failed due to ' + status);
          }
      });
   directionsDisplay.setMap(map);	  
      directionsDisplay.setPanel(document.getElementById('right-panel'));
	 
  }
  google.maps.event.addDomListener(window, 'load', initialize);
  