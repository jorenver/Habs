
function inicializar (){

}

function redireccionarLogIn(event){
	var respond = JSON.parse(event.target.responseText);
	//console.log(respond)
	if(respond.value){
		//console.log(respond.infoUser.permiso)
		window.location.href="/inicio";
	}else{
		alert('usuario o contrasena incorrecto')
	}
}



function login(){
	usuario=document.getElementById("login_user").value
	password=document.getElementById("login_password").value
	datos={usuario:usuario,password:password}
	console.log(datos)
	var request = new XMLHttpRequest();
	var url="/login";
	request.open("POST",url,true);
	request.addEventListener('load',redireccionarLogIn ,false);
	request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	request.send(JSON.stringify(datos));

}



window.addEventListener('load', inicializar, false);