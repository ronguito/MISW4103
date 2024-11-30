# Estrategia Pruebas para el Aplicativo Ghost

Este proyecto implementa las estrategias de pruebas de para el aplicativo Ghost, donde se incluyen,
pruebas exploratoria manuales, pruebas exploratorias automatizadas, pruebas e2e, pruebas de regresion visual y prebas de validacion de datos.
Para las pruebas automatizadas se utiliza Cypress como herramientas de automatizacion que permiten asegurar la calidad y estabilidad de la aplicación mediante la automatización de escenarios de prueba que simulan interacciones de usuarios reales

## Herramientas utilizadas

Cypress: Framework de pruebas E2E que permite escribir y ejecutar pruebas en tiempo real
en un entorno de navegador. Cypress facilita la automatización de pruebas para verificar
el comportamiento de la interfaz de usuario.

## Prerequisitos

- Contar con una instalacion de Ghost de manera local.
- Haber configurado manualmente una cuenta en ghost

## Instalación de las pruebas

Para instalar las pruebas en la maquina local, puede clonar este repositorio o descargar el release del mismo a un folder de su maquina local, una vez descomprimido o clonado proceda de la siguiente manera.

- Para instalar todas las dependencias ejecute en la consola de comandos desde la raiz del proyecto:

```bash
npm install
```

- Despues de instalar las dependencias instale Cypress de manera global

```bash
npm install -g cypress
```

## Ejecución de Pruebas

- Configuracion.

Para el correcto funcionamiento de la prubas se debe modificar el archivo de configuracion properties.json, ubicado en la raiz del proyecto, alli podra configurar el Usuario, la contraseña y las Url
necesarias para algunas de las pruebas. Realice los ajustes necesarios de acuerdo la instalacion que haya realizado del sitema Ghost

properties.json

```bash
{
    "UserName": "admin@redfox.com.co",
    "UserPass": "Admin123++",
    "Host": "http://localhost",
    "Port": 2345,
    "UrlPublic" : "",
    "UrlLogin": "/ghost/#/signin",
    "UrlPost": "/ghost/#/posts",
    "UrlTag": "/ghost/#/tags",
    "UrlPage": "/ghost/#/pages",
    "UrlMember": "/ghost/#/members",
    "Results": "./results",
    "Vrt": "",
    "Iterations", 50
}

```

Vrt: se usa para seleccionar el modo de comparacion para los test de regresion visual, si desea que se realice por nombre de navegador dejar vacio este campo, si desea que se realice por la version del sistema Ghost digite el valor "port" a la variable Vrt. La versiones diferentes se deben ejecutar en puertos diferentes.

Iterations: Es el numero de iteraciones que se realizaran en las pruebas exploratorias automatizadas.

- Ejecucion

Para las diferentes pruebas se codificaron los siguientes escripst de cypress.

1. s1-t1-aet.cy.js -> Pruebas exploratorias
2. s1-t2-e2e.cy.js -> Pruebas de extremo a extremo
3. s1-t3-vrt.cy.js -> Pruebas de regresion visual
4. s1-t4-dvt.cy.js -> Pruebas de validacion de datos

Las pruebas se puede ejecutar de dos modos diferentes, el modo interactivo y el modo headless, si ejecuta las pruebas en modo interactivo debe seleccionar el script que desea ejecutar en la ventana de la herramienta de pruebas.
Si ejecuta la prueba en modo headless esta corre todos los scripts configurados.

```bash
//Ejecutar las pruebas en modo interactivo con
cypress open

//Ejecutar las pruebas en modo headless con
cypress run.
```

## Ejecución test de regresion visual

El test de regresion visual se puede realizar de dos forma, ya sea por navegador, o por la version de la aplicacion.

Si desea hacer la prueba por el navegador deje vacio la variable "Vrt" del archivo de configuracion properties. Luego ejecute el test en modo interactivo, realice la prueba en el primer navegador y cuando termine realice la prueba en el segundo navegador.

Si desea hacer la prueba por version, modifique el valor de la variable "Vrt" en el archivo de configuracion y escriba "port". Asi mismo digite en la variale "Port" el puerto donde esta la version que desea probar, corra la prueba inicial, vuelva a modifica el archivo de configuracion y cambie el puerto donde esta instalada la version a comparar, y vuelva a correr el test.

Esto generara imagenes de cada uno de los test dentro de la carpeta ./results/cypress.

Para realizar la comparación de las pruebas ejecutadas realice lo siguiente:

Ejecute el comando vrt.js en la consola de comandos desde la raiz del proeycto

```bash
node vrt.js
```

El informe de la prueba se genera en la ruta ./results/index.html

## Integrantes

| Nombre          | Correo                      |
| --------------- | --------------------------- |
| Calletana Lopez | c.lopezb2@uniandes.edu.co   |
| Sergio Gelvez   | s.gelvezg@uniandes.edu.co   |
| Raul Ramos      | r.ramosg@uniandes.edu.co    |
| Juan Tapia      | ja.tapia911@uniandes.edu.co |
