var labelsMeses=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var variables=null;
var Datos=null;
var variable=null;
var mediasNormales=null;
//parseFloat(Datos[i][variable].replace(",", "."));

function mostrarInformacionEstacion(event){
	infoTitle.innerHTML="Informacion: "+informacionEstacion.descripcion;
	infoContainer.innerHTML="<p> Codigo: "+informacionEstacion.code +"</p>"
							+"<p> Nombre: "+informacionEstacion.descripcion +"</p>"
							+"<p> Latitud: "+informacionEstacion.point.lat +"</p>"
							+"<p> Longitud: "+informacionEstacion.point.lng +"</p>"
	$("#ModalInformacion").modal();
}

function ocultar(id){
	$('#'+id).removeClass('visible');
	$('#'+id).addClass('oculto');
}

function mostrar(id){
	$('#'+id).removeClass('oculto');
	$('#'+id).addClass('visible');

}



function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.txt';
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


function procesarDataEstacion(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	Datos=conver.data;	
}

function obtenerDatosEstacion(){
	var url = "/getDataEstacion?id="+idEstacion;
	var request = new XMLHttpRequest();
	request.addEventListener('load',procesarDataEstacion, false);
	request.open("GET",url, true);
	request.send(null);
}

function mostrarAnomalias(MedNor,MedMen){
	var anomalias=[0,0,0,0,0,0,0,0,0,0,0,0];
	for (var i = 0; i < anomalias.length; i++) {
		anomalias[i]=MedNor[i]-MedMen[i]
	};
	mostrar('containerAnomalias');
	$('#canvasAnomalias').remove();
	$('#containerAnomalias').append('<canvas id="canvasAnomalias" width=1000 height=400 style="width:1000px; height:400px;" width="1000px" height="400px"></canvas>');
	canvas=$('#canvasAnomalias')[0];
	dibujarGrafica(canvas,anomalias,labelsMeses);
}


function mostrarMediasMensuales(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	datosMediasMensuales=conver.data;
	if(datosMediasMensuales.length!=0){
		mostrar('containerMediasMensuales');
		$('#canvasMediasMensuales').remove();
		$('#containerMediasMensuales').append('<canvas id="canvasMediasMensuales" width=1000 height=400 style="width:1000px; height:400px;" width="1000px" height="400px"></canvas>');
		canvas=$('#canvasMediasMensuales')[0];
		mediasMensuales=[0,0,0,0,0,0,0,0,0,0,0,0]
		for (var i = 0; i < datosMediasMensuales.length; i++) {
			dato=datosMediasMensuales[i];
			mediasMensuales[dato.month-1]=dato[variable];
		}
		dibujarGrafica(canvas,mediasMensuales,labelsMeses);
		mostrarAnomalias(mediasNormales,mediasMensuales)
	}else{
		alert('No hay datos Disponibles')
	}

}

function pedirMediasMensuales(year){
	var url = "/getMediasMensuales?id="+idEstacion+"&variable="+variable+"&year="+year;
	var request = new XMLHttpRequest();
	request.addEventListener('load',mostrarMediasMensuales, false);
	request.open("GET",url, true);
	request.send(null);

}

function clickElementoAnioMedias(event){
	console.log(event.target);
	console.log(event.target.dataset.codigo);
	var anio=event.target.dataset.codigo;
    anioSelected.innerHTML=anio+" <span class='caret'></span>";
    pedirMediasMensuales(anio);
}

function agregarAnios(years,click){
	var drop=$('#dropDownAnio')
	drop.empty()
	anioSelected.innerHTML=".... <span class='caret'></span>";
	for (var i = 0; i < years.length; i++) {
		drop.append('<li ><a class="elementoAnio" onclick="'+click+'(event);" data-codigo="'+years[i].year+'">'+years[i].year+'</a></li>');
	}
}

function mostrarMediasNormales(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	mediasNormales=conver.data;
	if(mediasNormales.length!=0){
		mostrar('charts_wrapper');
		mostrar('containerMediasNormales');
		ocultar('containerMediasMensuales');
		ocultar('containerAnomalias');
		ocultar('containerComparacion');
		$('.botonSelected').removeClass("botonSelected");
		variableSeleccionada.className="botonSelected";
		contenedorAnios.className="dropup";
		$('#canvasMediasNormales').remove();
		$('#containerMediasNormales').append('<canvas id="canvasMediasNormales" width=1000 height=400 style="width:1000px; height:400px;" width="1000px" height="400px"></canvas>');
		canvas=$('#canvasMediasNormales')[0];
		dibujarGrafica(canvas,mediasNormales,labelsMeses);
		agregarAnios(conver.years,"clickElementoAnioMedias");
	}else{
		variable=$('.botonSelected')[0].dataset.variable;
		alert('No hay datos Disponibles')
	}

}



function pedirMediasNormales(event){
	variableSeleccionada=event.target;
	variable=event.target.dataset.variable;
	var url = "/getMediasNormales?id="+idEstacion+"&variable="+variable;
	var request = new XMLHttpRequest();
	request.addEventListener('load',mostrarMediasNormales, false);
	request.open("GET",url, true);
	request.send(null);

}




