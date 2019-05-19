const app=require('./app');
const http=require('http');
var server=http.createServer(app);
const port=process.env.PORT||3000;
server.listen(port,function(){
	console.log("Server running at port "+port);
});


