  var pagina_actual = 1; 
  var cantidad_elementos_en_pagina = 0; 
  var cantidad_elementos_por_pagina = 8; 
  var contador_solicitudes = 0; 
  var contador_solicitudes_modals = 0; 
  var cantidad_maxima_solicitudes = 7; 
  //var base_url = "http://moneplackcontable.xiksolutions.com/"; 
  var base_url = "http://localhost/moneplack/";

  //var api_url = "http://moneplackcontable2.xik.mx/api/";
  var api_url = "http://localhost:3343/api/";
  //as-001-site1.gtempurl.com/api";
  var default_image_url = `${base_url}/img/camera.png`;

  $(document).ready(function() {  		  
          validar_accesos();           

          //En caso de no ser un administrador, ocultaremos los botones de
          // descargar profesionales, certificados (clientes) y mascotas.
          if(Cookies.get("id_tipo_de_usuario")!=="1")
          {
            $("#div_descargar").hide();
            $("#div_registrar_profesional").hide(); 
          }

        });

  function llenar_notificaciones()
  {
    llenar_solicitudes_de_acceso(); 
  }

  function llenar_solicitudes_de_acceso()
  { 
        //Solo para los usuarios administradores y distribuidores, se mostrará la cantidad de solicitudes totales. 
        if(!((Cookies.get('id_tipo_de_usuario').toString()==="5")
        || (Cookies.get('id_tipo_de_usuario').toString()==="1")))
        {          
          $("#notification_badge").hide();
          return;
        }

        
        var settings = 
        {
           "async": false, 
           "crossDomain": true,
           "url": `${api_url}/usuarios/getSolicitudesCount`, 
           "method": "GET",
           "headers": {
             "Content-Type": "application/json",
             "cache-control": "no-cache",             
             "id_tipo_de_usuario": `${Cookies.get('id_tipo_de_usuario')}`, 
             "id_distribuidor": `${Cookies.get('id_distribuidor')}`, 
             "id_usuario": `${Cookies.get('id_usuario')}`
           },
           "processData": false,                      
            success: function(data)
            { 
              if(data==="incorrecto")
                $("#notification_badge").hide();                 
              else
              {

                var obj = JSON.parse(data);                     
                $("#notification_badge").html(obj[0]["total"].toString()); 

                //Mostramos la barra de notificación
                $("#notification_badge").show();
                
              }
           }
           , error: function() { }
         }
      
         $.ajax(settings);                  
  }

  function mandar_a_perfil()
  {
    window.location.href=`${base_url}/vistas/usuarios/perfil_de_usuario.html?id=${Cookies.get('id_usuario')}`; 
  }

    function subir_imagen(element_id, url)
    {
            $uploadCroppedPhoto.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            }).then(function (resp) {

            
            this.picture = $("#" + element_id);
            this.picture.attr('src', resp);
            $url_foto = resp; 
            //En resp esta la imagen en Base 64. 
            $("#" + $div_foto_croppie).hide(); 
            $("#" + $div_foto_original).show("slow"); 

            form = {}; 
            form.foto_url = resp; 

            //Hacemos la solicitud Ajax para subir la imagen. 
            var settings = {
           "async": false,
           "crossDomain": true,
           "url": `${url}`, 
           "method": "POST",
           "headers": {
             "Content-Type": "application/json",
             "cache-control": "no-cache",
             "token": `${Cookies.get('token')}`, 
             "id_usuario": `${Cookies.get('id_usuario')}`
           },
           "processData": false,
           "data": JSON.stringify(form)
         }
      
         $.ajax(settings).done(function (data)
          {
            //alert(data); 

          }); 
        
            });
    }

    function configurar_croppie(width, height)
    {
        var settings = {
            enableExif: true,
            viewport: {
                width: width,
                height: height,
                type: 'circle'
            },
            boundary: {
                width: width + 50,
                height: height + 50
            }
        }; 
        $uploadCroppedPhoto = $('#' + $croppie_container).croppie(settings);

        //Configuración de evento para leer la imagen. 
        $('#file_picker_croppie').change(function(){          
          readFile(this);                    
          $("#" + $div_foto_original).hide(); 
          $("#" + $div_foto_croppie).show(); 
        });
        
    } 
    
    function seleccionar_imagen()
{
    $('#file_picker_croppie').trigger('click');
}

    function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();    

    reader.onload = function (e) {
      $('#' + $croppie_container).croppie('bind', {
        url: e.target.result
      });
    }

    reader.readAsDataURL(input.files[0]);
  }
}   

