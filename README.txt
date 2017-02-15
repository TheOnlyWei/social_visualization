Social Media Visualization Using Twitter

1.	Several files are git ignored, such as config file containing
	keys for accessing Twitter API and node_modules

	Create: config/config.js with the following code

	module.exports = {
		twitter: {
		  consumer_key:         '...',
		  consumer_secret:      '...',
		  access_token:         '...',
		  access_token_secret:  '...',
		  timeout_ms:           60*1000,  
		},
		mongodb: {
		  url: 'mongodb://localhost:27017/twitter'
		}
	}


	Visit the below link to get all four keys:
	https://apps.twitter.com/

	Then copy and paste them into your config/config.js file
	by replacing '...' with Twitter keys within quotes.
	

2.	$npm install 
	to install the missing node_modules folder
