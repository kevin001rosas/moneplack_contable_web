var menu = `
<header class="bp-header cf">
    <div class="dummy-logo" style="background-color: white;">
        <div class="row">
            <div class="col-12">
                <img id="logo_pmm" src='${base_url}img/pmm_logo.png' style='height: auto; width:90%;margin-top:20px;'>
            </div>
            <div class="col-12">
                <div class="row justify-content-center">
                    <div class="col-10">
                        <h2 style="font-size: 24px;text-align: center;color:black;">Sistema Administrativo Contable</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
<button class="action action--open"><span class="icon icon--menu"></span></button>
<nav id="ml-menu" class="menu">
    <button class="action action--close"><span class="icon icon--cross"></span></button>
    <div class="menu__wrap">
        <ul data-menu="main" class="menu__level" tabindex="-1" role="menu">
            <li class="menu__item" role="menuitem"><a id="button_unidades" class="menu__link" href="${base_url}vistas/unidades/ver_unidades.html">Unidades de Producto</a></li>
            <li class="menu__item" role="menuitem"><a id="button_productos" class="menu__link" href="${base_url}vistas/productos/ver_productos.html">Productos</a></li>
            <li class="menu__item" role="menuitem"><a id="button_clientes" class="menu__link" href="${base_url}vistas/clientes/ver_clientes.html">Clientes</a></li>`; 

//En caso de ser administrador, agregamos el enlace para administrar usuarios. 
if(Cookies.get('id_tipo_de_usuario')=="1")
menu +=  `<li class="menu__item" role="menuitem"><a id="button_usuarios" class="menu__link" href="${base_url}vistas/usuarios/ver_usuarios.html">Usuarios</a></li>`; 

menu+= `<li class="menu__item" role="menuitem"><a id="contabilidad" data-submenu="submenu_contabilidad" class="menu__link">Contabilidad</a></li>
            <li class="menu__item" style="margin-top:20px;">
                <div class="row">
                    <div class="col-5" style="text-align:right;padding-left:25px;">
                        <div class="row" style="width: 100%;">
                            <div class="col-12" style="margin: auto;text-align:right;">
                                <img class="" src='${Cookies.get("foto_url")}' onerror="this.src='${default_image_url}';" style='cursor: pointer;height:100px; width: 100px;' />
                            </div>
                        </div>
                    </div>
                    <div class="col-7" style="text-align:left;padding:0px;">
                        <div class="row" style="height:100%;">
                            <div class="col-12" style="margin-top:auto; margin-bottom:auto;padding-left:0px;">
                                <span class='letra_perfil_encabezado' style="">${Cookies.get("nombres_de_usuario")}</span>
                                <div class="letra_perfil_encabezado" style="">${Cookies.get("tipo_de_usuario")}</div>
                                <div class="button_cerrar_sesion" onclick="cerrar_sesion()" style="">Cerrar Sesión</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <ul data-menu="submenu_contabilidad" id="submenu_contabilidad" class="menu__level" tabindex="-1" role="menu">
            <li class="menu__item" role="menuitem"><a id="button_facturas" class="menu__link" href="${base_url}vistas/contabilidad/ver_facturas.html">Facturas y Pagos</a></li>
            <li class="menu__item" role="menuitem"><a id="button_facturas" class="menu__link" href="${base_url}vistas/contabilidad/ver_otros_pagos.html">Otros Pagos</a></li>
            <li class="menu__item" role="menuitem"><a id="button_cargar_facturas" class="menu__link" href="${base_url}vistas/contabilidad/cargar_facturas.html">Cargar Facturas</a></li>`; 

if(Cookies.get('id_tipo_de_usuario')=="1")
    menu +=  `<li class="menu__item" role="menuitem"><a id="button_facturas" class="menu__link" href="${base_url}vistas/contabilidad/ver_reportes.html">Reportes</a></li>`
    
menu += `<li class="menu__item" role="menuitem" style="margin-top:20px;">
                <div class="row">
                    <div class="col-5" style="text-align:right;padding-left:25px;">
                        <div class="row" style="width: 100%;">
                            <div class="col-12" style="margin: auto;text-align:right;">
                                <img class="" src='${Cookies.get("foto_url")}' onerror="this.src='${default_image_url}';" style='cursor: pointer;height:100px; width: 100px;' />
                            </div>
                        </div>
                    </div>
                    <div class="col-7" style="text-align:left;padding:0px;">
                        <div class="row" style="height:100%;">
                            <div class="col-12" style="margin-top:auto; margin-bottom:auto;padding-left:0px;">
                                <span class='letra_perfil_encabezado' style="">${Cookies.get("nombres_de_usuario")}</span>
                                <div class="letra_perfil_encabezado" style="">${Cookies.get("tipo_de_usuario")}</div>
                                <div class="button_cerrar_sesion" onclick="cerrar_sesion()" style="">Cerrar Sesión</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</nav>
<div id="loading"></div>`; 

	

$("#menu").html(menu);