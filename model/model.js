var pg = require('pg');
var conString = "postgres://postgres:12345@localhost:5432/habs";





exports.getLocality = function(request, response){ //recibe un objeto ruta
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT * FROM locality";
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	 	var result=[];
	 	var auxList=data.rows;
	    for (var i in auxList) {
	    	var locality={
	    		id:auxList[i].id,
	    		descripcion:auxList[i].descripcion
	    	}
	    	result.push(locality);
	    }

	    console.log(data.rows)
		response.json(result);
	});
}
function generarCSV(Datos) {
    var texto = '';
    var variables=["max_air_temperature","min_air_temperature","mean_air_temperature","mean_relative_humidity","precipitation","sea_surface_temperature"]
    texto+='year;month'
    for (var i = 0; i < variables.length; i++) {
    	texto+=';'+variables[i];
    }
    texto+='\n'
    for (var i = 0; i < Datos.length; i++) {
    	var cadena=Datos[i].year+';'+Datos[i].month;
    	for (var j= 0; j < variables.length; j++) {
    		cadena=cadena+';'+Datos[i][variables[j]];
    	}
		cadena=cadena+'\n';
		texto+=cadena;
	}
    //return new Blob(texto, {
    //'    type: 'text/plain'
    //});
	return texto;
};

exports.getDataEstacion= function(request, response){
	var id=request.query.id;
	console.log(id)
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT temperature.year, temperature.month,mean_air_temperature,"
	+" min_air_temperature,max_air_temperature,sea_surface_temperature, mean_relative_humidity,precipitation" 
	+" FROM locality,temperature,humidity"
	+" WHERE temperature.id_locality=locality.id"
	+" and temperature.id_locality=humidity.id_locality" 
	+" and temperature.year=humidity.year" 
	+" and temperature.month=humidity.month"
	+" and locality.id="+id
	+" ORDER BY year,month DESC";
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    //console.log(data.rows);
	    csv=generarCSV(data.rows);
	    console.log(csv);
	    response.set({"Content-Disposition":"attachment; filename=\"DatosEstacion.csv\""});
   		response.send(csv);
		//response.json({data:csv});
	});
}
exports.login= function(request, response){
	//console.log(request.body)
	username=request.body.usuario
	password=request.body.password
	//response.render('Habs')
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT * FROM usuario WHERE usuario.username= " +generarString(username)+ " limit(1)" ;
	//console.log(queryString)
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	response.json({value:false});
	    }
	    if(data.rows.length==1){
	    	user=data.rows[0]
	    	passwordCompare=user.pass
	    	if(password==passwordCompare){
	    		console.log('correcto')
	    		infoUser={
	    			id:user.id,
	    			username:username,
	    			nombres:user.nombres,
	    			apellidos:user.apellidos,
	    			permiso:user.permiso
	    		}
	    		console.log(infoUser)
	    		request.session.infoUser=infoUser
	    		response.json({value: true})
	    	}
	    	else{
	    		console.log('password incorrecto')
	    		response.json({value: false})
	    	}
	    }else{
	    	console.log('no existe usuario')
	    	response.json({value:false})
	    }
		
	});

}
exports.getUsuarios= function(request, response){
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT * FROM usuario" ;
	//console.log(queryString)
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	response.json({error:true});
	    }
	    usuarios=data.rows
	    result=[]
	    for(var i in usuarios){
	    	usuario=usuarios[i]
	    	result.push({
	    		id:usuario.id,
	    		username:usuario.username,
	    		permiso:usuario.permiso
	    	})

	    }
	    console.log(request.session.infoUser)
	    console.log({error:false,usuarios:result,myId:request.session.infoUser.id})
	    response.json({error:false,usuarios:result,myId:request.session.infoUser.id})
		
	});

}

exports.removerUsuario=function (request,response){
	console.log('remove usuario')
	var id=request.query.id;
	console.log(id)
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "DELETE FROM usuario WHERE id="+id ;
	//console.log(queryString)
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	response.json({error:true});
	    }
	    response.json({error:false,id:id})
		
	});
	

}

