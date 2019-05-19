
	var messageTypes = {
		metar: 'METAR',
		sa: 'METAR',
		speci: 'SPECI',
		sp: 'SPECI'
	};
	
	var fullMatchParserFactory = function(key) {
		return function(obj, match) {
			obj[key] = match[0];
		};
	};
	
	
	var timestampParser = function(obj, match) {
		obj.last_observation=match;
	};
	
	var windVariableParser = function(obj, match) {

		obj.wind = `wind is blowing from VRB course at a sustained speed of ${match[1]} ${match[2]}`;
	};

	var windParser = function(obj, match) {
		obj.wind = obj.wind || {};
		obj.wind = `wind is blowing from ${match[1]} degrees (true) at a sustained speed of ${match[2]} ${match[5]}`;
		if(match[4]){
			obj.wind+=`with ${match[4]} ${match[5]} gusts`
		}
	};
	
	var windRangeParser = function(obj, match) {
		obj.wind = obj.wind || {};
		obj.wind.deviation = {
			from: match[1],
			to: match[2]
		};
	};
	
	
	var temperatureParser = function(obj, match) {
		obj.temperature = (!!match[1] ? -1 : 1) * parseInt(match[2])+' C';
	};
	
	
	
	
	var mapping = [
		{ reg: /^[A-Z]{4}$/, parser: fullMatchParserFactory('station') },
		{ reg: /CALM/, parser: fullMatchParserFactory('wind') },
		{ reg: /VRB(\d\d)((KT)|(KMH)|(MPS))/, parser: windVariableParser },
		{ reg: /(\d\d\d)(\d\d)(G(\d\d))?((KT)|(KMH)|(MPS))/, parser: windParser },
		{ reg: /(\d\d\d)V(\d\d\d)/, parser: windRangeParser },
		{ reg: /^(M)?(\d\d)\/(M)?(\d\d)$/, parser: temperatureParser }
	];
	
	parseMetar = function(message) {
		var maps = mapping.slice(0);
		var parts = message.split(/\s+/);
		var remark = false;
		var obj = {};
		timestampParser(obj,`${parts[0]} at ${parts[1]} GMT`);
		for(var i=2;i<parts.length;i++) {
			var part = parts[i];
			
			for(var j = 0; j < maps.length; j++) {
				var map = maps[j];
				
				var match = part.match(map.reg);
				if(!!match) {
					map.parser(obj, match);
					if(!map.many) {
						maps.splice(j, 1);
					} 
					break;
				}
			}
		}
		
		return {data:obj};
	};

module.exports=parseMetar;