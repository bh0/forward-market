var express = require('express'),
	exphbs  = require('express3-handlebars'),
	path = require('path'),
	request = require('request'),

	app = express();


app.use("/js", express.static(path.join(__dirname, '/public/js/')));
app.use("/css", express.static(path.join(__dirname, '/public/css/')));
app.use("/img", express.static(path.join(__dirname, '/public/img/')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next) {
	res.render('home');
});

app.get('/upc/:code', function (req, res, next){
	var code = req.params.code;

	if(code){
res.send('{"valid":"true","number":"04976400","itemname":"Sprite 20 oz","description":"Lemon-Lime Soda","price":"1.09","ratingsup":0,"ratingsdown":0}');

		// we should check to see if we have a cached copy
		// request("http://upcdatabase.org/api/json/9cbbaa1e9947081067e21d5b8d81649d/" + code, function (err, response, body){
		// 	res.send(body);
		// });
	}
});

app.listen(3000);