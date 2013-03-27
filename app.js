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


// when we get mongo on the pi this will be deleted
var cache = {},
	hacks = {
		"049000004632": "0049000004632"
	};

app.get('/upc/:code', function (req, res, next){
	var code = req.params.code;

	if(code){

		if(hacks[code]){
			code = hacks[code];
		}
		// usefull test
		//res.send('{"valid":"true","number":"04976400","itemname":"Sprite 20 oz","description":"Lemon-Lime Soda","price":"1.09","ratingsup":0,"ratingsdown":0}');

		if(cache[code]) {
			res.send(cache[code]);
		} else {
			request("http://upcdatabase.org/api/json/9cbbaa1e9947081067e21d5b8d81649d/" + code, function (err, response, body){
				cache[code] = body;
				res.send(cache[code]);
			});
		}
	}
});

app.listen(3000);