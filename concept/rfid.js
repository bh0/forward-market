var SerialPort = require("serialport").SerialPort
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

		console.log('card id: ' + cardID);
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
