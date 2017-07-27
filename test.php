<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Ficheros</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="jqUploader/css/jqUploader.min.css">
</head>
<body>

	<input type="button" value="Enviar" id="boton_subir"><br>
	<input type="hidden" id="oculto_cadena_1" value="Esto es una cadena oculta">
	<input type="hidden" id="oculto_cadena_2" value="Esto es otra cadena oculta">
	<input type="hidden" id="oculto_cadena_3" value="Esto es la tercera cadena oculta">
	<div id="contenedor_de_archivos"></div>

	<script language="javascript" type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script language="javascript" type="text/javascript" src="jqUploader/js/jqUploader.js"></script>

	<script language="javascript" type="text/javascript">
		var subidor = $('#contenedor_de_archivos').jqUploader({
			lang: 'es-ES',
			boton_de_envio: "boton_subir",  
			campos_complementarios: new Array(
				new Array('Comentarios', 'text', 'comentarios', 'maxlength=10'), 
				new Array('Detalles', 'text', 'detalles', 'maxlength=10') 
			), 
			campos_procedentes_de_la_pagina: new Array(
				"oculto_cadena_1", 
				"oculto_cadena_2", 
				"oculto_cadena_7" // Este no existe, por lo que el plugin lo ignorará. Es un error "a propósito" para pruebas.
				// Además, como aquí no declaramos el campo "oculto_cadena_3", el valor de este no será procesado.
			), 
			accion_de_subida_correcta: 'C'
		});
	</script>
</body>
</html>