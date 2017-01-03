var ControllerIndex = require('./controller/ControllerIndex');
var ControllerDatosMeteorologicos = require('./controller/ControllerDatosMeteorologicos');
var ControllerModificarInicio = require('./controller/ControllerModificarInicio');
var ControllerUsuarios = require('./controller/ControllerUsuarios');


module.exports = function(app){

	//ControllerIndex
	app.get('/', ControllerIndex.Index);
	app.get('/inicio', ControllerIndex.inicio);
	app.post('/login', ControllerIndex.login);
	app.get('/logout',ControllerIndex.logout)
	//ControllerDatosMeteorologicos
	app.get('/estacion', ControllerDatosMeteorologicos.getEstacion);
	app.get('/getLocalities', ControllerDatosMeteorologicos.getLocalities);
	app.get('/getDataEstacion', ControllerDatosMeteorologicos.getDataEstacion);
	app.get('/getVariablesMeteorologicas', ControllerDatosMeteorologicos.getVariablesMeteorologicas);
	app.get('/estaciones', ControllerDatosMeteorologicos.getEstaciones);
	app.get('/getMediasNormales', ControllerDatosMeteorologicos.getMediasNormales);
	app.get('/getMediasMensuales', ControllerDatosMeteorologicos.getMediasMensuales);
	app.get('/getAniosTemperatura', ControllerDatosMeteorologicos.getAniosTemperatura);
	app.get('/getTemperaturas', ControllerDatosMeteorologicos.getTemperaturas);
	//ControllerModificarInicio
	app.get('/configuraInicio', ControllerModificarInicio.modificarInicio);
	//ControllerUsuarios
	app.get('/configurarUsuarios', ControllerUsuarios.modificarUsuarios);
	app.get('/configurarUsuarios/getUsuarios', ControllerUsuarios.getUsuarios);
	app.get('/configurarUsuarios/removerUsuario', ControllerUsuarios.removerUsuario);
	app.get('/configurarUsuarios/getUsuario', ControllerUsuarios.getUsuario);
	app.post('/configurarUsuarios/editarUsuario', ControllerUsuarios.editarUsuario);
	
	
	
	

};