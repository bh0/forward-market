

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	request = require('request'),

	exphbs  = require('express3-handlebars'),
	path = require('path')

	;

server.listen(3001);



var userSocket = io.on('connection', function (socket) {
	//setInterval(sendTest.bind(socket), 6000);
	io.sockets.emit("hey", {data: "Stuff"});
});

app.use("/js", express.static(path.join(__dirname, '/public/js/')));
app.use("/css", express.static(path.join(__dirname, '/public/css/')));
app.use("/img", express.static(path.join(__dirname, '/public/img/')));

app.engine('handlebars', exphbs({defaultLayout: 'fake'}));
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


var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyAMA0", {
	baudrate: 9600
});

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data) {
		var charCodes = unpack(data),
			cardID = "";

		for(var i = 0, len = charCodes.length; i<len; i++){
			var h = charCodes[i].toString(16);
			cardID += (h.length === 1 ? "0" : "") + h;
		}

		if(cardID.length === 8){

			console.log("lookup card", cardID);
			var ip = "10.127.1.6";
			request("http://" + ip + ":8080/attask/api-internal/login?username=admin@user.attask&password=user", function (req, res, body){
				var data = JSON.parse(body);

				request("http://" + ip + ":8080/attask/api-internal/User/search?fields=highFiveCount&extRefID=" + cardID +"&sessionID="+ data.data.sessionID, function (r, e, b){
					var userData = JSON.parse(b);
					if(userData.data.length){

						console.log("card found", cardID);
						io.sockets.emit("id", userData.data[0]);
					}
				});
			});
		}

	});  

	serialPort.write(0x02, function(err, results) {
		if(err){
			console.log("Error while writing", err);
		}
	});  
});




function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str[i];
        bytes.push(char & 0xFF);
    }
    return bytes;
}
