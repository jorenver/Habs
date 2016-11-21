var LatLngLocalitys=[];
var Markers=[];
var map;


function initMap(localities) {
  

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: -2.18, lng: -79.896163},
    scrollwheel: true,
    zoom: 11
  });

  for (var i = 0; i < localities.length; i++) {
    $('#listEstaciones').append(' <li >'+localities[i].code+': '+ localities[i].descripcion+'</li>');
    var marker = new google.maps.Marker({
      map: map,
      position: localities[i].point,
      title: localities[i].code+': '+localities[i].descripcion,
      idLocality:localities[i].id
    });
    Markers.push(marker);
  }
  for (var i = 0; i < Markers.length; i++) {
    Markers[i].addListener('click', function() {
      var contentString='<div id="content"> <a href="/estacion?locality='+this.idLocality +'">'+this.title+'</a> </div>';

      var infowindow = new google.maps.InfoWindow({content: contentString});
      infowindow.open(map, this);
    });
  };
}

function procesarLocalities(event){
  var respond = event.target.responseText;
  var j = JSON.parse(respond);
  console.log(j);
  initMap(j)
}

function getLocalities(){
  var url = "/getLocalities";
  var request = new XMLHttpRequest();
  request.addEventListener('load',procesarLocalities, false);
  request.open("GET",url, true);
  request.send(null);
}

  
function inicializar(){
  //initMap();
  getLocalities();
}
window.addEventListener('load', inicializar, false);