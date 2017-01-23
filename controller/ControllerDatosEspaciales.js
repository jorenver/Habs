var db = require('../model/model');

exports.getDatosEspaciales = function(request, response){
	if(request.session.infoUser){
		console.log('ESPACIALES')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('datosEspaciales',datos);
	}else{
		response.render('index');
	}
};