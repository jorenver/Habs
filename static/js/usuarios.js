var id=-1;
var modo=-1; // 0: nuevo usuario 1: editar usuario
var myId=-1;
function cancelarEliminacion(){
	id=-1;
}

function clikNuevoUsuario(){
	modo=0;
	limpiarDatosUsuario();
	datosUsuario();
	btnAceptar.setAttribute('onclick',"ajaxNuevoUsuario();")
}


function datosUsuario(){
	$('#usuarioDatos').removeClass('hide');
	$('#principal').addClass('hide')
}

function mostrarUsuarios(){
	id=-1;
	$('#usuarioDatos').addClass('hide');
	$('#principal').removeClass('hide')
}

function procesarRemoverUsuario(event){
	var respond = event.target.responseText;
	var j= JSON.parse(respond);
	if(j.error){
		alert('error al eliminar')
		return;
	}else{
		$(".row[data-id="+j.id+"]").remove()
	}
}

function ajaxRemoverUsuario(){
	var request = new XMLHttpRequest();
	var url="/configurarUsuarios/removerUsuario?id="+id;
	request.open("GET",url,true);
	request.addEventListener('load',procesarRemoverUsuario ,false);
	request.send(null);
	id=-1;
}

function removerUsuarioClick(event){
	console.log('remover '+event.target.dataset.id)
	id=event.target.dataset.id
	$("#ModalEliminar").modal();
	
}
function removerUsuario(){
	$("#ModalEliminar").modal('hide');
	ajaxRemoverUsuario(id);
}

function procesarEditarUsuario(event){
	var respond = event.target.responseText;
	var j= JSON.parse(respond);
	if(j.error){
		alert('error al editar')
	}else{
		mostrarUsuarios()
		obtenerUsuarios()
		alert('Editado')
	}

}

function ajaxEditarUsuario(){
	if(txtPass1.value==txtPass2.value){
		var request = new XMLHttpRequest();
		var url="/configurarUsuarios/editarUsuario";
		request.open("POST",url,true);
		request.addEventListener('load',procesarEditarUsuario,false);
		request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		datos={
			id:id,
			nombres:txtNombres.value,
			apellidos:txtApellidos.value,
			mail:txtEmail.value,
			pass:txtPass1.value,
			permiso:selectPermiso.selectedIndex
		}
		request.send(JSON.stringify(datos));
	}else{
		alert('La ontrase&ntilde;a no coincide')
	}
}

function llenarDatosUsuario(user){
	console.log(user)
	txtUserName.value=user.username
	txtUserName.disabled = true
	txtNombres.value=user.nombres
	txtApellidos.value=user.apellidos
	txtEmail.value=user.mail
	txtPass1.value=user.password
	txtPass2.value=user.password
	selectPermiso.selectedIndex=user.permiso
	if(selectPermiso.selectedIndex==1){
		selectPermiso.disabled=true
	}else{
		selectPermiso.disabled=false
	}

}

function limpiarDatosUsuario(){
	txtUserName.value=""
	txtUserName.disabled = false
	txtNombres.value=""
	txtApellidos.value=""
	txtEmail.value=""
	txtPass1.value=""
	txtPass2.value=""
	selectPermiso.disabled=false
}

function procesarObtenerUsuario(event){
	var respond = event.target.responseText;
	var j= JSON.parse(respond);
	if(j.error){
		alert('error al Editar')
		return;
	}else{
		datosUsuario();
		btnAceptar.setAttribute('onclick',"ajaxEditarUsuario();")
		llenarDatosUsuario(j.infoUser);
	}
	
}

function ajaxObtenerUsuario(){
	var request = new XMLHttpRequest();
	var url="/configurarUsuarios/getUsuario?id="+id;
	request.open("GET",url,true);
	request.addEventListener('load',procesarObtenerUsuario,false);
	request.send(null);
}

function editarUsuarioClick(event){
	console.log('editar '+event.target.dataset.id)
	id=event.target.dataset.id
	modo=1;
	ajaxObtenerUsuario(event.target.dataset.id)
}


function addElementoUsuario(usuario){
	row=document.createElement("div");
	row.setAttribute("class","row elementoUsuario");
	row.setAttribute("data-id",usuario.id);

	nick=document.createElement("div");
	nick.innerHTML='<span class="glyphicon glyphicon-user" style="padding:10px;"></span>'
	nick.setAttribute("class","user col-md-2");
	nick.innerHTML+=usuario.username;

	botones=document.createElement("div");
	botones.setAttribute("class","col-md-3");

	if(usuario.permiso!=1 || usuario.id==myId){
		botonEditar=document.createElement("button");
		botonEditar.setAttribute("class","btn btn-primary");
		botonEditar.setAttribute("aria-label","Left Align");
		botonEditar.innerHTML="Editar"
		spanEditar=document.createElement("span");
		spanEditar.setAttribute("class","glyphicon glyphicon-pencil");
		spanEditar.setAttribute("aria-hidden","true");
		botonEditar.appendChild(spanEditar);
		spanEditar.setAttribute("data-id",usuario.id);
		botonEditar.setAttribute("data-id",usuario.id);
		botonEditar.setAttribute("onclick","editarUsuarioClick(event);");
		botones.appendChild(botonEditar);
	}

	if(usuario.permiso!=1){
		botonRemover=document.createElement("button");
		botonRemover.setAttribute("class","btn btn-danger");
		botonRemover.setAttribute("aria-label","Left Align");
		botonRemover.innerHTML="Eliminar"
		spanRemover=document.createElement("span");
		spanRemover.setAttribute("class","glyphicon glyphicon-remove");
		spanRemover.setAttribute("aria-hidden","true");
		botonRemover.appendChild(spanRemover);
		spanRemover.setAttribute("data-id",usuario.id);
		botonRemover.setAttribute("data-id",usuario.id);
		botonRemover.setAttribute("onclick","removerUsuarioClick(event);");
		botones.appendChild(botonRemover);
	}
	
	row.appendChild(nick);
	row.appendChild(botones);
	users.appendChild(row);
}

function procesarUsuarios(event){
	var respond = event.target.responseText;
	var j= JSON.parse(respond);
	if(j.error){
		window.location.href="/"; 
		return;
	}
	myId=j.myId
	usuarios=j.usuarios
	users.innerHTML=""
	for (var i = 0; i < usuarios.length; i++) {
		addElementoUsuario(usuarios[i]);
	}
}

function obtenerUsuarios(){
	var request = new XMLHttpRequest();
	var url="/configurarUsuarios/getUsuarios";
	request.open("GET",url,true);
	request.addEventListener('load',procesarUsuarios ,false);
	request.send(null);
}


function inicializar (){
	obtenerUsuarios()	
}



window.addEventListener('load', inicializar, false);


