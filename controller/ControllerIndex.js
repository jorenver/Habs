
var db = require('../model/model');


exports.Index = function(request, response){
	request.session.infoUser=null
	response.render('index')
};
exports.login = function(request, response){
	console.log('LOGIN')
	db.login(request,response)
};
exports.inicio = function(request, response){
	if(request.session.infoUser){
		console.log('INICIO')
		datos={
			permiso:request.session.infoUser.permiso
		}
		response.render('Habs',datos)
	}else{
		console.log('LOGIN')
		response.render('index')
	}
};

exports.logout=function(request,response){
	request.session.infoUser=null
	response.render('index')
}