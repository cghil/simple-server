//Require modules
var http = require("http");
var url = require('url');
var path = require('path');
var fs = require('fs');

// Obj of Mime Types
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : 'image/jpeg',
	"png" : "image/png",
	"javascript" : "text/javascript",
	"css" : "text/css"
};

//Create Server
http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname; // gives use the pathname
	var fileName = path.join(process.cwd(), unescape(uri)) // returns the current working directory
	console.log('Loading ' + uri);
	var stats;

	try{
		stats = fs.lstatSync(fileName);
		// look for the file name if it is not there do the catch
	} catch(e) {
		res.writeHead(404, {'Content-Type' : 'text/plain'});
		res.write("404 Not Found\n")
		res.end()
		return;
		// program ends here
	}

	// Check if file/directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]; //gets the mimetype
		console.log('This is the mimetype ' + mimeType)
		res.writeHead(200, {'Content-Type' : mimeType})

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()){
		// if it is a directory
		res.writeHead(302, {
			'Location' : 'index.html'
		})
		res.end();
	} else {
		res.writeHead(500, {'Content-Type' : 'text/plain'})
		res.write('Internal Server Error\n');
		res.end();
	}
}).listen(3000);