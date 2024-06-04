const http = require("http");
const fs = require("fs");

async function main() {
	const server = http.createServer((request, response) => {
		if (request.method == "POST") {
			let body = "";
			request.on('data', (data) => {
				body += data;
			});
			request.on('end', () => {
				if ((request.url.match('/') || []).length != 1) {
					response.writeHead(400, {'Content-Type': 'text/plain'});
					response.end('FAIL');
					return;
				};

				fs.writeFile("data" + request.url, body, (error) => {
					if (error) {
						console.error(error);
						response.writeHead(500, {'Content-Type': 'text/plain'});
						response.end('FAIL');
					} else {
						response.writeHead(200, {'Content-Type': 'text/plain'});
						response.end('OK');
					}
				});
			});
		} else if (request.method == "GET") {
			if ((request.url.match('/') || []).length != 1) {
				response.writeHead(400, {'Content-Type': 'text/plain'});
				response.end('FAIL');
				return;
			};
			
			if (fs.existsSync("data" + request.url)) {
				fs.readFile("data" + request.url, "utf8", (error, data) => {
					if (error) {
						console.error(error);
						response.writeHead(500, {'Content-Type': 'text/plain'});
						response.end('FAIL');
					} else {
						response.writeHead(200, {'Content-Type': 'text/plain'});
						response.end(data);
					}
				});
			} else {
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.end("NX");
			} 
		}
	});
	const port = 6783;
	const host = "0.0.0.0";
	server.listen(port, host);
	console.log(`Listening at http://${host}:${port}`)
}

main()
