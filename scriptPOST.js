/*jshint sub:true*/
// Declaración de variables locales
// relacionadas con interface html
var btnGuardar = document.getElementById("btnGuardar");
var btnMostrar = document.getElementById("btnMostrar");
var txtNomb = document.getElementById("txtNomb");
var txtEmail = document.getElementById("txtEmail");
var txtContra = document.getElementById("txtContra");
var resultados = document.getElementById("Datos");

var salida = "";
//Declara las variables para conectarse con servidor remoto
//que contiene el web service
//--------------------------------------------------------------
var remoto = new XMLHttpRequest();
var url = "http://localhost:5001/insertar_usuario"; // <---------- URL de API que va a ejecutar el SCRIPT


//Programación de evento botón guardar
btnGuardar.addEventListener("click",function(){
    //Determina la funcion HTTPRequest entre sitio local y el remoto
    remoto.open("POST",url,true);

    //Determina la forma de intercambio de datos entre el sitio local
    //el sitio remoto para la pagina actual
    remoto.setRequestHeader('Accept', 'application/json');
    remoto.setRequestHeader("Content-Type","application/json");

    remoto.onreadystatechange = function (){
        if(remoto.readyState==4){
            if(remoto.status == 201){
                salida =  "<br /><br />";
                var resul = JSON.parse(remoto.responseText);

                salida = salida.concat('status code: '    + resul.status_code    + '<br />');
                salida = salida.concat('status message: ' + resul.status_message + '<br />');

                salida = salida.concat('Datos Registrados<br />------------------------<br />');

                var data = resul.data["user"];

                salida = salida.concat('Token: '  + data["token"]  + '<br />');
                salida = salida.concat('Nombre: ' + data["name"]   + '<br />');
                salida = salida.concat('eMail: '  + data["email"]  + '<br />');
                salida = salida.concat('Clave: '  + data["passwd"] + '<br />');

                document.getElementById("Datos").innerHTML = salida;
            }else{
                document.getElementById("Datos").innerHTML = (remoto.responseText);
            } //fin del if de status
        }//fin del if readyState
    }//fin de la funcion interna

    var datos = JSON.stringify({"name":txtNomb.value,
                                "email":txtEmail.value,
                                "passwd":txtContra.value});
    remoto.send(datos);

    txtNomb.value = ""
    txtEmail.value = ""
    txtContra.value = ""

});



//Programación de evento botón mostrar
btnMostrar.addEventListener("click", function() {
    //Establece la URL de la API para obtener los usuarios registrados

    //          Seccion de ajustes de parametros para realizar la peticion

    var urlMostrar = "http://localhost:5001/recorrer_bases";
    //Crear una nueva solicitud XMLHttpRequest
    var solicitudMostrar = new XMLHttpRequest();
    //Abrir la solicitud GET a la URL especificada
    solicitudMostrar.open("GET", urlMostrar, true);
    //Establecer el tipo de contenido que se espera recibir
    solicitudMostrar.setRequestHeader('Accept', 'application/json');


    //Definir la función que manejará la respuesta del servidor
    solicitudMostrar.onreadystatechange = function() {
        if (solicitudMostrar.readyState == 4) {
            if (solicitudMostrar.status == 200) {
                var respuesta = JSON.parse(solicitudMostrar.responseText); //convierte lo que devolvio el servidor en un JSON
                var usuarios = respuesta.data.users;  // de los JSON que devolvió llamado "DATA", va a trabajar con la clave "users"
                //por lo que, esta variable que se llama usuarios es una LISTA/VECTOR con los atributos name, 
                //email y psswd, con lo que tiene el diccionario DATA, en la clave USERS


                //Inicializar el contenido de salida
                var salida = "<br /><br />";

                
                //Recorrer la lista de usuarios y construir el HTML
                for (var i = 0; i < usuarios.length; i++) {

                    //Crear un div para cada usuario y aplicar la clase CSS
                    salida += '<div class="usuario">';
                    salida += '<p>Nombre: ' + usuarios[i].name + '</p>';
                    salida += '<p>Email: ' + usuarios[i].email + '</p>';
                    salida += '<p>Clave: ' + usuarios[i].passwd + '</p>';
                    salida += '</div>';
                }

                //Actualizar el contenido del elemento con id "Datos"
                document.getElementById("Datos").innerHTML = salida;
            } else {
                //Mostrar un mensaje de error si la solicitud no es exitosa
                document.getElementById("Datos").innerHTML = "Error al obtener los usuarios.";
            }
        }
    };

    //Enviar la solicitud
    solicitudMostrar.send(); //esto es como decir, mae, hagalo xd
});


