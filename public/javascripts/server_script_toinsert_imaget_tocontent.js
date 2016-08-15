
var contentful = require('contentful-management'); 
var request = require('request');

var space_id = '17u05p4x0l0r';
var accessToken = '11be9dfd82b44b3711c26bb448612610eb8afb90ce5a53b1404979aea178b744';
var client = contentful.createClient({
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app 
  accessToken: accessToken
})

//create user in contentful
function contentfulCreateWriter(email, password) {

	client.getSpace(space_id)
		.then((space) => {
			space.createEntry('writer', {
		     	fields: {
		       		email: {
						'en-US': email
		       		},
		       		password: {
						'en-US': password
		       		}
		     	}
		   	})
		   	.then((user) => {
		   		return user.sys.id; //todo save sys id in mongodb for future update purposes
		   	})
	    })
}

//social - twitter / facebook
//socialid - pageid of social
function contentfulUpdateWriter(sysid, social, socialid) {

    request({
	  method: 'PUT',
	  url: 'https://api.contentful.com/spaces/'+space_id+'/entries/' + sysid,
	  headers: {
	    'Authorization': 'Bearer ' + accessToken,
	    'Content-Type': 'application/vnd.contentful.management.v1+json',
	    'X-Contentful-Content-Type': 'writer',
	    'X-Contentful-Version': '4'
	  },
	  body: "{  \"fields\": {    \""+social+"Id\": {      \"en-US\": \"" +socialid+ "\"    }  }}"
	}, function (error, response, body) {
		return body;
	});
}


//data is object eg {field1 : value1, field2 : value2}
// possible fields are name, email, password, university, city, about, facebookUrl, twitterUrl
function contentfulUpdateWriterProfile(sysid, data) {

	var body = "{  \"fields\": {    ";
	for(var key in data) {
		body += "	\""+key+"\": {      \"en-US\": \"" +data[key]+ "\"    },	"
	}
	body += "  }}";
    request({
	  method: 'PUT',
	  url: 'https://api.contentful.com/spaces/'+space_id+'/entries/' + sysid,
	  headers: {
	    'Authorization': 'Bearer ' + accessToken,
	    'Content-Type': 'application/vnd.contentful.management.v1+json',
	    'X-Contentful-Content-Type': 'writer',
	    'X-Contentful-Version': '4'
	  },
	  body: body
	}, function (error, response, body) {
		return body;
	});
}

//send publicly accessible imageUrl and mimetype of image eg 'image/jpeg' or 'image/png'
function contentfulCreateAsset(imageUrl, mimeType) {
	client.getSpace(space_id)
		.then((space) => {
		space.createAsset({
	      fields: {
	      	title: {
	      		'en-US' : imageUrl.replace(/^.*[\\\/]/, '')
	      	},
	        file: {
	          'en-US': {
	             contentType: mimeType,
	             fileName: imageUrl.replace(/^.*[\\\/]/, ''),
	             upload: imageUrl
	          }
	        }
	      }
	    })
	    .then(function(e) {
	    	e.processForAllLocales().then(function(data) {
	    		return {sysid : data.sys.id, path : data.fields.field['en-US'].url, name: data.fields.field['en-US'].fileName, raw: {fields: data.fields, sys: data.sys}};
	    	})
	    })
	})
}