exports.getUsuario=function (request,response){
	console.log('get usuario')
	var id=request.query.id;
	console.log(id)
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT * FROM usuario WHERE id="+id ;
	//console.log(queryString)
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	response.json({error:true});
	    }
	    if(data.rows.length==1){
	    	user=data.rows[0]
    		infoUser={
    			username:user.username,
    			nombres:user.nombres,
    			apellidos:user.apellidos,
    			permiso:user.permiso,
    			mail:user.mail,
    			password:user.pass
    		}
	    	response.json({error: false,infoUser:infoUser})

	    }else{
	    	console.log('no existe usuario')
	    	response.json({error:true})
	    }
		
	});

}



exports.editarUsuario= function(request, response){

	console.log(request.body)
	user=request.body
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "UPDATE usuario SET"+
	" nombres="+generarString(user.nombres)+
	" ,apellidos="+generarString(user.apellidos)+
	" ,mail="+generarString(user.mail)+
	" ,pass="+generarString(user.pass)+
	" ,permiso="+generarString(user.permiso)+
	" WHERE id="+user.id;
	console.log(queryString)
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	response.json({error:true});
	    }
	    response.json({error:false})
		
	});
	
}


function generarString(s){
	return "'"+s+"'"
}

exports.getMediasNormales= function(request, response){
	var idEstacion=request.query.id;
	var variable=request.query.variable;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT temperature.month,"
	+" AVG (CAST (replace("+ variable+ ",',','.')  AS FLOAT))"
	+" FROM locality,temperature,humidity" 
	+" WHERE temperature.id_locality=locality.id"
	+" and temperature.id_locality=humidity.id_locality"
	+" and temperature.year=humidity.year"
	+" and temperature.month=humidity.month"
	+" and locality.id="+idEstacion
	+" and "+ variable+" IS NOT NULL"
	+" GROUP BY temperature.month"
	+" ORDER BY temperature.month";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    result=[]
	    console.log(data.rows)
	    for (var i =0 ; i <data.rows.length; i++) {
	    	result.push(data.rows[i]["avg"])
	    }
	    console.log(result)
	    var queryString2 = "SELECT DISTINCT temperature.year"
		+" FROM locality,temperature,humidity" 
		+" WHERE temperature.id_locality=locality.id"
		+" and temperature.id_locality=humidity.id_locality"
		+" and temperature.year=humidity.year"
		+" and temperature.month=humidity.month"
		+" and locality.id="+idEstacion
		+" and "+ variable+" IS NOT NULL"
		+" ORDER BY temperature.year";
		client.query(queryString2, function(err, data2, fields) {
		    if (err) throw err;
		    console.log(data2.rows)
		    response.json({data:result, years:data2.rows}); 
		});

		
	});
}

exports.getMediasMensuales= function(request, response){
	var idEstacion=request.query.id;
	var variable=request.query.variable;
	var year=request.query.year;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT temperature.month,"
	+" CAST (replace("+ variable+ ",',','.')  AS FLOAT) AS "+variable
	+" FROM locality,temperature,humidity" 
	+" WHERE temperature.id_locality=locality.id"
	+" and temperature.id_locality=humidity.id_locality"
	+" and temperature.year=humidity.year"
	+" and temperature.month=humidity.month"
	+" and locality.id="+idEstacion
	+" and temperature.year="+year
	+" and "+ variable+" IS NOT NULL"
	+" ORDER BY temperature.month";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    result=[]
	    console.log(data.rows)
	    response.json({data:data.rows}); 
		
	});
}

/*
exports.getEstacion= function(request, response){
	var id=request.query.id;
	console.log(id)
	id=1;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT temperature.year, temperature.month,mean_air_temperature,min_air_temperature,max_air_temperature,sea_surface_temperature, mean_relative_humidity,precipitation FROM locality,temperature,humidity where temperature.id_locality=locality.id and temperature.id_locality=humidity.id_locality and temperature.year=humidity.year and temperature.month=humidity.month and locality.id="+id+"ORDER BY year,month DESC";
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    console.log(data.rows);
		response.render('estacionMeteorologica',{data:data.rows});
	});
}
*/



