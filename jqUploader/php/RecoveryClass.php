<?php
	class RecoveryClass {
		private $matrizDeRecibidos = array();
		private $matrizDeArchivos = array();
		private $matrizDeComplementarios = array();
		private $matrizDeCamposDePagina = array();

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

		/* Los tres métodos siguientes nos permiten recuperar, desde el script llamante, 
		las matrices individuales (archivos, datos complementarios y campos de página) 
		por si necesitamos procesarlas programáticamente. */
		public function getArchivos(){
			return $this->matrizDeArchivos;
		}
		public function getComplementarios(){
			return $this->matrizDeComplementarios;
		}
		public function getCamposDePagina(){
			return $this->matrizDeCamposDePagina;
		}

		/* El siguiente método es privado para no ser accesible desde el objeto. 
		Es usado por el método saveFile para indentificar un archivo de la matriz 
		cuando el primer parámentro de la llamada a saveFile es un nombre, en lugar del 
		índice numérico. */
		private function buscarPorNombre($nombre){
			$clave = "";
			foreach ($this->matrizDeArchivos as $key=>$value){
				if ($value["name"] == $nombre){
					$clave = $key;
					break;
				}
			}
			if ($clave == ""){
				throw new Exception("Elemento no encontrado");
			} else {
				return $clave;
			}
		}

		/* El siguiente método graba un fichero recibido en el disco. Recibe tres parámetros:
			1.-	El índice para decidir sobre que fichero se va a actuar. Este puede ser el índice numérico de la matriz 
				(lo más fácil) o el valor de name con el que se envió el archivo.
			2.-	La ruta en la que se grabará el archivo. Si es una ruta relativa, se toma con relación al script que recibe el archivo y que
				incluye a esta clase, no con relación a la ruta donde está grabada esta clase. 
				Si se pasa una cadena vacía, se usa la ruta en la que se encuentra el script que recibe el archivo. 
				Si se pasa una ruta se debe terminar, IMPRESCINDIBLEMENTE, con un slash (/). 
			3.-	El nombre con el que se envió el archivo. Si se especifica como una cadena vacía, se grabará en el disco 
				con el valor de randomKey del propio archivo, al que se le unirá la extensión obtenida del nombre. */
		public function saveFile($item, $ruta, $nombre=''){ 
			$modo = "i"; // buscar por indice
			$item .= "";
			for($i = 0; $i < strlen($item); $i ++) if ($item[$i] < '0' || $item[$i] > '9') $modo = "n";

			if ($modo == "i"){
				$item = intval($item);
				if (!array_key_exists($item, $this->matrizDeArchivos)){
					throw new Exception("Elemento no encontrado");
				} else {
					$archivo = $this->matrizDeArchivos[$item];
				}
			} else {
				$clave = $this->buscarPorNombre($item);
				$archivo = $this->matrizDeArchivos[$clave];
			}

			if ($nombre == ''){
				$nombre = $archivo['nameToSave'];
			} else {
				$corte = strrpos($archivo['name'], '.');
				$extension = substr($archivo['name'], $corte);
				$nombre .= $extension;
			}
			$nombre = $ruta.$nombre;
			$contenido = explode(",", $archivo["file"])[1];
			file_put_contents($nombre, base64_decode($contenido));
		}
	}
?>
