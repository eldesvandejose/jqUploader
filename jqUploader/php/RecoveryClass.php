<?php
	class RecoveryClass {
		private $matrizDeRecibidos = array();
		private $matrizDeArchivos = array();
		private $matrizDeComplementarios = array();
		private $matrizDeCamposDePagina = array();
		/* A continuación se declaran los datos que necesitamos de la base de datos a emplear, 
		para poder grabar los datos de los archivos enviados en las correspondientes tablas. 
		Es decir. Esta clase no sólo graba los archivos en el directorio que se especifique en el disco 
		del servidor, sino también los datos de cada archivo, los datos complementarios de cada archivo 
		y los datos generales de la página en la base de datos que los necesitemos. */
		private $conexion;
		private $tablaDeArchivos = array();
		private $tablaDeDatosComplementarios = array();
		private $tablaDeDatosDeLaPagina = array();
		/* Variable para detección de errores */
		private $falloEnElProceso = false;
		private $tablaDeArchivosCorrecta = false;

		/* El constructor de la clase lleva a cabo cinco tareas al crear un objeto. 
		Cuando se recibe un objeto usando el plugin jqUploader, este consta, básicamente, 
		de dos matrices. La primera contiene los archivos enviados, con los datos de cada archivo 
		(nombre, tipo, peso y el propio archivo codificado en base 64), y los campos complementarios 
		de dicho archivo que se definieran en la implementación del plugin.
		La segunda matriz contiene los campos de la página que se definieron en la implementación del 
		plugin, que no pertenecen a un fichero específico, pero que deben procesarse con la 
		página porque forman parte de un todo, es decir, que desde el punto de vista del usuario, 
		están relacionados con el grupo de los ficheros enviados, y debemos procesarlos para la 
		base de datos.

		Las tareas que lleva a cabo el constructor son:
			1.-	Alojar todo el paquete de datos recibidos en el objeto que se está creando. 
				Para ello se usa una matriz del objeto, llamada matrizDeRecibidoa, que tendrá 
				dos elementos básicos (uno por cada elemento recibido -ficheros y datos de la página-, 
				según se detalla más arriba).
			2.- A partir de esta matriz, se crea una matriz del objeto, llamada matrizDeArchivos, 
				que contiene un elemento por cada archivo enviado. Cada elemento tiene los datos 
				name, type, size y file.
			3.- Se crea una matriz del objeto llamada matrizDeComplementarios, que contiene un elemento 
				por cada archivo enviado. Cada elemento contiene los campos complementarios que corresponden 
				a dicho archivo, tal como se definieron en la implementación del plugin. 
				DADO QUE ESTAS DOS TAREAS DE UNIFICAN EN UN SOLO RECORRIDO DE BUCLE DE LA MATRIZ DE ARCHIVOS RECIBIDOS, 
				LOS ELEMENTOS archivo SE RELACIONAN CON SUS ELEMENTOS campoComplementario MEDIANTE EL CAMPO randomKey. 
				ASI, LOS DATOS COMPLEMNTARIOS DEL ARCHIVO QUE TIENE EL ÍNDICE, DIGAMOS, 4, SON LOS QUE 
				QUEDAN GRABADOS BAJO LA CLAVE randomKey DE DICHO ARCHIVO.
			4.- Se crea una matriz del objeto, llamada matriz de campos de página, que tiene el contenido del segundo 
				elemento de la matriz de datos recibidos según se detalla arriba, es decir, los campos que no pertenecen a 
				un archivo específico, pero que forman un todo con los datos del usuario.
			5.-	Una vez organizadas las tres matrices del archivo, se elimina la matriz que originalmente recibió 
				los datos, para liberar recursos en el objeto.
			*/
		public function __construct($datosRecibidos){
			$this->matrizDeRecibidos = json_decode($datosRecibidos, true);
			/* Crear matrizDeArchivos */
			foreach($this->matrizDeRecibidos[0] as $keyArchivo=>$archivo){
				$corte = strrpos($archivo['name'], '.');
				$extension = substr($archivo['name'], $corte);
				$nameToSave = $archivo['randomKey'].$extension;
				$elementoArchivo = array(
					"name"=>$archivo["name"], 
					"type"=>$archivo["type"], 
					"size"=>$archivo["size"], 
					"randomKey"=>$archivo["randomKey"], 
					"nameToSave"=>$nameToSave, 
					"file"=>$archivo["file"]
				);
				$this->matrizDeArchivos[] = $elementoArchivo;
				unset ($elementoArchivo);
				unset ($archivo["name"]);
				unset ($archivo["type"]);
				unset ($archivo["size"]);
				unset ($archivo["file"]);

				if (count($archivo) > 1){ // Si queda algo más que el randomKey, hay campos complementarios
					$comp = array();
					foreach ($archivo as $keyDato=>$dato) if ($keyDato != "randomKey") $comp[$keyDato] = addslashes($dato);
					$this->matrizDeComplementarios[$archivo["randomKey"]] = $comp;
					unset($comp);
				}
			}
			$this->matrizDeCamposDePagina = $this->matrizDeRecibidos[1];
			foreach ($this->matrizDeCamposDePagina as $key=>$value) $this->matrizDeCamposDePagina[$key] = addslashes($value);
			unset ($this->matrizDeRecibidos);
		}

		/* Los siguientes métodos establacen la conexión a base de datos, 
		y las estructuras de las tablas correspondientes. */
		public function setConexion($conexion){
			$this->conexion = $conexion;
		}

		/* El siguiente método comprueba que la estructura de datos de archivos exista y sea correcta. 
		Si no lo es, da un fallo y se aborta el proceso. */
		public function setTablaDeArchivos($tablaDeArchivos){
			if ($this->falloEnElProceso) return $this->falloEnElProceso;

			$this->tablaDeArchivos = $tablaDeArchivos;
			$consulta = "SHOW COLUMNS FROM ".$this->tablaDeArchivos["nombreDeTabla"].";";
			try{
				$hacerConsulta = $this->conexion->query($consulta);
				$camposEncontrados = $hacerConsulta->fetchAll(PDO::FETCH_ASSOC);
				$hacerConsulta->closeCursor();
			} catch (Exception $e) {
				$this->falloEnElProceso = true;
			}

			if (!$this->falloEnElProceso) { // Si se ha podido leer la lista de campos de la tabla
				// Búsqueda de clave primaria
				$this->falloEnElProceso = true;
				foreach ($camposEncontrados as $keyCampo=>$campo){
					if ($campo["Field"] == $this->tablaDeArchivos["clavePrimaria"] 
						&& strpos($campo["Type"], "int") !== false 
						&& $campo["Key"] == "PRI" 
						&& strpos($campo["Extra"], "auto_increment") !== false){
							$this->falloEnElProceso = false;
							break;
					}
				} // Fin de búsqueda del campo identificativo de registro (clave primaria)

				// Búsqueda de campo del id de envío al que pertenecen los archivos
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto, se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeArchivos["campoDeIdDeEnvio"] 
							&& strpos($campo["Type"], "int") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del id de envío al que pertenecen los archivos
				}

				// Búsqueda de campo nombre que se le asignará al archivo en el disco
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto, se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeArchivos["campoDeNombreDeArchivo"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del nombre con el que será grabado el archivo
				}

				/* A continuación se comprueban los tres campos opcionales. Como son opcionales, pueden ser cadenas vacías, 
				pero si se han declarado, deben existir en la estructura de la tabla */
				// Búsqueda de campo nombre que se le asignará al archivo en el disco
				if (!$this->falloEnElProceso && $this->tablaDeArchivos["campoDeNombreOriginalDeArchivo"] > ""){ // Si el campo anterior está correcto, y el campo del nombre original está declarado, se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeArchivos["campoDeNombreOriginalDeArchivo"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del nombre original que tenía el archivo
				}

				// Búsqueda de campo del tipo de archivo
				if (!$this->falloEnElProceso && $this->tablaDeArchivos["campoDeTipoDeArchivo"] > ""){ // Si el campo anterior está correcto, y el campo del tipo de archivo está declarado, se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeArchivos["campoDeTipoDeArchivo"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del tipo de archivo que tenía el archivo
				}

				// Búsqueda de campo del peso de archivo
				if (!$this->falloEnElProceso && $this->tablaDeArchivos["campoDePesoDeArchivo"] > ""){ // Si el campo anterior está correcto, y el campo del peso de archivo está declarado, se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeArchivos["campoDePesoDeArchivo"] 
							&& strpos($campo["Type"], "int") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del peso de archivo que tenía el archivo
				}

				/* Si la estructura básica es correcta, se indica que la tabla de archivos eviados existe, y 
				tiene, al menos, la estructura mínima imprescindible. Esto se hace porque esta tabla es 
				obligatoria. */
				$this->tablaDeArchivosCorrecta = (!$this->falloEnElProceso);

			} // Fin de comprobación de si se ha podido leer la lista de campos de la tabla.
		} // Ya hemos determianado si la tabla de archivos esiste en la BD y tiene, al menos, la estructura mínima necesaria.

		public function setTablaDeDatosComplementarios($tablaDeDatosComplementarios){
			if ($this->falloEnElProceso) return $this->falloEnElProceso;
			if (!$this->tablaDeArchivosCorrecta) return true;
			if (count($tablaDeDatosComplementarios) == 0) return false;

			$this->tablaDeDatosComplementarios = $tablaDeDatosComplementarios;
			$consulta = "SHOW COLUMNS FROM ".$this->tablaDeDatosComplementarios["nombreDeTabla"].";";
			try{
				$hacerConsulta = $this->conexion->query($consulta);
				$camposEncontrados = $hacerConsulta->fetchAll(PDO::FETCH_ASSOC);
				$hacerConsulta->closeCursor();
			} catch (Exception $e) {
				$this->falloEnElProceso = true;
			}

			if (!$this->falloEnElProceso) { // Si se ha podido leer la lista de cmpos complementarios de los archivos
				// Búsqueda de clave primaria
				$this->falloEnElProceso = true;
				foreach ($camposEncontrados as $keyCampo=>$campo){
					if ($campo["Field"] == $this->tablaDeDatosComplementarios["clavePrimaria"] 
						&& strpos($campo["Type"], "int") !== false 
						&& $campo["Key"] == "PRI" 
						&& strpos($campo["Extra"], "auto_increment") !== false){
							$this->falloEnElProceso = false;
							break;
					}
				} // Fin de búsqueda del campo identificativo de registro (clave primaria)

				// Búsqueda del id del archivo asociado a los archivos.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosComplementarios["campoDeIdDeArchivoAsociado"] 
							&& strpos($campo["Type"], "int") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del id del archivo asociado a los archivos.
				}

				// Búsqueda del campo para nombre de dato.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosComplementarios["campoDeNombreDeDato"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo nombre de dato.
				}

				// Búsqueda del campo para valor de dato.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosComplementarios["campoDeValorDeDato"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo valor de dato.
				}
			} // Fin de comprobación de si se ha podido leer la tabla de campos complenetarios de los archivos
		} // Final del método que recibe la tabla de datos complentarios de los archivos enviados.

		public function setTablaDeDatosDeLaPagina($tablaDeDatosDeLaPagina){
			if ($this->falloEnElProceso) return $this->falloEnElProceso;
			if (!$this->tablaDeArchivosCorrecta) return true;
			if (count($tablaDeDatosDeLaPagina) == 0) return false;

			$this->tablaDeDatosDeLaPagina = $tablaDeDatosDeLaPagina;
			$consulta = "SHOW COLUMNS FROM ".$this->tablaDeDatosDeLaPagina["nombreDeTabla"].";";
			try{
				$hacerConsulta = $this->conexion->query($consulta);
				$camposEncontrados = $hacerConsulta->fetchAll(PDO::FETCH_ASSOC);
				$hacerConsulta->closeCursor();
			} catch (Exception $e) {
				$this->falloEnElProceso = true;
			}

			if (!$this->falloEnElProceso) { // Si se ha podido leer la lista de campos globales al formulario
				// Búsqueda de clave primaria
				$this->falloEnElProceso = true;
				foreach ($camposEncontrados as $keyCampo=>$campo){
					if ($campo["Field"] == $this->tablaDeDatosDeLaPagina["clavePrimaria"] 
						&& strpos($campo["Type"], "int") !== false 
						&& $campo["Key"] == "PRI" 
						&& strpos($campo["Extra"], "auto_increment") !== false){
							$this->falloEnElProceso = false;
							break;
					}
				} // Fin de búsqueda del campo identificativo de registro (clave primaria)

				// Búsqueda del id del envío al que se asocian los archivos, y todos los datos del formulario.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosDeLaPagina["campoDeIdDeEnvio"] 
							&& strpos($campo["Type"], "int") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo del id del archivo asociado a los archivos.
				}

				// Búsqueda del campo para nombre de dato.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosDeLaPagina["campoDeNombreDeCampo"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo nombre de dato.
				}

				// Búsqueda del campo para valor de dato.
				if (!$this->falloEnElProceso){ // Si el campo anterior está correcto se sigue comprobando la estructura
					$this->falloEnElProceso = true;
					foreach ($camposEncontrados as $keyCampo=>$campo){
						if ($campo["Field"] == $this->tablaDeDatosDeLaPagina["campoDeValorDeCampo"] 
							&& strpos($campo["Type"], "char") !== false 
							&& $campo["Key"] == "MUL"){
								$this->falloEnElProceso = false;
								break;
						}
					} // Fin de búsqueda del campo valor de dato.
				}
			} // Fin de comprobación de si se ha podido leer la tabla de campos complenetarios de los archivos
		} // Final del método que recibe la tabla de otros campos complementarios de la página para todos los archivos.

		/* Los tres métodos siguientes nos permiten recuperar, desde el script llamante, 
		las matrices individuales (archivos, datos complementarios y campos de página) 
		por si necesitamos procesarlas programáticamente. */
		public function getArchivos(){
			return ($this->falloEnElProceso)?NULL:$this->matrizDeArchivos;
		}
		public function getComplementarios(){
			return ($this->falloEnElProceso)?NULL:$this->matrizDeComplementarios;
		}
		public function getCamposDePagina(){
			return ($this->falloEnElProceso)?NULL:$this->matrizDeCamposDePagina;
		}

		/* El siguiente método graba un fichero recibido en el disco. Recibe un parámetro:
			La ruta en la que se grabará el archivo. Si es una ruta relativa, se toma con relación al script que recibe el archivo y que
			incluye a esta clase, no con relación a la ruta donde está grabada esta clase. 
			Si se pasa una cadena vacía, se usa la ruta en la que se encuentra el script que recibe el archivo. 
			El nombre de la ruta NO debe terminar con un slash (/), ya que el método ya lo añade. */
		public function saveFiles($ruta = ''){
			if ($this->falloEnElProceso || !$this->tablaDeArchivosCorrecta) return true;

			if ($ruta == "") $ruta = "."; // Si la ruta es una cadena vacía se toma la de trabajo en curso.
			$ruta .= "/";

			/* Se empieza grabando los archivos en la ruta especificada */
			foreach ($this->matrizDeArchivos as $keyArchivo=>$archivo){
				$nombre = $ruta.$archivo["nameToSave"];
				$contenido = explode(",", $archivo["file"])[1];
				$grabado = file_put_contents($nombre, base64_decode($contenido));
				if ($grabado === false){
					$this->falloEnElProceso = true;
					break;
				}
			}

			/* Si no se han producido errores, grabamos los datos de los archivos, y campos complementarios de los mismos 
			en las correspondientes tablas. Para ello empezamos determinando el id de envio que le corresponde a todo el 
			paquete. */
			if ($this->falloEnElProceso) return $this->falloEnElProceso;
			$consulta = "SELECT MAX(".$this->tablaDeArchivos["campoDeIdDeEnvio"].") ";
			$consulta .= "FROM ";
			$consulta .= $this->tablaDeArchivos["nombreDeTabla"].";";
			try{
				$hacerConsulta = $this->conexion->query($consulta);
				$maxActual = $hacerConsulta->fetch(PDO::FETCH_ASSOC)["MAX(".$this->tablaDeArchivos["campoDeIdDeEnvio"].")"];
				$hacerConsulta->closeCursor();
				$identificadorDeEnvio = ($maxActual == NULL)?1:intval($maxActual) + 1;
			} catch (Exception $e) {
				$this->falloEnElProceso = true;
			}

			if ($this->falloEnElProceso) return $this->falloEnElProceso;
			foreach ($this->matrizDeArchivos as $keyArchivo=>$archivo){
				// Datos propios de los archivos en la correspondiente tabla
				$consulta = "INSERT INTO ".$this->tablaDeArchivos["nombreDeTabla"]." (";
				$consulta .= $this->tablaDeArchivos["campoDeIdDeEnvio"].", ";
				if ($this->tablaDeArchivos["campoDeNombreOriginalDeArchivo"] > "") $consulta .= $this->tablaDeArchivos["campoDeNombreOriginalDeArchivo"].", ";
				if ($this->tablaDeArchivos["campoDeTipoDeArchivo"] > "") $consulta .= $this->tablaDeArchivos["campoDeTipoDeArchivo"].", ";
				if ($this->tablaDeArchivos["campoDePesoDeArchivo"] > "") $consulta .= $this->tablaDeArchivos["campoDePesoDeArchivo"].", ";
				$consulta .= $this->tablaDeArchivos["campoDeNombreDeArchivo"];
				$consulta .= ") VALUES (";
				$consulta .= "'".$identificadorDeEnvio."', "; // id_de_envio
				if ($this->tablaDeArchivos["campoDeNombreOriginalDeArchivo"] > "") $consulta .= "'".$archivo["name"]."', "; // nombre_de_original
				if ($this->tablaDeArchivos["campoDeTipoDeArchivo"] > "") $consulta .= "'".$archivo["type"]."', "; // tipo
				if ($this->tablaDeArchivos["campoDePesoDeArchivo"] > "") $consulta .= "'".$archivo["size"]."', "; // peso
				$consulta .= "'".$archivo["nameToSave"]."'"; // nombre_de_archivo
				$consulta .= ");";
				try {
					$this->conexion->query($consulta);
					$idDeArchivoEnCurso = $this->conexion->lastInsertId();
				} catch (Exception $e){
					$this->falloEnElProceso = true;
					break;
				}

				// Datos complementarios de cada archivo en la correspondiente tabla.
				if (count($this->tablaDeDatosComplementarios) != 0){
					foreach ($this->matrizDeComplementarios[$archivo["randomKey"]] as $keyDC=>$DC) { // Dato Complementario
						$consulta = "INSERT INTO ".$this->tablaDeDatosComplementarios["nombreDeTabla"]." (";
						$consulta .= $this->tablaDeDatosComplementarios["campoDeIdDeArchivoAsociado"].", ";
						$consulta .= $this->tablaDeDatosComplementarios["campoDeNombreDeDato"].", ";
						$consulta .= $this->tablaDeDatosComplementarios["campoDeValorDeDato"];
						$consulta .= ") VALUES (";
						$consulta .= "'".$idDeArchivoEnCurso."', "; // archivo_asociado
						$consulta .= "'".$keyDC."', "; // nombre_de_dato
						$consulta .= "'".$DC."'"; // valor_de_dato
						$consulta .= ");";
						try{
							$this->conexion->query($consulta);
						} catch (Exception $e) {
							$this->falloEnElProceso = true;
							break;
						}
					}
				}
			} // Final del recorrido de los archivos y, en su caso, de los datos complementarios.

			if ($this->falloEnElProceso) return $this->falloEnElProceso;
			// Campos complementarios del formulario en el que se ha integrado el plugin.
			if (count($this->tablaDeDatosDeLaPagina) != 0){ // Si hay campos propios del formulario
				foreach ($this->matrizDeCamposDePagina as $keyDP=>$DP){ // Dato de la Pagina
					$consulta = "INSERT INTO ".$this->tablaDeDatosDeLaPagina["nombreDeTabla"]." (";
					$consulta .= $this->tablaDeDatosDeLaPagina["campoDeIdDeEnvio"].", ";
					$consulta .= $this->tablaDeDatosDeLaPagina["campoDeNombreDeCampo"].", ";
					$consulta .= $this->tablaDeDatosDeLaPagina["campoDeValorDeCampo"]."";
					$consulta .= ") VALUES (";
					$consulta .= "'".$identificadorDeEnvio."', "; // id_de_envio
					$consulta .= "'".$keyDP."', "; // nombre_de_campo
					$consulta .= "'".$DP."'"; // valor_de_campo
					$consulta .= ");";
					try{
						$this->conexion->query($consulta);
					} catch (Exception $e) {
						$this->falloEnElProceso = true;
						break;
					}
				}
			} // Final de grabación de campos complementarios del formulario
			return $this->falloEnElProceso;
		} // Final del método saveFiles();
	} // Final de la clase
?>
