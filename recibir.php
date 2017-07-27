<?php
	/* Conexion con base de datos. */
	$conexion = new PDO('mysql:host=localhost;dbname=jquploader;charset=UTF8', 'root', '');
	$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Incluimos la clase RecoveryClass
	include_once 'jqUploader/php/RecoveryClass.php';

	// Creamos un objeto de la clase RecoveryClass
	$objetoDeArchivos = new RecoveryClass($_POST["cadenaDeDatos"]);

	/* Definimos la conexión a base de datos (pasándole la que hemos creado en este script), 
	y las estructuras de las tablas. La tabla de archivos es obligatoria. Las otras dos 
	pueden usarse o no, dependiendo del diseño y necesidades del formulario donde incorporamos 
	el plugin. */
	$objetoDeArchivos->setConexion($conexion);
	$objetoDeArchivos->setTablaDeArchivos(array(
		"nombreDeTabla"=>"archivos_enviados", 
		"clavePrimaria"=>"id", 
		"campoDeIdDeEnvio"=>"id_de_envio", 
		"campoDeNombreDeArchivo"=>"nombre_de_archivo", 
		"campoDeNombreOriginalDeArchivo"=>"nombre_de_original", // Este campo es opcional. Si no lo quieres, pon una cadena vacía "".
		"campoDeTipoDeArchivo"=>"tipo", // Este campo es opcional. Si no lo quieres, pon una cadena vacía "".
		"campoDePesoDeArchivo"=>"peso" // Este campo es opcional. Si no lo quieres, pon una cadena vacía "".
	));

	/* El siguiente método es opcional. Si en tu formulario no defines 
	campos complementarios para los archivos subidos con el plugin, 
	no uses este método. */
	$objetoDeArchivos->setTablaDeDatosComplementarios(array(
		"nombreDeTabla"=>"campos_de_archivos", 
		"clavePrimaria"=>"id", 
		"campoDeIdDeArchivoAsociado"=>"archivo_asociado", 
		"campoDeNombreDeDato"=>"nombre_de_dato", 
		"campoDeValorDeDato"=>"valor_de_dato"
	));

	/* El siguiente método es opcional. Si en tu página no hay campos asociados al 
	plugin, no emplees este método. */
	$objetoDeArchivos->setTablaDeDatosDeLaPagina(array(
		"nombreDeTabla"=>"otros_campos", 
		"clavePrimaria"=>"id", 
		"campoDeIdDeEnvio"=>"id_de_envio", 
		"campoDeNombreDeCampo"=>"nombre_de_campo", 
		"campoDeValorDeCampo"=>"valor_de_campo"
	));

	/* Recuperamos las tres matrices que han llegado por POST. 
	Esto sólo necesitamos hacerlo si queremos usarlas en otro proceso 
	personalizado adicional. Si sólo queremos grabar los archivos enviados 
	y sus datos adicionales usando la clase RecoveryClass, no los 
	necesitaremos. */
	$matrizDeArchivos = $objetoDeArchivos->getArchivos();
	$matrizDeComplementarios = $objetoDeArchivos->getComplementarios();
	$matrizDeDatosDePagina = $objetoDeArchivos->getCamposDePagina();

	$fallo = $objetoDeArchivos->saveFiles('ficheros_enviados'); // indicador de si ha habido fallo
	$resultado = array("procesado"=>($fallo)?"N":"S");
	$resultado = json_encode($resultado);

	echo $resultado;
?>
