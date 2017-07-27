# ¿Qué es jqUploader?

Recientemente estuve buscando un plugin de jQuery para insertarlo en mi web que me permitiera la subida de archivos al servidor, de una forma eficiente, flexible, y con una serie de prestaciones que necesitaba cubrir. Y, preferiblemente, gratuito y de código abierto.

Encontré una gran variedad. Para ser sincero, tantos que probarlos y analizarlos se convirtió en una tediosa tarea que me llevó varios días a jornada completa. Sin embargo, lo más frustrante fue el resultado: ninguno me ofrecía todo lo que yo necesitaba; el que no le faltaba una cosa, le faltaba otra. Además, aunque (en teoría) son de código abierto, los autores ya se habían encargado de que modificar alguna funcionalidad fuera tarea titánica. Bien por estar disponible sólo la versión minificada, o por ser otros códigos escritos de forma desestructurada o desorganizada, el caso es que adaptarlos resultaba poco menos que inviable.

## La solución

Cómo no podía ser de otro modo, la solución obvia era crear mi propio plugin. Si no encontraba el que necesitaba, me lo haría yo mismo. Tras definir las funcionalidades y usos que quería darle, y no pocas horas, aquí está. jqUploader es un plugin basado en jQuery y bootstrap para enviar múltiples archivos al servidor, con todas las características que yo necesitaba (y, espero, con todas las que tú necesitas).

## Carácterísticas

- Es altamente configurable, en cuanto a anchura y altura de la zona de subida de ficheros, colores, etc.
- Permite determinar qué tipos de archivos se podrán enviar.
- Permite establecer el peso máximo de cada archivo individual, y del conjunto total de archivos que se enviarán.
- Permite una previsualización en miniatura de las imágenes que se enviarán, si se ha configurado para admitir imágenes. Para otros tipos de archivos muestra unos iconos específicos.
- Permite que el propio plugin ofrezca al usuario un botón de subida de archivos, o que se use un botón, enlace u otro elemento de la página.
- Permite agregar archivos a la cola de subida mediante un botón específico, o mediante drag and drop sobre la zona de previsualización de los archivos.
- Una vez preparada una cola de archivos para subir, permite eliminar algunos individualmente antes del envío, o limpiar toda la cola de archivos.
- Permite añadir campos adicionales en la configuración, de modo que, junto a cada archivo, se mostrarán tales campos, y sus contenidos irán asociados a los archivos.
- Permite asociar al paquete de archivos otros campos de la página, de modo que, al hacer el envío, se manden todos los contenidos en un solo paquete.
- Incorpora una herramienta específica de PHP que permite gestionar los archivos enviados, los campos complementarios de cada uno, y los campos adicionales de la página, para grabar los archivos enviados en el servidor, y los datos en una base de datos, de forma cómoda y eficaz.
- Mensajes en múltiples idiomas. La versión actual (1.0) sólo incorpora inglés de Estados Unidos y español de España, pero, en breve, se añadirán otros idiomas.

Para saber más, visita https://jquploader/misitioenlared.es
