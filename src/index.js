const http = require("http");
const url = require("url");
const querystring = require("querystring");
/* const log = require("./modules/my-log"); */
const { info, error } = require("./modules/my-log");
const { countries } = require("countries-list");

const server = http.createServer((request, response) => {
  const parsed = url.parse(request.url);
  console.log("parsed:", parsed);

  const pathname = parsed.pathname;

  //obtengo los parametros de la url
  const query = querystring.parse(parsed.query);

  //Filtrar rutas
  if (pathname === "/") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<html><body><p>Home Page</p></body></html>");
    response.end();
  } else if (pathname === "/exit") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<html><body><p>Bye</p></body></html>");
    response.end();
  } else if (pathname === "/country") {
    response.writeHead(200, { "Content-Type": "application/json" });
    //Paso JSON a String
    response.write(JSON.stringify(countries[query.code]));
    response.end();
  } else if (pathname === "/info") {
    let result = info(pathname);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(result);
    response.end();
  } else if (pathname === "/error") {
    let result = log.error(pathname);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(result);
    response.end();
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.write("<html><body><p>Not Found</p></body></html>");
    response.end();
  }
});

server.listen(3000);
console.log("Running on 3000");
