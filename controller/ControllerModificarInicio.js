var db = require('../model/model');


exports.modificarInicio = function(request, response){
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		console.log('Modificar Inicio')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('modificarInicio',datos)
	}else{
		response.render('index')
	}
};