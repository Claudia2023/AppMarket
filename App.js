'use strict';

var express = require('express'),
    path = require('path'),
    gaikan = require('gaikan'),
    bodyParser = require('body-parser'),
    compression = require('compression');

var app = express();

app.set('view engine', '.html');
app.engine('html', gaikan);
app.set('views', __dirname + '/views');
app.use(compression());
gaikan.options.rootDir = __dirname;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));
app.use(express.static(path.join(__dirname, 'public')));
/*****************************************************************/
app.get('/', function (req, res) {
	res.render('Index'/* ACA puede especificarse informacion a mostrar en la pagina ejemplo, {
		NickUsuer: req.session.Usuario.Usuario,
		Companias: req.session.Companias,
		MensajesAmadeus: respuesta,
		Notificaciones: respuestaN,
		TareasAsig: respuestaT,
		CompSelect: req.session.CompaniaSelect,
		Graficas: JSON.stringify(Graficas)
	}*/);
});


/*****************************************************************/
/***		Control de Errores		***/
app.use(function (err, req, res, next) {
	console.error("Primer Handler: ", err.stack);
	console.log("\n\n");
	next(err);
});

app.use(function (err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({
			error: 'Error Interno!'
		});
	} else {
		console.log("Error Tipo 500: ", err);
		next(err);
	}
});

// Error 500
app.use(function (err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('500', {
		error: err
	});
});

// Error 404
app.use(function (req, res) {
	res.status(404);
	res.render('404', {
		Error: 'El objecto que buscas no se encuentra en el servidor!!!'
	});
});
// Excepción no Controlada
process.on('uncaughtException', function (err) {
	console.log('Excepción No Controlada: \n' + err);
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Escuchando por: " + port);