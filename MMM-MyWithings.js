//MMM-MyWithings.js:

Module.register("MMM-MyWithings",{
    // Default module config.
    defaults: {
        //text: "default text",
        limit: "7",
        userid: "",
        oauth_consumer_key: "",
        oauth_signature: "",
        oauth_signature_method: "HMAC-SHA1",
        oauth_token: "", 
        oauth_version: "1.0",
        updateInterval: 60 * 60 * 1000, // every 60 minutes
		animationSpeed: 1000,
		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,
		apiBase: "http://wbsapi.withings.net/measure",
		apiAction: "getmeas"
		
    },    
    start: function() {
		Log.log('Sarting module: ' + this.name);
		//this.data.header = "";
		this.Wstatus = null;
		this.loaded = false;
		this.updatetime = null;
		this.weight = null;
		this.fatratio = null;
		this.measuredate = 0;
	//	this.show_apidata();
		this.getapi();
	//	this.getapi(function(data){ console.log("results in start" + data + "end result"); });
	},

 
    // Override dom generator.
    getDom: function() {
			var wrapper = document.createElement("div");
			var header = document.createElement("header");
			 header.innerHTML = "MyWithings";
			 wrapper.appendChild(header);
		if (!this.loaded) {
			var load_text = document.createElement("div");
			load_text.className = "small dimmed";
			load_text.innerHTML = "Waiting For Update...";
			wrapper.appendChild(load_text);
		} else {
			var updated_on = document.createElement("div");
			updated_on.innerHTML = "data sync on " + this.updatetime;
			updated_on.className = "small";
			wrapper.appendChild(updated_on);
			var table = document.createElement("table");
			table.className = "small";
			table.border='0';
				var row0 = document.createElement("tr");
				table.appendChild(row0);
				var cell0 = document.createElement("td");
			//	cell.className = "Text";
				cell0.innerHTML = "Measured on: ";
				row0.appendChild(cell0);
				var date_measure = document.createElement("td");
			//	cell.className = "Text";
				date_measure.innerHTML = this.measuredate;
				date_measure.className = "bright align-right";
				row0.appendChild(date_measure); 
			var row = document.createElement("tr");
			table.appendChild(row);
				var cell = document.createElement("td");
			//	cell.className = "Text";
				cell.innerHTML = "Weight: ";
				row.appendChild(cell);
				var weight = document.createElement("td");
			//	cell.className = "Text";
				weight.innerHTML = this.weight + " KG";
				weight.className = "bright align-right";
				row.appendChild(weight);
			var row1 = document.createElement("tr");
				table.appendChild(row1);
				var cell1 = document.createElement("td");
			//	cell.className = "Text";
				cell1.innerHTML = "Fat Ratio: ";
				row1.appendChild(cell1);
				var FatRatio = document.createElement("td");
			//	cell.className = "Text";
				FatRatio.innerHTML = this.fatratio + " %";
				FatRatio.className = "bright align-right";
				row1.appendChild(FatRatio);
			wrapper.appendChild(table);			 
		}	
return wrapper;
    },
    
    getapi: function() {
		Log.info("enter getapi");
		var url = this.config.apiBase + this.getPar();
		//var url = "http://wbsapi.withings.net/measure?action=getmeas"
		var self = this;
		var retry = true;
		Log.info("Url: " + url);
		var apiRequest = new XMLHttpRequest();
		apiRequest.open("GET", url, true);
		apiRequest.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				Log.log("response is" + this.response);
				self.processAPI(JSON.parse(this.response));
				} else {
				//	Log.error(self.name + "error loadingAPI");
					retry = false;
					}
				if (retry) {self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				//console.log("apirequest retry");
				}
				};
			
		 
		apiRequest.send();
		Log.log("apirequest is" + apiRequest);
		//return success;
	},
	
	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateWeather();
		}, nextLoad);
	},
	
	getPar: function() {
		//preparing some data variables
		var timestamp = Math.floor(Date.now() / 1000);
		var oauth_nonce = Array(32+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 32);
		Log.log("timestamp is: " + timestamp);
		var par = "?";
        par += "action=" + this.config.apiAction;
        //provided from http://oauth.withings.com/api
		par += "&oauth_consumer_key=" + this.config.oauth_consumer_key;
		//random string, should be different for every request
		par += "&oauth_nonce=" + oauth_nonce;
		par += "&oauth_signature=" + this.config.oauth_signature;
        par += "&oauth_signature_method=" + this.config.oauth_signature_method;
		//current timestamp of the request
        par += "&oauth_timestamp=" + timestamp; 
        par += "&oauth_token=" + this.config.oauth_token;
        par += "&oauth_version=" + this.config.oauth_version;
        par += "&userid=" + this.config.userid;
        //number of measures to read. Default only most recent one
        par += "&limit=" + this.config.limit;
        //par += "&startdate=1486709768";
        // par += "&enddate=1486709868";
        //par += "&meastype=1";


		return par;
	},
	
	processAPI: function (data) {
		this.updatetime = this.convertEp2Date(data.body.updatetime);
		this.weight = (data.body.measuregrps[0].measures[0].value / 1000).toFixed(2);
		this.fatratio = (data.body.measuregrps[0].measures[2].value / 1000).toFixed(2);
		this.measuredate = this.convertEp2Date(data.body.measuregrps[0].date);
		Log.log("weight is :" + this.weight);
		Log.log("length of array:" + data.body.measuregrps[0].measures.length);
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
		},
	
	convertEp2Date: function(date) {
		var outputdate = new Date(date*1000);
		var dateUTC = outputdate.toLocaleDateString();
		return dateUTC;
		}
    
    
});
