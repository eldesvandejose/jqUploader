<?php
	/* Conexion con base de datos. */
	$conexion = new PDO('mysql:host=localhost;dbname=base_de_datos;charset=UTF8', 'root', '');
	$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Incluimos la clase RecoveryClass
	include_once 'jqUploader/php/RecoveryClass.php';

	// Creamos un objeto de la clase RecoveryClass
	$objetoDeArchivos = new RecoveryClass($_POST["cadenaDeDatos"]);

	// Recuperamos las tres matrices que han llegado por POST
	$matrizDeArchivos = $objetoDeArchivos->getArchivos();
	$matrizDeComplementarios = $objetoDeArchivos->getComplementarios();
	$matrizDeDatosDePagina = $objetoDeArchivos->getCamposDePagina();

	$fallo = false; // indicador de si ha habido fallo

	/*Grabamos los dos campos de la página en un registro de una tabla llamada fichas. 
	Leemos el id de la inserción, para luego asociar las notas de todos los archivos a este envío. */
	try {
		$consulta = "INSERT INTO fichas (";
		$consulta .= "campo_1, ";
		$consulta .= "campo_2, ";
		$consulta .= "..., "; // Los campos que necesitemos, según nuestra estructura de datos.
		$consulta .= "campo_n";
		$consulta .= ") VALUES (";
		$consulta .= "'".$matrizDeDatosDePagina['valor_1']."', ";
		$consulta .= "'".$matrizDeDatosDePagina['valor_1']."', ";
		$consulta .= "'".$matrizDeDatosDePagina['...']."', ";
		$consulta .= "'".$matrizDeDatosDePagina['valor_n']."'";
		$consulta .= ");";
		$conexion->query($consulta);
		$reg_insertado = $conexion->lastInsertId();
	} catch (Exception $e){
		$fallo = true;
	}

	if (!$fallo) { // Si, hasta ahora, todo va bien
		foreach ($matrizDeArchivos as $keyFile=>$file){
			/* Tratamos de grabar el archivo en curso en el disco, en la ruta actual, y con el nombre almacenado en nameToSave */
			try {
				$objetoDeArchivos->saveFile($keyFile, '', '');
			} catch (Exception $e){
				$fallo = true;
				break;
			}

			// Si no se ha producido excepción, grabamos el campo notas del archivo en curso en la base de datos.
			try {
				$consulta = "INSERT INTO notas (";
				$consulta .= "ficha, ";
				$consulta .= "archivo_correspondiente, ";
				$consulta .= "notas";
				$consulta .= ") VALUES (";
				$consulta .= $reg_insertado;
				$consulta .= "'".$file['randomKey']."', ";
				$consulta .= "'".$matrizDeComplementarios[$file['randomKey']]['notas']."'";
				$consulta .= ");";
				$conexion->query($consulta);
			} catch (Exception $e){
				$fallo = true;
				break;
			}
		}
	}

	$resultado = ($fallo)?"N":"S";

	echo $resultado;
?>
