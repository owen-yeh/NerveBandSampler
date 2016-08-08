var WSSamplePort = 8889;							//not implemented yet, change the wssClient

var systemSerialPort = "COM6";  					//check device manager
var wsClient = require('ws');						//websocket client


//open websocket, this may take a while, point the websocket to the correct docker ip and port
var wssClient = new wsClient('ws://192.168.99.101:8889/');


var SerialPort = require("serialport").SerialPort;	
var serialport = null;			 					//used to create serial read session


/*
	//HOW TO CONTROL THE CONTROLLER TO STORE RAW DATA
	
	e.g. wssClient.send(JSON.stringify({"command": "store", "output":0, "input":[500,22,333], "signalGroupID": 23232312}));
	e.g. wssClient.send(JSON.stringify({"command": "store", "output":1,"input":[500], "signalGroupID": 23232312}));
	
	- you need to send text in json format
	- you need to include command store
	- you need to include input array
	- you need to include output value
	- you need to include signalGroupID to tag your signals
	*****PLEASE WAIT A COUPLE OF SECONDS FOR THE CONTROLLER TO LOAD THE DB*******

*/

/*
	//usually this is used for timing functions, 1000 = milisecs
	var idd = setInterval( function(){
			wssClient.send(JSON.stringify({"output":1,"input":[500]}));
		}, 1000);
		
	//clear when done
	clearInterval(idd);

*/


/*

// this example send an entry to the database when websocket connection is established
wssClient.on('open', function() {
    wssClient.send(JSON.stringify({"command": "store", "output":0, "input":[500,22,333], "signalGroupID": 23232312}));
});

*/


//fred's variable sample
var buf = [];
var conExtract=false;
var arraySample=[];
var tempData=[0,0];
var  idd = 0;



//master fred's code
serialport = new SerialPort(systemSerialPort,{baudRate: 115200});
serialport.on('open', function(){
	
	
	console.log('Serial port opened');
	serialport.on('data', function(data){
	

		if(data.length!=0){
			//data.forEach(function(index){
				//buf.push(index);
			//})
			buf=data;
			
			for(i=0; i<buf.length;i++) {
				if(conExtract){
					//extracting the lower byte
					
					tempData[0]=(buf[i]);
					if (addBit){
						tempData[0]=(tempData[0]|128);
					}
					
					value=(tempData[1]>>1)*512+(tempData[1]&1)*256+tempData[0];
					
					if (channel == 1)
						channelVal[0] = value;
					else if(channel == 2)
						channelVal[1] = value;
						
					//arraySample.push([value,channel])
					//reset all values
					conExtract=false;
					tempData=[];
					addBit=false;
					
				}
				else{
					//extracting the upper byte
					
					firstBit=buf[i]>>7;
					if(firstBit){
						
						if(buf[i]&1){
							addBit=true;
						}
						else{
							addBit=false;
						}
						channel=((buf[i]>>3)&15)+1;
						tempData[1]=(buf[i]>>1)&3;
						conExtract=true;
					}
					else{
						tempData=[];
						conExtract=false;
						addBit=false;
					}
				}
			}
			buf=[];
		}
		//console.log(data[0]);
		//
		//for(i = 0; i < maxChannelNum; i++)
			//channelVal[i] = data[0];
		//console.log((data[0]>>> 0).toString(2));
		
	});
});





/*

//random code that might be usefull later

wssClient.on('message', function(message) {
	var controller = JSON.parse(message);
	console.log("server msg " + message);
	
	if(controller.command == "start"){
		
		idd = setInterval( function(){
			wssClient.send(JSON.stringify({"output":1,"input":[500]}));
		}, 1000);
		
	} else if(controller.command == "stop"){
		clearInterval(idd);
	}
		
	
	//tock = parseInt(message);
    //console.log('received: %s', message);
});

wssClient.on('close', function(message) {
	clearInterval(idd);
		
	//tock = parseInt(message);
    //console.log('received: %s', message);
});

//wssClient.send(JSON.stringify({"output":absTick,"input":channelVal}));
*/


//serialport.close(function (err) {
//	console.log('port closed, Error: ', null != err);
//});
//serialport = null;

/*

//decode signal from arduino master fred sex
		
*/