function dibujarGrafica(canvas, datos,etiquetas){
	var lineChartData = {
		labels : etiquetas,
		datasets : [
			{
				label: "My First dataset",
				fillColor : "rgba(151,187,205,0.2)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data : datos
			}
		]

	}
	var ctx =  canvas.getContext("2d");
	myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true
	});
}
function mostarTemperaturas(respond){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	temperaturas=conver.data;
	mostrar('containerComparacion');
	$('#canvasComparacion').remove();
	$('#containerComparacion').append('<canvas id="canvasComparacion" width=1000 height=400 style="width:1000px; height:400px;" width="1000px" height="400px"></canvas>');
	canvas=$('#canvasComparacion')[0];
	datosTemperaturas={}
	datosTemperaturas['max_air_temperature']=[];
	datosTemperaturas['min_air_temperature']=[];
	datosTemperaturas['mean_air_temperature']=[];	
	for (var i = 0; i < temperaturas.length; i++) {
		datosTemperaturas['max_air_temperature'].push(temperaturas[i]['max_air_temperature']);
		datosTemperaturas['min_air_temperature'].push(temperaturas[i]['min_air_temperature']);
		datosTemperaturas['mean_air_temperature'].push(temperaturas[i]['mean_air_temperature']);
		
	};
	var lineChartData = {
		labels : labelsMeses,
		options: {
        	legend: {
            	display: true,
            	labels: {
                	fontColor: 'rgb(255, 99, 132)'
            	}
        	}
    	},
		datasets : [
			{
				label: "max_air_temperature",
				showInLegend: true,
				fillColor : "rgba(0,0,255,0.2)",
				strokeColor : "rgba(0,0,255,1)",
				pointColor : "rgba(0,0,255,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(0,0,200,1)",
				data : datosTemperaturas['max_air_temperature']
			},
			{
				label: "min_air_temperature",
				showInLegend: true,
				fillColor : "rgba(255,0,0,0.2)",
				strokeColor : "rgba(255,0,0,1)",
				pointColor : "rgba(255,0,0,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(200,0,0,1)",
				data : datosTemperaturas['min_air_temperature']
			},
			{
				label: "mean_air_temperature",
				showInLegend: true,
				fillColor : "rgba(151,187,205,0.2)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data : datosTemperaturas['mean_air_temperature']
			}
		]

	}
	var ctx =  canvas.getContext("2d");
	myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true
	});
} 


function pedirTemperaturas(year){
	var url = "/getTemperaturas?id="+idEstacion+"&year="+year;
	var request = new XMLHttpRequest();
	request.addEventListener('load',mostarTemperaturas, false);
	request.open("GET",url, true);
	request.send(null);
}

function clickElementoAnioComparar(event){
	console.log(event.target);
	console.log(event.target.dataset.codigo);
	var anio=event.target.dataset.codigo;
    anioSelected.innerHTML=anio+" <span class='caret'></span>";
    pedirTemperaturas(anio);
}

function mostarCompararTemperatura(respond){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	agregarAnios(conver.years,"clickElementoAnioComparar")
	mostrar('charts_wrapper');
	ocultar('containerMediasNormales');
	ocultar('containerMediasMensuales');
	ocultar('containerAnomalias');
	ocultar('containerComparacion');
	$('.botonSelected').removeClass("botonSelected");
	variable.className="botonSelected";
	contenedorAnios.className="dropdown";
}
function pedirAniosTemperatura(event){
	variable=event.target;
	var url = "/getAniosTemperatura?id="+idEstacion;
	var request = new XMLHttpRequest();
	request.addEventListener('load',mostarCompararTemperatura, false);
	request.open("GET",url, true);
	request.send(null);
}

function mostrarVariables(){
	if(variables.length>1){
		botones.innerHTML="";
		boton=document.createElement("li");
		boton.innerHTML="Comparar Temperatura";
		boton.setAttribute("onclick","pedirAniosTemperatura(event);");
		botones.appendChild(boton);
	}
	for (var i = 0; i < variables.length; i++) {
		boton=document.createElement("li");
		boton.innerHTML=variables[i].split("_").join(" ");
		boton.setAttribute("data-variable",variables[i]);
		boton.setAttribute("onclick","pedirMediasNormales(event);");
		botones.appendChild(boton);
		
	}
}

function procesarVariables(event){
	var respond = event.target.responseText;
	var conver = JSON.parse(respond);
	variables=conver.variables
	mostrarVariables();
}

function obtenerVariables(){
	var url = "/getVariablesMeteorologicas?id="+idEstacion;
	var request = new XMLHttpRequest();
	request.addEventListener('load',procesarVariables, false);
	request.open("GET",url, true);
	request.send(null);
}

function inicializar(){
	console.log('Id Estacion: '+idEstacion)
    obtenerVariables();   
}


window.addEventListener('load', inicializar, false);
