var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');


//session redis
var session = require('express-session');
var redis = require('redis');
var client = redis.createClient();
var redisStore=require('connect-redis')(session);

app = express();

app.set('port', 7575);

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var sessionMiddleware = session({
	secret: 'bobneuman',
	store: new redisStore({
			host:'localhost',
			port: 6379,
			client:client,
			ttl: 10*60}),
	saveUninitialized: false,
	resave: false
});
app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
/*
app.use(function (req,res,next){
	res.status(404);
	console.log('404')
	res.render('index');
});
*/
http.createServer(app).listen(app.get('port'), function(){
	console.log("Expres escuchando en el puerto" + app.get('port'));
});

require('./router')(app);

