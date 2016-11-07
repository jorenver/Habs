var db = require('../model/model');

exports.getEstacion = function(request, response){
	if(request.session.infoUser){
		console.log('ESTACION')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('estacionMeteorologica',datos)
	}else{
		response.render('index')
	}
};

exports.getVariablesMeteorologicas =function(request, response){
	variables=["max_air_temperature","min_air_temperature","mean_air_temperature","mean_relative_humidity","precipitation","sea_surface_temperature"]
	response.json({variables:variables});
}

exports.getEstaciones = function(request, response){
	if(request.session.infoUser){
		console.log('ESTACIONES')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('estaciones',datos)
	}else{
		response.render('index')
	}
};


exports.getLocality = function(request, response){
	console.log("getLocality");
	db.getLocality(request,response);
};

exports.getDataEstacion = function(request, response){
	console.log("getDataEstacion");
	db.getDataEstacion(request,response);
};

exports.getMediasNormales = function(request, response){
	console.log("getMediasNormales");
	db.getMediasNormales(request,response);
};
exports.getMediasMensuales = function(request, response){
	console.log("getMediasMensuales");
	db.getMediasMensuales(request,response);
};



