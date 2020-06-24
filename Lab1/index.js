console.log("naondkasn")
const http = require('http');

var options = {
    host: 'unite.md',
    port: '80',
    path: '/',
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};
var x = http.request(options,function(res){
    console.log("Connected");
    res.on('data',function(data){
   console.log(data.toString());
	var img = data.toString().match(/(https?:\/\/.*\.(?:png|jpg))/i)
	console.log(img)

    });
});

x.end();


//wss.on('connection', ws => {
  //console.log('WS connected.')
  //ws.on('message', message => {
    //console.log(`Received message => ${message}`)
  //})
  //ws.send('ho!')
//})