# MMM-MyWithings
This module for the MagicMirror shows weight and fat ratio using the Withings API (source data for example from a Withings Body Scale).

##Version info
first test version which allow access to Withings API for last measurement. Displays weight, fat ratio and date of last measurement.

next version to include:
Error handling, code cleanup, trend indicator for X weeks.

##Prerequisites
First you need to register for free as [Withings developer](http://oauth.withings.com/partner/dashboard), you will get an API Key and an API Secret required for the next steps.
	
Ue the [Withings API site](http://oauth.withings.com/api) to generate the different keys (oAuth) and IDs. You will need 4 items in total:
- oauth_consumer_key:
- oauth_signature
- oauth_token
- userid

Note that there are time limits between the steps so complete all at once. 

## Installing the module
Clone this repository in your `~/MagicMirror/modules/` folder `( $ cd ~MagicMirror/modules/ )`:
````javascript
git clone https://github.com/Be4fun/MMM-MyWithings.git
````

##Using the module
To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
			module: 'MMM-MyWithings',
			position: 'top_left',  //Where you want to show your module
			config:  {
					//provided from http://oauth.withings.com/api
					userid: "", 
					oauth_consumer_key: "",
					oauth_signature: "",
					oauth_token: ""
				 }
		}
]
````


