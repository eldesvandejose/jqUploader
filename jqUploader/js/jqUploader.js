(function ($) {
	$.fn.jqUploader = function (opcionesRecibidas) {
		/* Importación de archivos CSS */
		document.write('<style>');
		document.write('@import url("https://fonts.googleapis.com/css?family=Damion");');
		document.write('@import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");');
		document.write('</style>');

		/*Se definen los rótulos del plugin en los idiomas deseados.
		Si el idioma pedido por el script llamante no está aquí, se 
		tomará, por defecto, el español ('es-ES')*/
		var	Rotulos = {
			'es-ES':{
				rotuloDeEncabezado: 'jqUploader', 
				rotuloAgregarArchivos: 'Agregar archivo(s)', 
				rotuloSubirArchivos: 'Subir archivo(s)', 
				rotuloArrastrarYSoltar: 'Usa el botón \"Agregar archivo(s)\" o arrástralos y suéltalos en la Zona de archivo(s)', 
				rotuloEliminarUnArchivo: 'No enviar este archivo', 
				rotuloEliminarTodosLosArchivos: 'Cancelar todos los archivos', 
				rotuloTipoNoPermitido: 'Hay archivo(s) no admitido(s)', 
				rotuloPesoArchivoNoPermitido: 'Hay archivo(s) demasiado grande(s)', 
				rotuloPesoGlobalNoPermitido: 'El conjunto de archivos supera el peso admitido', 
				rotuloArchivosEnviados: 'Archivo(s) enviado(s)', 
				rotuloDeMinimoDeArchivosNoAlcanzado: 'No hay suficientes archivos', 
				rotuloDeMaximoDeArchivosSuperado: 'Hay demasiados archivos', 
				rotuloTituloDeModalArchivosTransferidos: 'Envío correcto', 
				rotuloTituloDeModalArchivosNoTransferidos: 'Envío interrumpido', 
				rotuloDeModalArchivosTransferidos: 'Se han enviado los datos', 
				rotuloDeModalArchivosNoTransferidos: 'Se ha producido un error', 
				rotuloDeEnvioEnProceso: 'Se están enviando los datos', 
				rotuloDeBotonDeCierreDeModal: 'Aceptar'
			}, 
			'en-US':{
				rotuloDeEncabezado: 'jqUploader', 
				rotuloAgregarArchivos: 'Add file(s)', 
				rotuloSubirArchivos: 'Upload file(s)', 
				rotuloArrastrarYSoltar: 'Use the \"Add file(s)\" button or drag\'em and drop\'em on the file(s) area', 
				rotuloEliminarUnArchivo: 'Don\'t send this file', 
				rotuloEliminarTodosLosArchivos: 'Clear all files', 
				rotuloTipoNoPermitido: 'There are no allowed file(s)', 
				rotuloPesoArchivoNoPermitido: 'One or mor files are too big', 
				rotuloPesoGlobalNoPermitido: 'The global files weight is too big', 
				rotuloArchivosEnviados: 'File(s) sent', 
				rotuloDeMinimoDeArchivosNoAlcanzado: 'There are no quite enough files', 
				rotuloDeMaximoDeArchivosSuperado: 'There are too many files',
				rotuloTituloDeModalArchivosTransferidos: 'Success', 
				rotuloTituloDeModalArchivosNoTransferidos: 'Failure', 
				rotuloDeModalArchivosTransferidos: 'Your data have been sent', 
				rotuloDeModalArchivosNoTransferidos: 'An error happened', 
				rotuloDeEnvioEnProceso: 'Data sending in progress', 
				rotuloDeBotonDeCierreDeModal: 'Accept'
			}
		} 

		this.each(function(){ /* Empieza el procesado del objeto al que se asocia el plugin. */
			/* Definición de opciones por defecto */
			var Options = {
				// Opciones de formulario y envio
				url_destino: 'recibir.php', 
				id_campo_file: 'id_file', 
				name_campo_file: 'name_file', 
				peso_maximo_de_cada_archivo: '2M', 
				peso_maximo_de_la_subida: '10M', 
				tipos_de_archivo: new Array(
					'application/pdf', 
					'application/zip', 
					'application/mp4', 
					'audio/mpeg', 
					'audio/mp4', 
					'audio/mp3', 
					'image/*', 
					'text/plain', 
					'video/mpeg'
				), 
				mostrar_boton_de_subida: true, 
				mostrar_boton_de_borrar_todos: true, 
				minimo_numero_de_archivos: 1, // Nunca debe ser menor que 1
				maximo_numero_de_archivos: 0, // 0 = Sin límite máximo
				/* Los campos complementarios son inherentes a cada archivo que se envíe. 
				Cada uno se definirá, a su vez, como una matriz con cuatro elementos:
					La etiqueta con la que aparece el campo.
					El tipo de campo (actualmente se permite text, date o number)
					El nombre con el que el campo se enviará al script receptor
					Los atributos adicionales, como maxlength (para texto), min o max (para number) */
				campos_complementarios: new Array(), 
				/* Los campos propios de la página en la que se incorpore este plugin, 
				que también deben enviarse al receptor de destino. 
				Cada uno es una cadena con el id del campo en cuestión, y se enviará con ese 
				nombre. */
				campos_procedentes_de_la_pagina: new Array(), 
				// Definición de la capa de archivos.
				anchura: '60%', 
				anchura_min: '500px', 
				altura: '300px', 
				altura_min: '300px', 
				margen_sup: '10px', 
				margen_inf: '10px', 
				margen_izd: 'auto', 
				margen_der: 'auto', 
				color_fondo: 'rgba(200, 200, 200, 1)', 
				borde: '2px dashed black', 
				// Definicion de la capa de encabezado y pie del plugin
				color_fondo_encabezado_y_pie: '#000', 
				// i18n
				lang: 'es-ES', 
				// El botón de envio. Si está vacio, se usará el propio del plugin. Si no, se usará uno de la página.
				boton_de_envio: '', 
				// La funcion callback está prevista para el futuro. De momento, minificado no la ejecuta, por lo que no se incluye
				// funcion_callback: '', 
				// Accion para el envio correcto: "C" Limpia el subidor, y no toca nada en el resto de la pagina.
				// "R" Recarga toda la página
				accion_de_subida_correcta: 'C'
			};

			/*******************************************************************************************************************************************************
			**** DEFINICIÓN DE ICONOS																															****
			********************************************************************************************************************************************************/
			var iconos = new Array();
			//AUDIO.GIF
			iconos[0] = "data:image/gif;base64,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";

			// VIDEO.GIF
			iconos[1] = "data:image/gif;base64,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";

			// PDF.GIF
			iconos[2] = "data:image/gif;base64,R0lGODlhUABQAPcAAPr59uSGkt8sSuUIGvL8+e/Y0+MUKO4VKevGzNRFU+BVY91ncuzn2fr//+kdMei4uOMbM/r6/tlaZuimqPXh2v70/Nl4gfbIzvLW1NZkavLHyvn5+uUmOvQVKdcEGuYQHtY0SPb59doTL/Hb1ekZLOv+/vHt5PX9+doLJd5JWvH/+/fp6fj9/v/7/9d0deUOKuYaL9iBidQaNvz8//z++uIOH+BhcuvO0/n29twiL+cQKOsbMPPd2vXr8eoSJvPTzeckLPHi4v///fj//skqOeEdLthFWOYcLOcvRdyamtkcK9yrq/76/vO9wtEiMN8mNuoaJ+QcLdwRI/z6+OYZKPb//+J2fvf5/ONFU/O4u/z+/eUcKugbLvX18so6Sfn++/r+/e4bL/Px5fr07dhGSuvR0OMcI/v8+thEVNeMkO7u4dIoN+MaK+YaK/j++fQZMfr7/uEbLtk+TdQpPfLN0+Swrc1MWPv8/PLy6vQJIfLk6frc3tcTKvP//84VKP/7/P75/NYjN+QdLPHf4eAZKO7u6vb7+u378/nb1ffT1OMaLvj8/NcxO+YcLtEcL9cQH/f++/no4+scMctpbNsjOusMIOkZKff7/8UkLvv5/taeovv7+/fu791LVfLCxeoXMuIcKfr/+f/4/vj9++EIJ9hSXfv++P73/O0ZMNZMWf/w+MtZZuYEJ9ktNc8sReIWM9wbJfv3+88/TshTWPf9/usHIPvt6+4MKPX8/fHt6uwfMuFjbfnh5e3h3Pn8+PP6/PH6+uofLNsqPecXK/EcK/X/+/j28u/y5+gbMuQXLv39/f3///3+/vz///z//vz8/Pz+//38/fz+/v3+//z8/f39+/7//uAgLP38/Pv9+/z9/uscLuYfLP708/zw5emcoOmms9Jgcc5weNgaJ+AACN/Ry/Xz/L9Za/Do5fPv7vfr7Pfv7PHNyvQhMtyfou8BGvjm7OscNe4aOPMQK/P46fr47+YZLd0PK+wYLdRLUeUdL+YeMfrx+OYbLv7+/v///yH5BAAAAAAALAAAAABQAFAAAAj/AP8JHEiwoMGDCBMqXMhQoL+HECMqjEixosWLGCkSzMixo8ePIENyVEaypEmRKDGeTGnNn0ll06zJtNawps1/1piVDGkN0KYh2JQt0rZImjMwmzYoJcC0qdOnUKNKbXqialUVffrMYAGmmjNA0Tj6GhVNlSgmZ0JEemAlwyw7pVLInUu3rt27eOd22ttJQQBP61Rc4sdkxqZNQjKCedbiUpVmK5LISubjw4dKlWpo3sy5s+fPoDc/elRjtAEIstytaEYrVhcwI0+xKDEkSyoUt7bs292okaTfwIMLH068OHAuMPrBUHQE34sXqXiUYAGoZUZtoka5mRCoBgkqZoJx/2EDCtSWLW3Sn1+fvr3790fOH5lPv/58Lvi5NFLEJpigGhKI0QcczFj0z0PKRLNIFXVAYEA/9rTRSD8U9tOGPvu0YQk+9gnioSBH5MfFER/qUwQEMJBAQoUsVihiFEU4wIUgBzySygh9ALITRAe6tEkVGMhiAD4tsjjMMFFck4N99QlyzZPXgEgfFW0EEwwoRxSpZYv46MNHBus08AxJEiFISwjisBLHMBMWeYQuBhyACjLb1FlnGHjmqaeebxATjBlQbCkohfiwIc89STgTDZk8ItgAHXPMs4U9gsKyBT4G3IMCKZtuSsqnpLAiKiugfkqqFC/4wMWgWsKwjwMk3P8iiy3LMPpQj8rQEkANQAyjz5ZHAEGII/lksMCxC9igrLLJNrvsssdK4EUy+1CqCKsUwnCNA0p42UQDd9jKozFoPKILKJZsyYUZ91jQhTQ9+jPTTM3U28wy+OJrzTJV/HODK3wEgw8E12Krz69cDGBFCVe4wURF//AijKqgrKglF7AIsAdtOM07LzMghxzyH8xAsoE/TayhAzFUtMnqwf1w8cIuBGTiRjTW8UiHCB3Yo4TFRXLhgwDGlPCwSi+V9McGhoxiSAMPUAIFEKsajPAHqXAywwnY5HyrBvd0AEEcQLd4xAcC4KDNFBklveMGzyzzizMPzGFAllbHrIMsnED/c0ILEINNzD4QUKplFGgbE8EobbutjBabtNACIKeUoEIdMuigDyht7CDowY1woUMC6TRTTFgaXcAHFMgkt6UgaOPQAi24KpMSIIsU888SMhxgxjWfCMoFjPr4gEYuy9BwhjOpr+6A61vGPgMtLe0oEhgRAOKLEN+IME8OHAgP4z46HJ/88s2zDr2Wsc/u0jNjptRANH/4UgIBSXhPiPhFkG++8syTiOqg8LxBSY8WysDGMzbxjIvM5CIPA8AV4GC5AIjgBfoIncsoNLz+lQ95AEydCAgYM0G1jxYqwAUz+rAMazRAIA2wRr3kJZBlNGAZOImhTBrgjytcoQ/GiAEf/w5Agigko2ocHN8HzxdAHl1ghA6IAt4oNJ9stY8Fg0lEAXjBAx4gggeDSEQvKIAIdPRiBBTgARlHgEYGBKEABegFACrwizHEAAXnsocDWNRB/xWiGSEUIBSlyKIqKueKfcCAF4ggjDVAIBBOcEIgkECJRwaCEk9ohSZz8IQnBCIQT8CEBUxRAVyooB4ucAIxdFEEPioRDX8MpBMHOcV+GBIG7VuEChCBiRpQgQOtAAEI1oCCPABBFoxAAgceMYB5cAAEAhAGI4TRAQ8sQAUh8AcuIOGNTgygH3FwpQdhCUj0CZKAhKzQLXNZAh4EYh4QCIAbV0CBBdxjFxRgAD1MEP8DYoqDFz1QxzHq0IoahKMBJ8iGP+5wglJ8gA0FS+I4Y2nOWaKzlutMWwtY8I9BPMESiDrEKsiwBHR4wQosSMMsksCPAKBgF4dIQykkgIUODEAC/miGM4SgjRAooAYO8FyFGhGFKJAvARRt4q2eeNFC4g2XGuVoEJ7gAx9MQA8yIIc4RiGHBZyADOTwAwJ44AcbdGMBmQQFFB4xiWbc6h8A+CkJhEohouoNqeVUqj/+wdQoYvSpV/zHVA8ghSSU4AEPUIMnOOCCUJDhAzpYQi5EEA4WMIABiMiAFGqxC5DtFa5ypWs/7OqA0eUiryJsqjoBG1XBPoGwSTAHOL5hARD/sMIKVQArChDAABSEAxhpkEMKhLGNGrT1rXH1jmjtKjq8ynKptHSqFVs7VR9IwR09IAIKavAKKVjgH+IAQQwOkQQU2CAEEvDAK17RjhpkQBvIDS2LSGta1J7Tr9I9ZFQb4M4ODCMNDIgUIeAZDngUwgRjcIcrSLEANUjgBfJ4QQ5qMYkGaEMZQgCtcucbhX4go3wmWIY0NqFXvkZ3tdOVHRwagAhK+OAAHOjEETpQmTdwwAhYwAIIHpGHDrSiE8gY0jzM8I4MfOHCGU7uXDnsYR0YIcTQIHFq8Yti/cqOBQ0oA8DWi4IcOOEJkXQEClDAh0f4wQk5UAIKPuEEJcDC/wn3CIc2kKzhJQ+1qPFwMpSlfN90UpG1KqZFF9hRjnKU4QYIQMAN6FCGMrDjBpBWNALKwOgb/OAH7KDDIOBADQzXebkd/vCTlxHlEvfVz7YEdAvgcIkrACIrDRhCHxrQDBk2owG4rkIVcN2HZvShXwPBXqeTLN87RyHPoy71lFGd0StLgxqoe4g0/FGNE8TiCiz4gzW+MAQtKAMMhlCU7eQ17odYQ8miZYM+HJAMPZMaDqY+8Z9TvFGMuEEF6uiFG9GhB37jYBmQcEa5K3LuYlNI3ex2NzTgvey/0psFDmyBKGKACSLMwRWuAIErEPAPMOiVIgXfcIUQ3u5kM7zPDv+3cr0vAoZLWGEAt/ABFA6Ajxpk4R/LgA1GQm7ng6+75FA+uUWpPG+VQ/wi0CiGFXwACg44ABUQ4MMDcA6GAjkQ3SxSxLphoPAZxFu1RYfqlXdOAyvUYBskAEUUuCCFJjQDDC2Yxs6xXiF9hPoFRhCDNSIA34bnV+wrt4g1yn52fICiHzto+9vjPneD98PuHsa73vkOsVOnHPBHFzzht2F4xCse7nK/uuMhjwzJ773vKP/7FTEihM13PvFuB33jRU4h0pue8n6vMuYjwoxsjFsLbjD7NoZxeNg3AO4Z4blobZ/3ZcAB9UNntqoz7w9oQIIaf4AGC8puAHsgKQo7eIT/J5bhD7bNvuePn1Dp894AFiQm92FfPUQSGItoDAEOgLDCPa5xBLWzvQn/EA0nc37Lp36S137vl3q6J38Q8QfRoA2b0ABVYAF8oAuGB36PgABYtgl/QIAskkGRx37uV3nylmoPRxHLswGAoAf1VAOSEAagoA9c8AhZMAXdoAwsYHUER3e1Z4AimIDRd3kM6A9ggAszMAo9cA4g0ApUEAeNwA3glwxYYAea0AC4MG2Cx4PpF4JigIAkSECNUEstMoRVQAtMoAKxIAHvAAX8RwVUUAQckAw14AHuMASx4IF154NdOIJTFoYmFFURwQJw0AIqMASeEAj4wA2WgAzxEAdP/yIFq6AOVzAKWiB6tLeF67eHQAhdYCiGLDKEytAC1AAJJ1APAeAIurANJ2IAHVAJIJAIzXAFX6CDIKeFIJiJXtiHnlghoNgC0vAHZzAFxyABtwAK3EAIkhAHj/ANy8AEtMA4loh+t3iAfHhftvSHsgMJFEENzAAILXACKsAOjuADbOADguAHLjAGVeCMCiURBKGF9CWCykCLezVAMrKLMYM2G6ANxUARJgEG0aACafAC8XAN+IAGe+APQWEg7/hTlgBq/VBaRqAG7fcMpuY8I7IlUWAAAhAC/OiPJRENtNAHeBAOB0AMjvAADZAJ1pOFDgmRDuADE9l+d3CRBJSRWv9yBFIAAiEwA9oYESYBjhVQBSMgDB4QA33AAtEwJgOHICWxDMn1kEwmkRTJAjWZPshwjTm5k3/jBiBJEsEYC4fwBeAQA7yATX/AlBVhEsuQDS85lTJZlRZ5K+aWCHNABcTQCEWARB9IBZSACNNxa7g2mIMpa79WBdOha4S5mIxJASlgAKAQPBUiCCQwDA4wAHYwBmAgClxBlzkVCbLgA2YgCetTSBxACikwARpQABjQmq7ZmgXARrLJA7L5mhgAR7jpmiPwA7sgBcFQBPFQSLqgCLpQCy7gBsXAmZW4Vw8xDQCwAKRwDZy3JTCAClHAB3ywBtq5ndzZnd75ndo5B+L/OQdrQAi+owvBWVcGUATXoAus8A1VoAItcAbkx5wuoQUPUIFswCZa0gg5cA3z8AagQHMEig8EegAIegAvtqAJ2qAGaqAM6gOwcA1FgAr8mS2CAAQGQAQYMARFMQXv1yNxwwByUAtKQAgwAAP6MV9uOA4VWgQwGqMyCgE0CgH7cDAHEwc6qqOK0KM9+iGCEAWSAAHyQHwVEgUOUATE4AHHOQNMsAimYBEd+ACMwA1UkAzyIA9bwEckkAxFoA8kICJiihwpqqIiwiIwEAV2Z3ciAgPIgB+2FAzqtg8VWguugAHzowzaQI8PoQ1VsB1KQAVKoARFYA+Gw0fYkqiKqhzJ/0ACBqoLb+AIdfAPTKCWFgENVzAEIZAGQ2QPFnioixqqiaoPNroPOSAFc1AHNAAM1GCpFcEMp8AELKACASAD9/AGBtAGorqr2NJhb3ALrDAHE1AMOAAHoxAUTQkRU+ALVVABgHACCKAA4zAOBlCt1nqt2Jqt2rqt3GqtPlAJG5oBF2AIDNMNU+Cq/ugPVtcAzjAGDxADdoAGRjCvCVCv9nqv+Jqv+pqv89qv/moEpRAAGoADAjcmm5CsO3cKGzAEkOALK/CwEBuxEjuxFFuxFgux6IAHpnBvxwo/8QMS1ZANuPALV8CuznCy+ZKyKruyLNuyy3CyMBuzzuB8OAAALlvRkh4xCmCgDKKQHW7ws0ALtF8wtERbtEZ7tEj7BUG7tF8QDYYACVWgcylhO9XgC26gBSIzA1q7tVzbtV77tV4rMmKrBabgC5sQbSmRtmq7tgx5E277tnCLEAEBADs=";

			// ZIP.GIF
			iconos[3] = "data:image/gif;base64,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";

			// TEXTO_PLANO.GIF
			iconos[4] = "data:image/gif;base64,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";

			// OTROS.GIF
			iconos[5] = "data:image/gif;base64,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";
			/*******************************************************************************************************************************************************
			**** FINAL DE DEFINICIÓN DE ICONOS																													****
			*******************************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		OPCIONES GENERALES 																											****
			*******************************************************************************************************************************************/
			/* Se define una variable para almacenar el peso global de la subida. 
			Esta se define aquí porque se crea cada vez que se instancia el plugin. De este modo 
			se puede incrementar con todos los archivos que añadamos, y se inicia a 0 cuando se carga el 
			documento que usa este uploader. */
			var pesoGlobalDeArchivos = 0;
			// Se extienden las opciones por defecto a partir de las recibidas, y se asocian al objeto.
			var opcionesElegidas = $.extend(Options, opcionesRecibidas);
			this.opciones = opcionesElegidas;

			//i18n
			if (Rotulos[this.opciones.lang] == undefined) this.opciones.lang = "es-ES";
			this.opciones.i18n = Rotulos[this.opciones.lang];

			// Se crean los flags de error de tipos, error de peso de archivo y error de peso global
			this.errorEnTiposMIME = false;
			this.errorDePesoDeArchivo = false;
			this.errorDePesoGLobal = false;
			// Se crea una matriz que alamacenará los objetos FileReader que contendrán los ficheros que se vayan a enviar.
			this.matrizDeArchivosEnviables = new Array();
			/* Se crea una referencia al objeto, que será la que se usará cuando haya que referenciarlo dentro del contexto de funciones, 
			donde "this" no es el objeto principal. */
			var objetoPrincipal = this;
			// Si se ha definido un botón de envio externo al plugin, se agrega la mecánica aquí.
			if (this.opciones.boton_de_envio != ''){
				$('#' + this.opciones.boton_de_envio).on('click', function(e){
					e.preventDefault();
					$(objetoPrincipal).enviarArchivosAlServidor();
				});
			}

			/*******************************************************************************************************************************************
			****		FINAL DE OPCIONES GENERALES 																								****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		CONSTRUCCIÓN DEL ENTORNO GRÁFICO																							****
			*******************************************************************************************************************************************/
			/* Se le dan estilos al contenedor referenciado en el HTML y que servirá como contenedor global para el subidor de archivos. */
			$(objetoPrincipal).css({
				'min-width': this.opciones['anchura_min'], 
				'width': this.opciones['anchura'], 
				'min-height': this.opciones['altura_min'], 
				'height': this.opciones['altura'], 
				'margin-top': this.opciones['margen_sup'], 
				'margin-bottom': this.opciones['margen_inf'], 
				'margin-left': this.opciones['margen_izd'], 
				'margin-right': this.opciones['margen_der'], 
				'position': 'relative', 
				'padding': '0', 
				'border': 'none'
			});

			/* Creamos el contenedor del encabezado */
			var encabezado = $('<div></div>');
			encabezado.css({
				'z-index': '1', 
				'padding-left': '20px', 
				'width': '100%', 
				'height': '50px', 
				'border': 'none', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie']
			});
			var signoDeAgregarFicheros = $('<span id="zonaDeSignoMas" class="fa fa-plus" title="' + objetoPrincipal.opciones['i18n']['rotuloAgregarArchivos'] + '"></span>');
			signoDeAgregarFicheros.css({
				'position': 'relative', 
				'top': '4px', 
				'padding': '4px', 
				'color': '#01FF01', 
				'font-size': '40px', 
				'cursor': 'pointer', 
				'float': 'left', 
				'margin-right': '20px'
			});
			var signoDeSubidaDeArchivos = $('<span id="zonaDeSignoSubir" class="fa fa-upload" title="' + objetoPrincipal.opciones['i18n']['rotuloSubirArchivos'] + '"></span>');
			signoDeSubidaDeArchivos.css({
				'position': 'relative', 
				'top': '4px', 
				'padding': '4px', 
				'color': '#006CFF', 
				'font-size': '40px', 
				'cursor': 'pointer', 
				'float': 'left', 
				'margin-right': '20px', 
				'visibility': 'hidden' // A la carga, este botón no es visible
			});
			var signoDeCancelarTodos = $('<span id="zonaDeCancelarSubida" class="fa fa-times-circle-o" title="' + objetoPrincipal.opciones['i18n']['rotuloEliminarTodosLosArchivos'] + '"></span>');
			signoDeCancelarTodos.css({
				'position': 'relative', 
				'top': '4px', 
				'padding': '4px', 
				'color': '#F11313', 
				'font-size': '40px', 
				'cursor': 'pointer', 
				'float': 'left', 
				'margin-right': '20px', 
				'visibility': 'hidden' // A la carga, este botón no es visible
			});
			var zonaDeLogo = $('<span id="zonaDeLogo">' + objetoPrincipal.opciones['i18n']['rotuloDeEncabezado'] + '</span>');
			zonaDeLogo.css({
				'position': 'relative', 
				'top': '10px', 
				'padding': '0', 
				'color': '#97D0EB', 
				'font-size': '30px', 
				'line-height': '30px',  
				'float': 'right', 
				'margin-left': '20px', 
				'margin-right': '20px', 
				'font-family': "'Damion', cursive"
			});
			/* Añadimos el encabezado al contenedor referenciado en HTML */
			signoDeAgregarFicheros.appendTo(encabezado);
			signoDeCancelarTodos.appendTo(encabezado);
			signoDeSubidaDeArchivos.appendTo(encabezado);
			zonaDeLogo.appendTo(encabezado);
			encabezado.appendTo(objetoPrincipal);

			/* Creamos el contenedor para la lista de los ficheros. */
			var contenedorDeFicheros = $('<div></div>');
			var alturaDeContenedorDeFicheros = (parseInt(objetoPrincipal.opciones['altura']) > parseInt(objetoPrincipal.opciones['altura_min']))?(parseInt(objetoPrincipal.opciones['altura']) - 80):(parseInt(objetoPrincipal.opciones['altura_min']) - 80);
			alturaDeContenedorDeFicheros += "px";
			contenedorDeFicheros.css({
				'position':'relative', 
				'top': '0',
				'left': '0', 
				'right': '0',  
				'width': '100%', 
				'height': alturaDeContenedorDeFicheros, 
				'background-color': objetoPrincipal.opciones['color_fondo'], 
				'border': objetoPrincipal.opciones['borde'], 
				'overflow-x': 'hidden', 
				'overflow-y': 'auto'
			});

			/* Añadimos la capa contenedora de archivos al contenendor referenciado en el HTML */
			contenedorDeFicheros.appendTo(objetoPrincipal);

			/* Creamos el pie de contenedor para mensaje estándar de subida */
			var pieDeContenedorEstandar = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloArrastrarYSoltar'] + '</div>');
			pieDeContenedorEstandar.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#FFF'
			});
			/* Añadimos el pie del contenedor estándar al contenendor referenciado en el HTML */
			pieDeContenedorEstandar.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de tipo de archivo incorrecto */
			var pieDeContenedorDeTipoIncorrecto = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloTipoNoPermitido'] + '</div>');
			pieDeContenedorDeTipoIncorrecto.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#F00', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de tipos no permitidos al contenendor referenciado en el HTML */
			pieDeContenedorDeTipoIncorrecto.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de peso de archivo incorrecto */
			var pieDeContenedorDePesoDeArchivoIncorrecto = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloPesoArchivoNoPermitido'] + '</div>');
			pieDeContenedorDePesoDeArchivoIncorrecto.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#F00', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de peso de archivo no permitido al contenendor referenciado en el HTML */
			pieDeContenedorDePesoDeArchivoIncorrecto.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de peso global incorrecto */
			var pieDeContenedorDePesoGlobalIncorrecto = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloPesoGlobalNoPermitido'] + '</div>');
			pieDeContenedorDePesoGlobalIncorrecto.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#F00', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de peso global no permitido al contenendor referenciado en el HTML */
			pieDeContenedorDePesoGlobalIncorrecto.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de menos archivos del mínimo */
			var pieDeContenedorDeNumeroDeArchivosInsuficiente = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloDeMinimoDeArchivosNoAlcanzado'] + '</div>');
			pieDeContenedorDeNumeroDeArchivosInsuficiente.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#F00', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de menos archivos del mínimo al contenendor referenciado en el HTML */
			pieDeContenedorDeNumeroDeArchivosInsuficiente.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de más archivos del máximo */
			var pieDeContenedorDeNumeroDeArchivosExcesivo = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloDeMaximoDeArchivosSuperado'] + '</div>');
			pieDeContenedorDeNumeroDeArchivosExcesivo.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#F00', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de más archivos del máximo al contenendor referenciado en el HTML */
			pieDeContenedorDeNumeroDeArchivosExcesivo.appendTo(objetoPrincipal);

			/* Creamos el pie del contenedor para mensaje de archivos enviados */
			var pieDeContenedorDeArchivosEnviados = $('<div class="pie_de_plugin">' + objetoPrincipal.opciones['i18n']['rotuloArchivosEnviados'] + '</div>');
			pieDeContenedorDeArchivosEnviados.css({
				'position': 'relative', 
				'left': '0', 
				'right': '0', 
				'bottom': '0', 
				'width': '100%', 
				'height': '30px', 
				'background-color': objetoPrincipal.opciones['color_fondo_encabezado_y_pie'], 
				'border': 'none', 
				'text-align': 'center', 
				'font-family': 'Arial', 
				'font-size': '12px', 
				'line-height': '30px', 
				'color': '#00F', 
				'display': 'none'
			});
			/* Añadimos el pie del contenedor de archivos enviados al contenendor referenciado en el HTML */
			pieDeContenedorDeArchivosEnviados.appendTo(objetoPrincipal);
			/*******************************************************************************************************************************************
			****		FINAL DE CONSTRUCCIÓN DEL ENTORNO GRÁFICO																					****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		CONSTRUCCIÓN DEL FORMULARIO (EN SU CASO) Y DEL CAMPO DE ARCHIVOS															****
			*******************************************************************************************************************************************/
			var cadenaDeFormularioDeEnvio = '<div></div>';
			var formularioDeEnvio = $(cadenaDeFormularioDeEnvio);
			var cadenaDeCampoFile = "<input type='file' id='" + objetoPrincipal.opciones.id_campo_file + "' ";
			cadenaDeCampoFile += "name='" + objetoPrincipal.opciones.name_campo_file + "' multiple style='z-index:0; width:0; height:0; visibility:hidden;'>";
			var campoFile = $(cadenaDeCampoFile);
			/* Campo file y formulario ocultos a la vista */
			campoFile.css({
				'position': 'absolute', 
				'top': '0', 
				'left': '0', 
				'width': '0', 
				'height': '0'
			});
			formularioDeEnvio.css({
				'position': 'absolute', 
				'top': '0', 
				'left': '0', 
				'width': '0', 
				'height': '0'
			});
			/* Se añaden al contenedor global */
			campoFile.appendTo(formularioDeEnvio);
			formularioDeEnvio.appendTo(objetoPrincipal);
			/* Se eliminan variables que ya no son necesarias. */
			cadenaDeFormularioDeEnvio = undefined;
			cadenaDeCampoFile = undefined;
			/*******************************************************************************************************************************************
			****		FINAL DE CONSTRUCCIÓN DEL FORMULARIO (EN SU CASO) Y DEL CAMPO DE ARCHIVOS													****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		COMPROBACIÓN Y CÁLCULO DE TAMAÑOS MÁXIMOS PERMITIDOS																		****
			*******************************************************************************************************************************************/
			var valorEstablecido, multiplicador, valorNumerico, valorFinal;
			if (objetoPrincipal.opciones.peso_maximo_de_cada_archivo != '0'){
				valorEstablecido = objetoPrincipal.opciones.peso_maximo_de_cada_archivo;
				multiplicador = valorEstablecido.substr(valorEstablecido.length - 1, valorEstablecido.length);
				if (multiplicador != 'K' && multiplicador !='M' && multiplicador !='G'){
					objetoPrincipal.opciones.peso_maximo_de_cada_archivo = 0;
				} else {
					valorNumerico = parseInt(valorEstablecido.substr(0, valorEstablecido.length - 1));
					if (valorNumerico.toString() != valorEstablecido.substr(0, valorEstablecido.length - 1)){
						objetoPrincipal.opciones.peso_maximo_de_cada_archivo = 0;
					} else {
						switch (multiplicador){
							case 'K':
								valorFinal = valorNumerico * 1024;
								break;
							case 'M':
								valorFinal = valorNumerico * 1048576;
								break;
							case 'G':
								valorFinal = valorNumerico * 1073741824;
								break;
						}
						objetoPrincipal.opciones.peso_maximo_de_cada_archivo = valorFinal;
					}
				}
			}

			if (objetoPrincipal.opciones.peso_maximo_de_la_subida != '0'){
				valorEstablecido = objetoPrincipal.opciones.peso_maximo_de_la_subida;
				multiplicador = valorEstablecido.substr(valorEstablecido.length - 1, valorEstablecido.length);
				if (multiplicador != 'K' && multiplicador !='M' && multiplicador !='G'){
					objetoPrincipal.opciones.peso_maximo_de_la_subida = 0;
				} else {
					valorNumerico = parseInt(valorEstablecido.substr(0, valorEstablecido.length - 1));
					if (valorNumerico.toString() != valorEstablecido.substr(0, valorEstablecido.length - 1)){
						objetoPrincipal.opciones.peso_maximo_de_la_subida = 0;
					} else {
						switch (multiplicador){
							case 'K':
								valorFinal = valorNumerico * 1024;
								break;
							case 'M':
								valorFinal = valorNumerico * 1048576;
								break;
							case 'G':
								valorFinal = valorNumerico * 1073741824;
								break;
						}
						objetoPrincipal.opciones.peso_maximo_de_la_subida = valorFinal;
					}
				}
			}

			if (objetoPrincipal.opciones.peso_maximo_de_la_subida < objetoPrincipal.opciones.peso_maximo_de_cada_archivo){
				objetoPrincipal.opciones.peso_maximo_de_cada_archivo = 0;
				objetoPrincipal.opciones.peso_maximo_de_la_subida = 0;
			}
			objetoPrincipal.peso_global_disponible = objetoPrincipal.opciones.peso_maximo_de_la_subida;
			/*******************************************************************************************************************************************
			****		FINAL DE COMPROBACIÓN Y CÁLCULO DE TAMAÑOS MÁXIMOS PERMITIDOS													****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			********************************************************************************************************************************************
			****		DETECCIONES DE EVENTOS DEL USUARIO																							****
			********************************************************************************************************************************************
			*******************************************************************************************************************************************/
			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE RESPONDE A LA PULSACIÓN DE AÑADIR ARCHIVOS																		****
			*******************************************************************************************************************************************/
			$('#zonaDeSignoMas').on('click', function(){
				$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorEstandar);
				campoFile.click();
			});
			/*******************************************************************************************************************************************
			****		FIN DE LA FUNCIÓN QUE RESPONDE A LA PULSACIÓN DE AÑADIR ARCHIVOS															****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		RESPUESTA A LA SUBIDA DE ARCHIVOS EN EL CAMPO file Y AL DROP EN EL ÁREA CENTRAL												****
			*******************************************************************************************************************************************/
			campoFile.on('change', function(){
				$(objetoPrincipal).checkFiles($(this)[0].files);
				$(objetoPrincipal).createList();
			});

			contenedorDeFicheros.on('dragover', false).on('drop', function (e) {
				event.preventDefault();
				event.stopImmediatePropagation(); 
				event.stopPropagation();
				$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorEstandar);
				$(objetoPrincipal).checkFiles(event['dataTransfer'].files);
				$(objetoPrincipal).createList();
			});
			/*******************************************************************************************************************************************
			****		FINAL DE RESPUESTA A LA SUBIDA DE ARCHIVOS EN EL CAMPO file Y AL DROP EN EL ÁREA CENTRAL									****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		RESPUESTA A LA PULSACIÓN DE ELIMINACIÓN DE UN FICHERO INDIVIDUALMENTE														****
			*******************************************************************************************************************************************/
			contenedorDeFicheros.on('click', '.eliminar_fichero', function() {
				$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorEstandar);
				var id_de_borrador_pulsado = $(this).prop('id').substr($(this).prop('id').lastIndexOf('_') + 1);
				for (var i in objetoPrincipal.matrizDeArchivosEnviables){
					if (objetoPrincipal.matrizDeArchivosEnviables[i]['elements_id'] == id_de_borrador_pulsado){
						objetoPrincipal.peso_global_disponible += parseInt(objetoPrincipal.matrizDeArchivosEnviables[i]['size']);
						objetoPrincipal.matrizDeArchivosEnviables.splice(i, 1);
						break;
					}
				}
				$(objetoPrincipal).createList();

			});
			/*******************************************************************************************************************************************
			****		FINAL DE RESPUESTA A LA PULSACIÓN DE ELIMINACIÓN DE UN FICHERO INDIVIDUALMENTE												****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		RESPUESTA A LA PULSACIÓN DE ELIMINACIÓN DE TODOS LOS FICHEROS																****
			*******************************************************************************************************************************************/
			$('#zonaDeCancelarSubida').on('click', function(){
				$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorEstandar);
				objetoPrincipal.peso_global_disponible = objetoPrincipal.opciones.peso_maximo_de_la_subida;
				objetoPrincipal.matrizDeArchivosEnviables = new Array();
				$(objetoPrincipal).createList();
			});
			/*******************************************************************************************************************************************
			****		FINAL DE RESPUESTA A LA PULSACIÓN DE ELIMINACIÓN DE TODOS LOS FICHEROS														****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		RESPUESTA A LA PULSACIÓN DE SUBIDA DE FICHEROS																				****
			*******************************************************************************************************************************************/
			$('#zonaDeSignoSubir').on('click', function(){
				$(objetoPrincipal).enviarArchivosAlServidor();
			});
			/*******************************************************************************************************************************************
			****		FINAL DE RESPUESTA A LA PULSACIÓN DE SUBIDA DE FICHEROS																		****
			*******************************************************************************************************************************************/
			/*******************************************************************************************************************************************
			********************************************************************************************************************************************
			****		FINAL DE DETECCIONES DE EVENTOS DEL USUARIO																					****
			********************************************************************************************************************************************
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE MUESTRA UN PIE PARA EL PLUGIN Y OCULTA LOS DEMÁS																****
			*******************************************************************************************************************************************/
			$.fn.mostrarPieDePlugin = function(pie) {
				$('.pie_de_plugin').css('display', 'none');
				pie.css('display', 'block');
			}
			/*******************************************************************************************************************************************
			****		FINAL DE LA FUNCIÓN QUE MUESTRA UN PIE PARA EL PLUGIN Y OCULTA LOS DEMÁS													****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE COMPRUEBA CADA ARCHIVO SUBIDO, PARA VER SI ES DE UN TIPO mime PERMITIDO O NO EXCEDE EL PESO.					****
			****		TAMBIÉN SE COMPRUEBA EL PESO GLOBAL DE ARCHIVOS.																			****
			*******************************************************************************************************************************************/
			$.fn.checkFiles = function(ficheros) {
				var numeroDeArchivosEnviados = ficheros.length;
				var numeroDeArchivosQueSeAgregaran = ficheros.length;
				var tiposMimeIncorrectos = false;
				var pesosIndividualesIncorrectos = false;
				var pesoGlobalIncorrecto = false;
				/* Comprombamos los tipos MIME de los archivos, para ver si hay alguno incorrecto. */
				for (var i=0; i<numeroDeArchivosEnviados; i++){
					if (ficheros[i]['name'].indexOf('.zip') > -1 && ficheros[i]['type'] == ""){
						var tipoMIME_deEsteFile = 'application/zip';
					} else {
						var tipoMIME_deEsteFile = ficheros[i]['type'];
					}
					/* Comprobamos si el tipo y subtipo mime está en la lista */
					var tipoExisteEnLista = (objetoPrincipal.opciones.tipos_de_archivo.indexOf(tipoMIME_deEsteFile) > -1);
					/* Si el tipo completo no está en la lista, buscamos el tipo principal con comodín de subtipo */
					if (!tipoExisteEnLista){
						var tipoPrincipal = tipoMIME_deEsteFile.substr(0, tipoMIME_deEsteFile.indexOf("/")) + '/*';
						tipoExisteEnLista = (objetoPrincipal.opciones.tipos_de_archivo.indexOf(tipoPrincipal) > -1);
					}
					/* Si, finalmente, no está en la lista, lo eliminamos de la matriz de los enviados 
					y ponemos una marca de tipo de archivo incorrecto. 
					A partir de ahí pasamos al siguiente archivo, ya no seguimos comprobando nada más en este. */
					if (!tipoExisteEnLista){
						ficheros[i]['type_not_allowed'] = true;
						tiposMimeIncorrectos = true;
					} else {
						ficheros[i]['type_not_allowed'] = false;
					}
					if (tiposMimeIncorrectos) $(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorDeTipoIncorrecto);

					/* Si hay un límite establecido de peso individual por archivo, marcamos los que son aptos y los que no */
					if (objetoPrincipal.opciones.peso_maximo_de_cada_archivo != '0'){
						if (ficheros[i]['size'] > objetoPrincipal.opciones.peso_maximo_de_cada_archivo){
							ficheros[i]['size_not_allowed'] = true;
							pesosIndividualesIncorrectos = true;
						}
					} else {
						ficheros[i]['size_not_allowed'] = false;
					}
					if (pesosIndividualesIncorrectos) $(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorDePesoDeArchivoIncorrecto);

					/* Si hay un límite global establecido, se marcan archivos permitidos hasta el límite de peso global.
					Los demás, se marcan como no permitidos. */
					if (objetoPrincipal.opciones.peso_maximo_de_la_subida != '0'){
						if (ficheros[i]['size'] > objetoPrincipal.peso_global_disponible){
							ficheros[i]['blocked_by_global_size'] = true;
							pesoGlobalIncorrecto = true;
						} else {
							objetoPrincipal.peso_global_disponible -= ficheros[i]['size'];
						}
					}
					if (pesoGlobalIncorrecto) $(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorDePesoGlobalIncorrecto);

					/* Si se ha "roto" alguna de las limitaciones impuestas, se descuenta el número de archivos que se agregarán. */
					if (ficheros[i]['type_not_allowed'] || ficheros[i]['size_not_allowed'] || ficheros[i]['blocked_by_global_size']) numeroDeArchivosQueSeAgregaran --;
				}

				/* Si hay archivos que deban agregarse a la cola de subida, se agregan ahora. */
				if (numeroDeArchivosQueSeAgregaran > 0){
					for (var i=0; i<numeroDeArchivosEnviados; i++){
						if (!ficheros[i]['type_not_allowed'] && !ficheros[i]['size_not_allowed'] && !ficheros[i]['blocked_by_global_size']){
							var objetoFile = new FileReader();
							var fichero = ficheros[i];
							objetoFile.readAsDataURL(fichero);
							objetoFile['name'] = fichero['name'];
							objetoFile['type'] = fichero['type'];
							objetoFile['size'] = fichero['size'];
							objetoFile['elements_id'] = $(objetoPrincipal).randomString();
							objetoPrincipal.matrizDeArchivosEnviables.push(objetoFile);
							objetoFile = null;
							fichero = null;
						}
					}
				}
			} // Aquí acaba la función que comprueba los ficheros y sus posible limitación por peso y tipo
			/*******************************************************************************************************************************************
			****		FIN DE LA FUNCIÓN QUE COMPRUEBA CADA ARCHIVO SUBIDO, PARA VER SI ES DE UN TIPO mime PERMITIDO O NO EXCEDE EL PESO.			****
			****		TAMBIÉN SE COMPRUEBA EL PESO GLOBAL DE ARCHIVOS.																			****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE RECREA LA LISTA "VISIBLE" DE LOS ARCHIVOS QUE HAY EN LA COLA DE SUBIDA.											****
			*******************************************************************************************************************************************/
			$.fn.createList = function() {
				/* Se construyen los elementos gráficos para mostrar en la zona de archivos del plugin. 
				Estos elementos se reconstruyen cada vez que se hace una carga de archivos, mientras no 
				se envíen. 
				También se reconstruirá dinámicamente cada vez que se elimine un archivo. */
				contenedorDeFicheros.html('');
				for (var i in objetoPrincipal.matrizDeArchivosEnviables){
					if (objetoPrincipal.matrizDeArchivosEnviables[i]['readyState'] != '2'){
						objetoPrincipal.matrizDeArchivosEnviables[i].onloadend = function(e){
							if (e != undefined) $(objetoPrincipal).renderizarListaDeArchivos(e.target);
						}
					} else {
						$(objetoPrincipal).renderizarListaDeArchivos(objetoPrincipal.matrizDeArchivosEnviables[i]);
					}
				}

				/* Si hay archivos en la matriz de elementos enviables se muestran los iconos de subir y eliminar todos. 
				En caso contrario, estos iconos se ocultan. */
				if (objetoPrincipal.opciones['mostrar_boton_de_borrar_todos']) 
					$('#zonaDeCancelarSubida').css('visibility', (objetoPrincipal.matrizDeArchivosEnviables.length > 0)?'visible':'hidden');
				if (objetoPrincipal.opciones['mostrar_boton_de_subida'])
					$('#zonaDeSignoSubir').css('visibility', (objetoPrincipal.matrizDeArchivosEnviables.length > 0)?'visible':'hidden');
			}
			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE RECREA LA LISTA "VISIBLE" DE LOS ARCHIVOS QUE HAY EN LA COLA DE SUBIDA.											****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE CREA UNA CADENA ALEATORIA QUE SE USARÁ PARA IDS DE ELEMENTOS.													****
			*******************************************************************************************************************************************/
			$.fn.randomString = function() {
				longitud = 16;
				caracteres = "abcdefghijklmnopqrstuvwxyz";
				var cadena = "";
				var max = caracteres.length-1;
				for (var i = 0; i<longitud; i++) cadena += caracteres[Math.floor(Math.random() * (max+1))];
				return cadena;
			}
			/*******************************************************************************************************************************************
			****		FINAL DE FUNCIÓN QUE CREA UNA CADENA ALEATORIA QUE SE USARÁ PARA IDS DE ELEMENTOS.											****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE RENDERIZA LA VISUALIZACIÓN DE LOS ARCHIVOS PARA INCLUIRLA EN LA ZONA CENTRAL.									****
			*******************************************************************************************************************************************/
			$.fn.renderizarListaDeArchivos = function(archivoCargado) {
				var cadenaDeFicheroParaMostrar = "";
				var icono;
				/* Segun el tipo de imagen se determina el icono a mostrar */
				if (archivoCargado['type'].indexOf('image/') > -1){
					icono = archivoCargado['result'];
				} else if(archivoCargado['type'].indexOf('/pdf') > -1) {
					icono = iconos[2];
				} else if(archivoCargado['type'].indexOf('audio/') > -1) {
					icono = iconos[0];
				} else if(archivoCargado['type'].indexOf('text/plain') > -1) {
					icono = iconos[4];
				} else if(archivoCargado['type'].indexOf('video') > -1) {
					icono = iconos[1];
				} else if(archivoCargado['type'].indexOf('/zip') > -1) {
					icono = iconos[3];
				} else {
					icono = iconos[5];
				}

				/* Se crea una capa para mostrar contenido en la zona general de la cola de subida. */
				/* Contenedor global de elemento archivo, que tendrá el icono, nombre, contenido central y 
				papelera de borrado. TODO lo inherente al elemento archivo. */
				cadenaDeFicheroParaMostrar += '<div id="contenedor_' + archivoCargado['elements_id'] + '" style="position:relative; border:1px solid black; ';
				cadenaDeFicheroParaMostrar += 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; padding:6px; ';
				cadenaDeFicheroParaMostrar += 'margin:4px auto; width:98%; min-height:112px; display:flex; ';
				cadenaDeFicheroParaMostrar += 'flex-wrap: nowrap; justify-content:space-between;">';
				/* Contenedor izquierdo que, a su vez, alberga el contenedor del icono y el del nombre del archivo. */
				cadenaDeFicheroParaMostrar += '<div style="border:none; min-height: 100px; min-width:80px; display:flex; ';
				cadenaDeFicheroParaMostrar += 'flex-direction: column; justify-content:space-between;">';
				/* Contenedor del icono */
				cadenaDeFicheroParaMostrar += '<div style="border:none; height: 80px; padding: 2px; align-items: center; display:flex;">';
				/* El propio icono */
				cadenaDeFicheroParaMostrar += '<img src="' + icono + '" alt="" style="max-width:90%; max-height:90%; margin: 0 auto;" ';
				cadenaDeFicheroParaMostrar += 'id="imagen_' + archivoCargado['elements_id'] + '">';
				cadenaDeFicheroParaMostrar += '</div>'; /* Fin del contenedor del icono */
				/* Contenedor del nombre del archivo */
				cadenaDeFicheroParaMostrar += '<div style="border:none; align-items: center; padding: 2px; align-items: center; display:flex; text-align: center;">';
				cadenaDeFicheroParaMostrar += archivoCargado['name'];
				cadenaDeFicheroParaMostrar += '</div>'; /* Fin del contenedor del nombre del archivo */
				cadenaDeFicheroParaMostrar += '</div>'; /* Fin del contenedor de icono y nombre del archivo */
				/* Contenedor central para HTML complementario, si es el caso. */
				cadenaDeFicheroParaMostrar += '<div style="border:none; min-height: 100px; padding: 4px; flex-grow: 1; align-items: flex-start; display:flex; flex-wrap: wrap; max-width:70%">';
				/* HTML COMPLEMENTARIO */
				for (var i in objetoPrincipal.opciones['campos_complementarios']){
					cadenaDeFicheroParaMostrar += '<div style="border:none; width:100%; font-size: 14px;">';
					cadenaDeFicheroParaMostrar += '<label for="campo_'+ i + '_' + archivoCargado['elements_id'] + '" style="font-weight:bold;">';
					cadenaDeFicheroParaMostrar += objetoPrincipal.opciones['campos_complementarios'][i][0] + '</label>';
					cadenaDeFicheroParaMostrar += '<input type="' + objetoPrincipal.opciones['campos_complementarios'][i][1] + '" ';
					cadenaDeFicheroParaMostrar += 'id="'+ objetoPrincipal.opciones['campos_complementarios'][i][2] + '_' + archivoCargado['elements_id'] + '" ';
					cadenaDeFicheroParaMostrar += 'class="form-control campo_complementario" ';
					if (objetoPrincipal.opciones['campos_complementarios'][i][3] != undefined) cadenaDeFicheroParaMostrar += objetoPrincipal.opciones['campos_complementarios'][i][3];
					cadenaDeFicheroParaMostrar += '	>';
					cadenaDeFicheroParaMostrar += '</div>';
				}
				cadenaDeFicheroParaMostrar += '</div>';/* Fin del contenedor central para HTML complementario. */
				/* Contenedor para la papelera de borrado. */
				cadenaDeFicheroParaMostrar += '<div style="border:none; min-height: 100px; padding: 2px; width:40px; align-items: center; display:flex;">';
				/* La papelera de borrado */
				cadenaDeFicheroParaMostrar += '<span class="fa fa-trash-o eliminar_fichero" style="border:none; margin: 0 auto; padding: 4px; ';
				cadenaDeFicheroParaMostrar += 'color: red; font-size: 2em; cursor:pointer;" id="borrar_' + archivoCargado['elements_id'] + '"></span>';
				cadenaDeFicheroParaMostrar += '</div>'; /* Fin del contenedor de la papelera de borrado. */
				cadenaDeFicheroParaMostrar += '</div>'; /* Fin del contenedor global del elemento archivo. */
				/* Se crea el icono que se mostrará. */
				var archivo = $(cadenaDeFicheroParaMostrar);
				contenedorDeFicheros.html(contenedorDeFicheros.html() + cadenaDeFicheroParaMostrar);
			}
			/*******************************************************************************************************************************************
			****		FIN DE LA FUNCIÓN QUE RENDERIZA LA VISUALIZACIÓN DE LOS ARCHIVOS PARA INCLUIRLA EN LA ZONA CENTRAL.							****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************
			****		FUNCIÓN QUE ENVIA LOS ARCHIVOS QUE HAY EN LA COLA DE SUBIDA AL SERVIDOR.													****
			*******************************************************************************************************************************************/
			$.fn.enviarArchivosAlServidor = function() {
				/* Se comprueba que el número de archivos esté entre el mínimo y el máximo. */
				if (objetoPrincipal.matrizDeArchivosEnviables.length < objetoPrincipal.opciones.minimo_numero_de_archivos){
					$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorDeNumeroDeArchivosInsuficiente);
					return;
				} else if (objetoPrincipal.opciones.maximo_numero_de_archivos != 0 && objetoPrincipal.matrizDeArchivosEnviables.length > objetoPrincipal.opciones.minimo_numero_de_archivos){
					$(objetoPrincipal).mostrarPieDePlugin(pieDeContenedorDeNumeroDeArchivosExcesivo);
					return;
				}

				var cadenaDeDatos = '[[';
				$(objetoPrincipal.matrizDeArchivosEnviables).each(function (i){
					var id_fichero = objetoPrincipal.matrizDeArchivosEnviables[i]['elements_id'];
					cadenaDeDatos += '{"name":"' + objetoPrincipal.matrizDeArchivosEnviables[i]['name'] + '",';
					cadenaDeDatos += '"type":"' + objetoPrincipal.matrizDeArchivosEnviables[i]['type'] + '",';
					cadenaDeDatos += '"size":"' + objetoPrincipal.matrizDeArchivosEnviables[i]['size'] + '",';
					cadenaDeDatos += '"randomKey":"' + objetoPrincipal.matrizDeArchivosEnviables[i]['elements_id'] + '",';
					cadenaDeDatos += '"file":"' + objetoPrincipal.matrizDeArchivosEnviables[i]['result'] + '",';
					$(objetoPrincipal.opciones.campos_complementarios).each(function (){
						var nombre_campo = $(this)[2] + "_" + id_fichero;
						var valor_campo = $('#' + nombre_campo).prop('value');
						cadenaDeDatos += '"' + $(this)[2] + '":"' + valor_campo + '",';
					});
					cadenaDeDatos = cadenaDeDatos.substr(0, cadenaDeDatos.length - 1);
					cadenaDeDatos += '},';
				});
				cadenaDeDatos = cadenaDeDatos.substr(0, cadenaDeDatos.length - 1);
				cadenaDeDatos += ']';

				var cadenaCamposPagina = '';
				$(objetoPrincipal.opciones.campos_procedentes_de_la_pagina).each(function (i){
					if ($('#' + objetoPrincipal.opciones.campos_procedentes_de_la_pagina[i]).prop('value') != undefined) {
						cadenaCamposPagina += '"' + objetoPrincipal.opciones.campos_procedentes_de_la_pagina[i] + '":"';
						cadenaCamposPagina += $('#' + objetoPrincipal.opciones.campos_procedentes_de_la_pagina[i]).prop('value') + '",';
					}
				});
				if (cadenaCamposPagina > ''){
					cadenaCamposPagina = cadenaCamposPagina.substr(0, cadenaCamposPagina.length - 1);
					cadenaCamposPagina = ',{' + cadenaCamposPagina + '}';
				}
				cadenaDeDatos += cadenaCamposPagina + ']';

				/* Se envia el paquete de datos por ajax. */
				$.ajax({
					url: objetoPrincipal.opciones.url_destino,
					type: 'POST', // Siempre que se envíen ficheros, por POST, no por GET.var_para_envio_de_datos
					data: {
						cadenaDeDatos:cadenaDeDatos
					}, 
					success: function(resultados){ // En caso de que todo salga bien.
						matrizResultados = JSON.parse(resultados);
						hecho = matrizResultados.procesado;
						if (hecho == "S"){
							$('#' + id_MEC).modal('show');
							$('#' + id_MEC).on('hidden.bs.modal', function(){
								if (objetoPrincipal.opciones.accion_de_subida_correcta == 'C'){ // Se limpia el subidor
									// La ejecución del un callback está prevista para el futuro.
									// De momento, minificado no la ejecuta, por lo que no se incluye.
									// if (objetoPrincipal.opciones.funcion_callback > '') eval(objetoPrincipal.opciones.funcion_callback);
									$('#zonaDeCancelarSubida').click();
								} else if (objetoPrincipal.opciones.accion_de_subida_correcta == 'R') { // Se recarga la página
									location.href = location.href;
								}
							});
						} else {
							$('#' + id_MEF).modal('show');
						}
					},
					error: function (){ // Si hay algún error.
						alert("Algo ha fallado.");
					}
				});
			}
			/*******************************************************************************************************************************************
			****		FINAL DE LA FUNCIÓN QUE ENVIA LOS ARCHIVOS QUE HAY EN LA COLA DE SUBIDA AL SERVIDOR.										****
			*******************************************************************************************************************************************/

			/*******************************************************************************************************************************************************
			**** DEFINICIÓN DE MODALES																															****
			********************************************************************************************************************************************************/
			var prefijoDeModales = $(objetoPrincipal).randomString();
			var id_MEC = prefijoDeModales + '_modalDeEnvioCorrecto';
			var MEC = '<div class="modal fade" tabindex="-1" role="dialog" id="' + id_MEC + '"><!-- Envoltura global del modal -->';
			MEC += '<div class="modal-dialog" role="document"><!-- Contenedor general modal-dialog -->';
			MEC += '<div class="modal-content"><!-- Zona global de los contenidos del modal -->';
			MEC += '<div class="modal-header"><!-- Cabecera del modal -->';
			MEC += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
			MEC += '<h4 class="modal-title">' + objetoPrincipal.opciones["i18n"]["rotuloTituloDeModalArchivosTransferidos"] + '</h4>';
			MEC += '</div><!-- Final de cabecera del modal -->';
			MEC += '<div class="modal-body"><!-- Zona principal de contenidos del modal -->';
			MEC += '<p>' + objetoPrincipal.opciones["i18n"]["rotuloDeModalArchivosTransferidos"] + '</p>';
			MEC += '</div><!-- Final de zona principal de contenidos del modal -->';
			MEC += '<div class="modal-footer"><!-- Zona al pie de la ventana modal -->';
			MEC += '<button type="button" class="btn btn-success" data-dismiss="modal" id="' + prefijoDeModales + '_Close">' + objetoPrincipal.opciones["i18n"]["rotuloDeBotonDeCierreDeModal"] + '</button>';
			MEC += '</div><!-- Final de zona al pie de la ventana modal -->';
			MEC += '</div><!-- Final de zona global de los contenidos del modal -->';
			MEC += '</div><!-- Cierre del contenedor general modal-dialog -->';
			MEC += '</div><!-- Cierre de la envoltura global del modal -->';
			var modalDeEnvioCorrecto = $(MEC);
			modalDeEnvioCorrecto.appendTo('body');

			var id_MEF = prefijoDeModales + '_modalDeEnvioFallido';
			var MEF = '<div class="modal fade" tabindex="-1" role="dialog" id="' + id_MEF + '"><!-- Envoltura global del modal -->';
			MEF += '<div class="modal-dialog" role="document"><!-- Contenedor general modal-dialog -->';
			MEF += '<div class="modal-content"><!-- Zona global de los contenidos del modal -->';
			MEF += '<div class="modal-header"><!-- Cabecera del modal -->';
			MEF += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
			MEF += '<h4 class="modal-title">' + objetoPrincipal.opciones["i18n"]["rotuloTituloDeModalArchivosNoTransferidos"] + '</h4>';
			MEF += '</div><!-- Final de cabecera del modal -->';
			MEF += '<div class="modal-body"><!-- Zona principal de contenidos del modal -->';
			MEF += '<p>' + objetoPrincipal.opciones["i18n"]["rotuloDeModalArchivosNoTransferidos"] + '</p>';
			MEF += '</div><!-- Final de zona principal de contenidos del modal -->';
			MEF += '<div class="modal-footer"><!-- Zona al pie de la ventana modal -->';
			MEF += '<button type="button" class="btn btn-danger" data-dismiss="modal">' + objetoPrincipal.opciones["i18n"]["rotuloDeBotonDeCierreDeModal"] + '</button>';
			MEF += '</div><!-- Final de zona al pie de la ventana modal -->';
			MEF += '</div><!-- Final de zona global de los contenidos del modal -->';
			MEF += '</div><!-- Cierre del contenedor general modal-dialog -->';
			MEF += '</div><!-- Cierre de la envoltura global del modal -->';
			var modalDeEnvioFallido = $(MEF);
			modalDeEnvioFallido.appendTo('body');
			/*******************************************************************************************************************************************************
			**** FIN DE DEFINICIÓN DE MODALES																													****
			********************************************************************************************************************************************************/

		});
		return this; // Se devuelve el objeto creado para integrar en el documento.
	}
}(jQuery));
