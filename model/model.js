var pg = require('pg');
var conString = "postgres://postgres:12345@localhost:5432/habs";
var variables=["max_air_temperature","min_air_temperature","mean_air_temperature","mean_relative_humidity","precipitation","sea_surface_temperature"];

function getTabla(variable){
	var variablesHumidity=["mean_relative_humidity","precipitation"];
	var variablesTemperature=["max_air_temperature","min_air_temperature","mean_air_temperature","sea_surface_temperature"];
	if(variablesTemperature.indexOf(variable)>= 0)
		return 'temperature';
	else if (variablesHumidity.indexOf(variable)>= 0)
		return 'humidity';
	else
		return null;
}


exports.login= function(request, response){
	username=request.body.usuario
	password=request.body.password
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT * FROM usuario WHERE usuario.username= " +generarString(username)+ " limit(1)" ;
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



function getPoint(text){
	cordenadas=text.split(";")[1].substring(6).replace(')','').split(" ");
	return {lat:parseFloat(cordenadas[0]),lng:parseFloat(cordenadas[1])}
}

exports.getLocalities = function(request, response){ //recibe un objeto ruta
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT id,code,descripcion,ST_AsEWKT(ubicacion) AS ubicacion FROM locality";
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	 	var result=[];
	 	var auxList=data.rows;
	    for (var i in auxList) {
	    	var locality={
	    		id:auxList[i].id,
	    		code:auxList[i].code,
	    		descripcion:auxList[i].descripcion,
	    		point:getPoint(auxList[i].ubicacion)
	    	}
	    	result.push(locality);
	    }
	    console.log(result)
		response.json(result);
	});
}
exports.getEstacion = function(request, response){
	var idLocality=request.query.locality;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT id,code,descripcion,ST_AsEWKT(ubicacion) AS ubicacion FROM locality WHERE id="+idLocality;
	client.query(queryString, function(err, data, fields) {
	    if (err){
	    	console.log('Error');
	    	response.render('index')
	    }
	    if(data.rows.length>=1){
		    console.log('Si Existe ESTACION');
		    console.log(data.rows[0])
			datos={
				permiso:request.session.infoUser.permiso,
				idLocality:idLocality,
				code:data.rows[0].code,
				descripcion:data.rows[0].descripcion,
				point:getPoint(data.rows[0].ubicacion)
			}

			response.render('estacionMeteorologica',datos)
		}else{
			console.log('ESTACIONES')
			datos={
				permiso:request.session.infoUser.permiso
			}
			response.render('estaciones',datos);
		}
	 	
	});
}

function ejecutarQuery(index,idEstacion,variablesUtilizadas,response){
	var client = new pg.Client(conString);
	client.connect();
	variable=variables[index];
	var queryString = "SELECT "+variable
	+" FROM locality,"+getTabla(variable)
	+" WHERE "+getTabla(variable)+".id_locality=locality.id"
	+" and locality.id="+idEstacion
	+" and "+ variable+" IS NOT NULL"
	client.query(queryString, function(err, data, fields) {
    	if (err) throw err;
    	if(data.rows.length>=1){
    		variablesUtilizadas.push(Object.keys(data.rows[0])[0]);
    	}
	    index+=1;
	    if(index<variables.length){
	    	ejecutarQuery(index,idEstacion,variablesUtilizadas,response);
	    }else{
	    	console.log("termino: ",variablesUtilizadas)
	    	response.json({variables:variablesUtilizadas}); 
	    }
	});

}

exports.getVariablesMeteorologicas = function(request, response){
	var idEstacion=request.query.id;
	var variablesPermitidas=[];
	ejecutarQuery(0,idEstacion,[],response);
	
}


function generarString(s){
	return "'"+s+"'"
}


exports.getMediasNormales= function(request, response){
	var idEstacion=request.query.id;
	var variable=request.query.variable;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT month,"
	+" AVG (CAST (replace("+ variable+ ",',','.')  AS FLOAT))"
	+" FROM locality,"+getTabla(variable) 
	+" WHERE locality.id="+getTabla(variable)+".id_locality"
	+" and locality.id="+idEstacion
	+" and "+ variable+" IS NOT NULL"
	+" GROUP BY month"
	+" ORDER BY month";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    result=[]
	    console.log(data.rows)
	    for (var i =0 ; i <data.rows.length; i++) {
	    	result.push(data.rows[i]["avg"])
	    }
	    console.log(result)
	    var queryString2 = "SELECT DISTINCT year"
		+" FROM locality,"+getTabla(variable) 
		+" WHERE locality.id="+getTabla(variable)+".id_locality"
		+" and locality.id="+idEstacion
		+" and "+ variable+" IS NOT NULL"
		+" ORDER BY year";
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
	+" FROM locality,"+getTabla(variable) 
	+" WHERE locality.id="+getTabla(variable)+".id_locality"
	+" and locality.id="+idEstacion
	+" and year="+year
	+" and "+ variable+" IS NOT NULL"
	+" ORDER BY month";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    console.log(data.rows)
	    response.json({data:data.rows}); 
		
	});
}

exports.getAniosTemperatura= function(request, response){
	var idEstacion=request.query.id;
	var variable=request.query.variable;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT year"
	+" FROM locality,temperature"
	+" WHERE locality.id=temperature.id_locality"
	+" and locality.id="+idEstacion
	+" ORDER BY year";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    console.log(data.rows)
		response.json({years:data.rows});
		
	});
}

exports.getTemperaturas= function(request, response){
	var idEstacion=request.query.id;
	var year=request.query.year;
	var client = new pg.Client(conString);
	client.connect();
	var queryString = "SELECT DISTINCT temperature.month,"
	+" CAST (replace(max_air_temperature,',','.')  AS FLOAT) AS max_air_temperature,"
	+" CAST (replace(min_air_temperature,',','.')  AS FLOAT) AS min_air_temperature,"
	+" CAST (replace(mean_air_temperature,',','.')  AS FLOAT) AS mean_air_temperature"
	+" FROM locality,temperature"
	+" WHERE locality.id=temperature.id_locality"
	+" and locality.id="+idEstacion
	+" and year="+year
	+" ORDER BY month";
	console.log(queryString);
	client.query(queryString, function(err, data, fields) {
	    if (err) throw err;
	    result=[]
	    console.log(data.rows)
	    response.json({data:data.rows}); 
		
	});
}




function generarCSV(Datos) {
    var texto = '';
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





