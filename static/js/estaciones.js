var LatLngLocalitys=[];
var Markers=[];
var map;

function loadLocalitys(){
  LatLngLocalitys.push({Name:"Estacion 1",
                        point:{lat: -1.834054, lng: -80.296163}
                      });
  LatLngLocalitys.push({Name:"Estacion 2",
                        point:{lat: -2.256338, lng: -80.924317}
                      });
  LatLngLocalitys.push({Name:"Estacion 3",
                        point:{lat: -1.014931, lng: -80.767188}
                      });
}
function initMap() {
  

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: -1.834054, lng: -80.296163},
    scrollwheel: false,
    zoom: 8
  });

  for (var i = 0; i < LatLngLocalitys.length; i++) {
    console.log(LatLngLocalitys[i].point)
    console.log(LatLngLocalitys[i].Name)
    $('#listEstaciones').append(' <li >'+LatLngLocalitys[i].Name+'</li>');
    var marker = new google.maps.Marker({
      map: map,
      position: LatLngLocalitys[i].point,
      title: LatLngLocalitys[i].Name
    });
    Markers.push(marker);
  }
  for (var i = 0; i < Markers.length; i++) {
    Markers[i].addListener('click', function() {
      var contentString='<div id="content"> <a href="/estacion">'+this.title+'</a> </div>';

      var infowindow = new google.maps.InfoWindow({content: contentString});
      infowindow.open(map, this);
    });
  };
}

  

function inicializar(){
  loadLocalitys();
  initMap();
}
window.addEventListener('load', inicializar, false);