function validar_accesos()
        {
            var url = window.location.pathname;            
            var filename = url.substring(url.lastIndexOf('/')+1);

            if(Cookies.get('id_usuario')==null)
            {
                //En este caso no ha iniciado sesión. Lo mandamos al Index. 
              if(!(
                (filename==="index.html")
                ||(filename==="")
                ||(filename==="pre_registro.html")
                )
                )
              {                
                window.location.href = `${base_url}`; 
              }          
              return;    
            }   

            
            //Si se encuentra en el index. Redirigirlo al perfil de usuario. 
            if((filename==="index.html")||(filename===""))
            {
              window.location.href = `${base_url}/vistas/contabilidad/ver_facturas.html?id=${Cookies.get('id_usuario')}`; 
              return;     
            }
            
        }

        function iniciar_sesion()
        {          
          //Hacemos una solicitud Ajax con los accesos. 
          var settings = {
           "async": false,
           "crossDomain": true,
           "url": `${api_url}/usuarios/getIniciarSesion`, 
           "method": "GET",
           "headers": {
             "Content-Type": "application/json",
             "cache-control": "no-cache",
             "nombre_de_usuario": $("#nombre_de_usuario").val(), 
             "secret": $("#secret").val()
           },
           "processData": false,                      
            success: function(data){  
            $("#errores").hide(); 
            if(data==="vacio")
            {
              var mensaje = "Nombre de usuario o contraseña incorrectos"; 
              $("#errores").html(mensaje); 
              $("#errores").show('slow'); 
              return; 
            }
            var obj = JSON.parse(data);
            //Parseamos la información.
            Cookies.set('token', obj[0]["token"], { expires: 1 });
            Cookies.set('id_usuario', obj[0]["id_usuario"], { expires: 1 });
            Cookies.set('id_tipo_de_usuario', obj[0]["id_tipo_de_usuario"], { expires: 1 });
            Cookies.set('nombres_de_usuario', obj[0]["nombres_de_usuario"], { expires: 1 });
            Cookies.set('tipo_de_usuario', obj[0]["tipo_de_usuario"], { expires: 1 });
            isUrlExists(obj[0]["foto_url"], function(status){
                    if(status === 200){
                       // file was found                                              
                    }
                    else if(status === 404){
                       // 404 not found
                       obj[0]["foto_url"] = default_image_url;
                    }
                });

            Cookies.set('foto_url', obj[0]["foto_url"], { expires: 1 });
            
            location.reload(); 

           }
           , error: function(data)
           {
              $("#errores").hide(); 
              var mensaje = "Hubo un error durante la conexión al servidor"; 
              $("#errores").show('slow'); 
           }
         }
      
         $.ajax(settings);

        }        

    function cerrar_sesion()
    {
      //Removemos las cookies. 
      Cookies.remove('id_usuario');
      Cookies.remove('token');
      Cookies.remove('id_tipo_de_usuario')

      //Lo mandamos al index
      window.location.href = base_url; 
    }  

    
      function isUrlExists(url, cb){                  
          jQuery.ajax({
              url:      url,
              async: false, 
              dataType: 'text',
              type:     'GET',              
              complete:  function(xhr){
                if(url===null)
                {
                  cb.apply(this, [404]); 
                  return; 
                }

                if(url===""){
                  cb.apply(this, [404]); 
                  return; 
                }

                if(typeof cb === 'function')
                     cb.apply(this, [xhr.status]);
              }
          });
      }  
      function correo_valido(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      function numero_valido(numero) {
        var re = /^(([0-9]+))$/;
        return re.test(String(numero).toLowerCase());
      }      

      function llenar_paginacion()
      {
        var append_paginacion = ""; 
        
        var append_paginacion = `<div class="col-12" style="text-align: right;"><ul>`; 

        //En caso de ser la página 1, no mostramos la fecha de anterior. 
        if(pagina_actual!=1)
        {
          append_paginacion += `<li class="button_paginacion" data-pagina="${pagina_actual-1}" onclick="actualizar_pagina(this);">Anterior</li>`; 

        }


        //Si hay mas élementos en la página, debemos cargar el siguiente. 
        if(cantidad_elementos_en_pagina>cantidad_elementos_por_pagina)
        {
          append_paginacion += `<li class="button_paginacion" data-pagina="${pagina_actual+1}" onclick="actualizar_pagina(this);">Siguiente</li>`;
        }

        append_paginacion+= `</ul></div>`; 
                          
        $("#paginacion").html(append_paginacion); 
      }


      function correo_cliente_inexistente(correo)
      {

        $("#loading").show(); 
        //Es un correo válido, no existe en la base de datos. 
        contador_solicitudes++;
        var settings = 
        {
           "async": false, 
           "crossDomain": true,
           "url": `${api_url}/clientes/getSearchByEmail`, 
           "method": "GET",
           "headers": {
             "Content-Type": "application/json",
             "cache-control": "no-cache",
             "email": `${correo}`, 
             "token": `${Cookies.get('token')}`, 
             "id_usuario": `${Cookies.get('id_usuario')}`
           },
           "processData": false,                      
            success: function(data)
            {    
              if(data==="incorrecto")
                correo_bool = true; 
              else
              {
                correo_bool = false; 
              
                //Parseamos la información. 
                var obj = JSON.parse(data);                
               
                cliente_buscado = obj[0]["cliente"]; 
                id_cliente_buscado = obj[0]["id"];
              }
           }
           , error: function() { }
         }
      
         $.ajax(settings);         
         $("#loading").hide();
         return correo_bool; 
      }

      function mostrar_errores(id_elemento, mensaje)
      {
        $("#" + id_elemento).hide(); 
        $('html,body').animate({
                       scrollTop: $("#" + id_elemento).offset().bottom},'slow');
        $("#" + id_elemento).html(mensaje); 
         $("#" + id_elemento).show("slow");                                      
      }

      function correo_usuario_inexistente(correo)
      {
        $("#loading").show(); 
        //Es un correo válido, no existe en la base de datos. 
        contador_solicitudes++;
        var settings = 
        {
           "async": false, 
           "crossDomain": true,
           "url": `${api_url}/usuarios/getSearchByEmail`, 
           "method": "GET",
           "headers": {
             "Content-Type": "application/json",
             "cache-control": "no-cache",
             "email": `${correo}`, 
             "token": `${Cookies.get('token')}`, 
             "id_usuario": `${Cookies.get('id_usuario')}`
           },
           "processData": false,                      
            success: function(data)
            {    
              if(data==="incorrecto")
                correo_bool = true; 
              else
              {
                correo_bool = false; 
              
                //Parseamos la información. 
                var obj = JSON.parse(data);                
               
                cliente_buscado = obj[0]["cliente"]; 
                id_cliente_buscado = obj[0]["id"];
              }
           }
           , error: function() { }
         }
      
         $.ajax(settings);         
         $("#loading").hide();
         return correo_bool; 
      }      

      function telefono_local_valido(telefono)
      {
        var re = /^(([0-9]{8}))$/;
        return re.test(String(telefono).toLowerCase())
      }

      function telefono_celular_valido(telefono)
      {
        var re = /^(([0-9]{10}))$/;
        return re.test(String(telefono).toLowerCase())
      }      

      function imprimir_cookie()
      {
        var señor = Cookies.get('name');
               
        alert(señor); 
      }

      function borrar_cookie()
      {
        //Cookies.remove('name', { path: '' });
        Cookies.remove('name');
      }  

 function getIdFromURL()
  {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    return id;
  }  

  function getValueFromUrl(parametro)
  {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get(parametro);
    return id;
  }


function quitar_loading()
{
  $("#loading").hide(); 
}  

function poner_loading()
{
  $("#loading").show(); 
}  

function descargar_de_url(url, modo)
{
  var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.setRequestHeader('id_usuario', Cookies.get('id_usuario'));
    request.setRequestHeader('id_tipo_de_usuario', Cookies.get('id_tipo_de_usuario'));
    request.setRequestHeader('modo', modo);
    //request.setRequestHeader('id_distribuidor', Cookies.get('id_distribuidor'));

    request.responseType = 'blob';

    request.onload = function() {
      // Only handle status code 200
      if(request.status === 200) {
        // Try to find out the filename from the content disposition `filename` value
        var disposition = request.getResponseHeader('Content-Disposition');        
        var matches = /(=[^"]*.xls)/.exec(disposition.toString());
        var archivo = matches[1].substr(1);
        
        var filename = (matches != null && archivo ? archivo : 'archivo.xls');

        // The actual download
        var blob = new Blob([request.response], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
      
      // some error handling should be done here...
    };

    request.send();

}

  function descargar_reporte_de_clientes()
  {
    descargar_de_url(`${api_url}/descargas/getReporteDeClientes`, "");
  }


  function llenar_encabezado()
  {

    var tipo_de_usuario = ""; 

    if(Cookies.get('id_tipo_de_usuario')=="1")
    {
      tipo_de_usuario = `(${Cookies.get("tipo_de_usuario")})`; 
    }
    else
    {
      tipo_de_usuario = `(${Cookies.get("tipo_de_usuario")}, ${Cookies.get('distribuidor')})`;
    }

    var contenido_encabezado = 
    //Esconde en dispositivos más pequeños que md
`            <div class='d-none d-lg-block col-2 col-xm-2 encabezado_inicio'>` +
`            </div>` +
            //Se muestra solo en md.
`            <div class='d-md-none col-12 col-xl-5' style='text-align:center;background-color: white;'>` +
`                <img src='${base_url}/images/royal_canin_logo_02.jpg' style='padding-left:15px;margin-bottom:15px;height: 80px; width:auto; '>` +
`            </div>` +
`            <div class='d-md-none col-12 col-xl-2' style='text-align:center;background-color: white;'>` +
`                <img style="display:none;" class="button_icon" onclick="window.open('https://breeder.royalcanin.com/login','_blank');" src='${base_url}/images/logo_royal_start.svg' style='padding-left:15px;margin-top:8px;height: 80px; width:auto; '>` +
`            </div>` +
              //Se muestra en mayores de md . 
`            <div class='d-none d-md-block col-12 col-md-5 col-lg-5 col-xl-5' style='background-color: white;'>` +
`                <img src='${base_url}/images/royal_canin_logo_02.jpg' style='padding-left:15px;margin-bottom:15px;height: 80px; width:auto; '>` +
`            </div>` +
`            <div class='d-none d-md-block col-12 col-md-2 col-lg-2 col-xl-2' style='background-color: white;'>` +
`                <img style="display:none;" class='button_icon' onclick="window.open('https://breeder.royalcanin.com/login','_blank');" src='${base_url}/images/logo_royal_start.svg' style='padding-left:15px;margin-top:8px;height: 80px; width:auto; '>` +
`            </div>` +
            //Se muestra en mayores a md. 
`            <div class='d-none d-md-block col-12 col-md-5 col-lg-3 col-xl-3 fondo_perfil_encabezado'>` +
`                <div style="text-align:right;">
                 <img src='${Cookies.get("foto_url")}' style='height: 80px;position: absolute; top:7px; right:30px;padding:0px;margin-bottom:-100px;'>
                  <span class='letra_perfil_encabezado' style="position:absolute; right: 125px; bottom: 50px;">${Cookies.get("nombres_de_usuario")}</span>
                  <div class="letra_perfil_encabezado" style="position:absolute; right: 125px; bottom:32px;font-size:15px;">${tipo_de_usuario}</div>
                  <div class="button_cerrar_sesion" onclick="cerrar_sesion()" style="position:absolute; right: 125px; bottom: 11px;">Cerrar Sesión</div>
            </div></div>` + 
            //Se muestra solo en el md.  
            `<div class='d-md-none col-12 fondo_perfil_encabezado' style="border-radius:0px;padding-top:10px;min-height:100px;">` +
`                <div style="text-align:center;">
                  <img src='http://micrositioroyalcanin.tk/images/profile.png' style='height: 80px;position: absolute; top:12px; right:30px;padding:0px;margin-bottom:-100px;'>
                  <span class='letra_perfil_encabezado' style="position:absolute; right: 125px; bottom: 50px;">${Cookies.get("nombres_de_usuario")}</span>
                  <div class="letra_perfil_encabezado" style="position:absolute; right: 125px; bottom:32px;font-size:15px;">${tipo_de_usuario}</div>
                  <div class="button_cerrar_sesion" onclick="cerrar_sesion()" style="position:absolute; right: 125px; bottom: 11px;">Cerrar Sesión</div>
            </div></div>`            ; 

    $("#encabezado").html(contenido_encabezado); 
  }

  function llenar_menu()
  {
    var ocultar_criador = ""; 
    var ocultar_distribuidor = "";     


    if((Cookies.get("id_tipo_de_usuario")==="2")
      ||(Cookies.get("id_tipo_de_usuario")==="3")
      ||(Cookies.get("id_tipo_de_usuario")==="4"))
    {
        ocultar_criador = "style='display:none;'"; 
    }

    if((Cookies.get("id_tipo_de_usuario")==="5"))
    {
        ocultar_distribuidor = "style='display:none;'"; 
    }    

      var contenido_menu = `<div class='row'>  
                    <div id='button_ver_perfil' class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/usuarios/perfil_de_usuario.html?id=${Cookies.get('id_usuario')}"'>   
                        <img id='button_perfil' src='${base_url}/images/user.png' style='margin-right: 10px;' height='40' width='40'>   
                        Mi Perfil
                    </div>
                    <div id='button_ver_clientes' ${ocultar_distribuidor} class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/clientes/ver_clientes.html"'>   
                        <img id='button_clientes' src='${base_url}/images/certificate.png' style='margin-right: 10px;' height='40' width='40'>   
                        Certificados
                    </div>   
                    <div id='button_ver_usuarios' ${ocultar_criador} class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/usuarios/ver_usuarios.html"'>   
                        <img src='${base_url}/images/criadores.png' style='margin-right: 10px;' height='40' width='40'>   
                        Profesionales   
                    </div>                       
                    <div id='button_ver_mascotas' ${ocultar_distribuidor} onclick='window.location.href="${base_url}/vistas/mascotas/ver_mascotas.html"' class='col-12 button_menu'>   
                        <img src='${base_url}/images/mascotas.png' style='margin-right: 10px;' height='40' width='40'>   
                        Mascotas
                    </div>   
                    <div id='button_ver_tipos_de_mascotas' ${ocultar_distribuidor} ${ocultar_criador} onclick='window.location.href="${base_url}/vistas/tipos_de_mascota/ver_tipos_de_mascota.html"' class='col-12 button_menu'>   
                        <img src='${base_url}/images/dog.png' style='margin-right: 10px;' height='40' width='40'>   
                        Tipos de Mascotas   
                    </div>   
                    <div id='button_ver_kits' ${ocultar_distribuidor} onclick='window.location.href="${base_url}/vistas/kits/ver_kits.html"' class='col-12 button_menu'>   
                        <img src='${base_url}/images/kits.png' style='margin-right: 10px;' height='40' width='40'> Kits  
                    </div>
                    <div id='button_ver_solicitudes_de_acceso' ${ocultar_criador} class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/solicitudes_de_acceso/ver_solicitudes_de_acceso.html"'>   
                        <img src='${base_url}/images/key.png' style='margin-right: 10px;' height='40' width='40'>   
                        <span id="notification_badge" style="display:none;" class="notification_badge"></span>
                        Solicitudes de Acceso
                    </div>
                    <div id='button_ver_terminos_y_condiciones' class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/ver_terminos_y_condiciones.html"'>   
                        <img src='${base_url}/images/legal.png' style='margin-right: 10px;' height='40' width='40'>   
                        Términos y Condiciones
                    </div>
                    <div style='display:none;' id='button_ver_manual_de_usuario' class='col-12 button_menu' onclick='window.location.href="${base_url}/vistas/solicitudes_de_acceso/ver_solicitudes_de_acceso.html"'>   
                        <img src='${base_url}/images/manual.png' style='margin-right: 10px;' height='40' width='40'>   
                        Manual de Usuario
                    </div>
                </div>`   
      $("#menu").html(contenido_menu);  

      //Llenamos las notificaciones que van sobre el menú.
      llenar_notificaciones(); 
  }

      function poner_fecha_de_hoy(id_elemento)
      {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

        today = mm + '/' + dd + '/' + yyyy;
        today = `${yyyy}-${mm}-${dd}`;


        $("#" + id_elemento).val(today);      
      }      