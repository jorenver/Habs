var db = require('../model/model');



exports.modificarUsuarios = function(request, response){
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		console.log('Modificar Inicio')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('usuarios',datos)
	}else{
		response.render('index')
	}
};

exports.getUsuarios=function(request,response){
	console.log('get usuarios')
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		db.getUsuarios(request,response)
	}else{
		response.json({error:true})
	}
	
}

exports.removerUsuario=function (request,response){
	console.log('remove usuario')
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		db.removerUsuario(request,response)
	}else{
		response.json({error:true})
	}

}
exports.getUsuario=function (request,response){
	console.log('get usuario')
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		db.getUsuario(request,response)
	}else{
		response.json({error:true})
	}

}

exports.editarUsuario=function (request,response){
	console.log('editar usuario')
	if(request.session.infoUser && request.session.infoUser.permiso==1){
		db.editarUsuario(request,response)
	}else{
		response.json({error:true})
	}

}



