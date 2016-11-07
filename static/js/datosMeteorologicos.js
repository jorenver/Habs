var Datos=null;

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
}

function generarTexto() {
    var texto = [];
    texto.push('year;month;mean_air_temperature;min_air_temperature;max_air_temperature;sea_surface_temperature;mean_relative_humidity;precipitation\n')
    for (var i = 0; i < Datos.length; i++) {
		year=Datos[i].year;
		month=Datos[i].month;
		mean_air_temperature=Datos[i].mean_air_temperature
		min_air_temperature=Datos[i].min_air_temperature
		max_air_temperature=Datos[i].max_air_temperature
		sea_surface_temperature=Datos[i].sea_surface_temperature
		mean_relative_humidity=Datos[i].mean_relative_humidity
		precipitation=Datos[i].precipitation
		var cadena='';
		cadena=cadena+year+';'+month+';'+mean_air_temperature+';'+min_air_temperature+';'+max_air_temperature+';'+sea_surface_temperature+';'+mean_relative_humidity+';'+precipitation+'\n';
		texto.push(cadena);

	};
    
    
    return new Blob(texto, {
        type: 'text/plain'
    });
};


function procesarLocality(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	console.log(conver);
	for (var i = 0; i < conver.length; i++) {
		var option = document.createElement("option");
		option.text = conver[i].descripcion;
		option.value=conver[i].id;
		selectEstaciones.add(option);
	};
	
}




function inicializar () {
	var url = "/getLocality";
	var request = new XMLHttpRequest();
	request.addEventListener('load',procesarLocality, false);
	request.open("GET",url, true);
	request.send(null);
	btnVisualizar.addEventListener("click", obtenerDatosEstacion);
	btnDescargar.addEventListener('click', function () {
	    descargarArchivo(generarTexto(), 'archivo.txt');
	}, false);
}

function procesarDataLocality(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	Datos=conver;
	contenidoTemperatura.innerHTML="<tr><td>Year&nbsp;&nbsp;&nbsp;</td><td>Mon</td> <td>Mean Air Temperature</td><td>Mim Air Temperature</td><td>Max Air Temperature</td><td>Sea Surface Temperature</td><td>Mean Relative Humidity</td><td>Precipitation</td></tr>";
	for (var i = 0; i < conver.length; i++) {
		//declaracion
		var fila=document.createElement("tr");
		var year=document.createElement("td");
		var month=document.createElement("td");
		var mean_air_temperature=document.createElement("td");
		var min_air_temperature=document.createElement("td");
		var max_air_temperature=document.createElement("td");
		var sea_surface_temperature=document.createElement("td");
		var mean_relative_humidity=document.createElement("td");
		var precipitation=document.createElement("td");
		//escritura
		year.innerHTML=conver[i].year;
		month.innerHTML=conver[i].month;
		mean_air_temperature.innerHTML=conver[i].mean_air_temperature
		min_air_temperature.innerHTML=conver[i].min_air_temperature
		max_air_temperature.innerHTML=conver[i].max_air_temperature
		sea_surface_temperature.innerHTML=conver[i].sea_surface_temperature
		mean_relative_humidity.innerHTML=conver[i].mean_relative_humidity
		precipitation.innerHTML=conver[i].precipitation


		//agregacion
		fila.appendChild(year);
		fila.appendChild(month);
		fila.appendChild(mean_air_temperature);
		fila.appendChild(min_air_temperature);
		fila.appendChild(max_air_temperature);
		fila.appendChild(sea_surface_temperature);
		fila.appendChild(mean_relative_humidity);
		fila.appendChild(precipitation);



		contenidoTemperatura.appendChild(fila);
	};
	cargando.style.display="none";

}

function obtenerDatosEstacion(id){
	var url = "/getDataLocality?id=1";
	var request = new XMLHttpRequest();
	request.addEventListener('load',procesarDataLocality, false);
	request.open("GET",url, true);
	request.send(null);
	cargando.style.display="block";

}
window.addEventListener('load', inicializar, false);