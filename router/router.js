const express=require('express');
const router=express.Router();
const axios = require("axios");
var metar=require('./metar');
var redis = require("redis");
var client = redis.createClient();


client.on("error", function (err) {
    console.log("Error " + err);
});

router.route('/info')
	.get(async function(req,res){
		let scode=req.query.scode;
		let nocache=req.query.nocache;
		if(nocache&& nocache==1){
			try{
				var data=await getRemoteData(scode);
				res.send(data);
			}
			catch(e){
				res.send(e);
			}
		}
		else{
			try{
				var data=await client.get(scode,async function(err,data){
					if(data){
						console.log('redis');
						res.send(JSON.parse(data));

					}
					else{
						try{
							var data=await getRemoteData(scode);
							res.send(data);
						}
						catch(e){
							res.send(e);
						}
					}
				});
				
			}
			catch(e){
				console.log(e);
			}
		}
		
	});


router.route('/ping')
	.get(async function(req,res){
		res.send({body:'pong'});
	});

async function getRemoteData(scode){

	var url=`https://tgftp.nws.noaa.gov/data/observations/metar/stations/${scode}.TXT`;
	try {
	    const response = await axios.get(url);
	    const data = response.data;
	    console.log('remote');
	    var json=metar(data);
		client.set(scode, JSON.stringify(json), 'EX', 300);
  		return json;
	}
	catch (error) {
	    if(error.response.status==404){
			return Promise.reject({message:'Station Code does not exist'});
		}
		else{
			return Promise.reject({message:'Error in fetching data'});
		}	
	    
	}
}


module.exports=router;