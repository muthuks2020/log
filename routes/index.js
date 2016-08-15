
/*
 * GET home page.
 */
 var mongoConn = require('../routes/connection');
 var contentful = require('contentful-management'); 
var request = require('request');

var space_id = '17u05p4x0l0r';

var accessToken = '11be9dfd82b44b3711c26bb448612610eb8afb90ce5a53b1404979aea178b744';
var client = contentful.createClient({
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app 
  accessToken: accessToken
})


exports.index = function(req, res)
{
	if(req.session.email)
	{
		var profileupdatestatus = 0;
		var email = req.session.email;
		mongoConn.storyColl.find({email: email},{ profileupdate: 1}).toArray(function(err, document) 
		{
			if(!err)
			{		
				console.log(JSON.stringify(document));
				var profileupdatedb = document[0].profileupdate;
				if(profileupdatedb == true) profileupdatestatus = 1;
				else profileupdatestatus = 0;

				console.log("formindexjs = "+profileupdatestatus);
	  			res.render('story', { title: 'Unipaper',sessiontrue: 1,profileupdate:0,profileupdatestatus:profileupdatestatus });

			}
		});
	}
	else
	{
  		res.render('index', { title: 'Unipaper' });
	}
};

//profile view functionality

exports.profileview  = function(req, res)
{
	if(req.session.email)
	{
		var email = req.session.email;
		mongoConn.storyColl.find({email: email}).toArray(function(err, document) 
		{
			if(err)
			{
				res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
			}
			else
			{
				var username = "";
				var universityname = "";
				var city = "";
				var email = "";
				var facebooklinks = "";
				var twitterlinks = "";
				var aboutyou = "";

				if(document.length >= 1)
				{
					username = document[0].username;
					universityname = document[0].universityname;
					city = document[0].city;
					email = document[0].email;
					facebooklinks = document[0].facebooklinks;
					twitterlinks = document[0].twitterlinks;
					aboutyou = document[0].aboutyou;

				}
		  		res.render('profileview', { title: 'Unipaper',sessiontrue:1,username:username,universityname:universityname,city:city,email:email,facebooklinks:facebooklinks,twitterlinks:twitterlinks,aboutyou:aboutyou });
			}
		});
	}
	else
	{
	 	res.redirect('/');	
	}
};


exports.saveSignupForm = function(req,res)
{
	console.log(JSON.stringify(req.body));
	var email = req.body.email;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//var json = {"title":req.body.title,"subheading":req.body.subheading,"bodycontent":req.body.bodycontent,"storyid":"11","storypicture":[],"createddate":"","modifieddate":"","storystatus":"In progress","sotrycategory":""};

	var userjson = {"writerid" : "","username" : "","password" : password,"universityname" : "","city" : "","email" : email,"facebooklinks" : "","twitterlinks" : "","aboutyou":"","profilepicture" : [ ],"storylist" :[],"profileupdate":"false"};

	mongoConn.storyColl.find({email: email}).toArray(function(err, document) 
	{
		if(err)
		{
			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
		}
		else
		{
			console.log(document.length);
			console.log(JSON.stringify(document));

			if(document.length >= 1)
			{
				//req.session.email = email;
    			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"User already exists"}));
			}
			else
			{
				client.getSpace(space_id)
				.then((space) => {
					space.createEntry('writer', {
				     	fields: {
				       		email: {
								'en-US': email
				       		},
				       		password: {
								'en-US': password
				       		},
				       		name: {
								'en-US': ""
				       		}
				     	}
				   	})
				   	.then((user) => {
				   		console.log(user.sys.id);	 
				   		userjson.writerid = user.sys.id
				   		mongoConn.storyColl.insert(userjson,function(err, result) 
						{
							console.log(JSON.stringify(result));
							console.log(result.ops[0].email);						
							req.session.email = result.ops[0].email;
		    				res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"User created successfully"}));						
						});  		
				   	})
			    })
			
			}
		}	
	});
};

exports.logoutWriter = function(req,res)
{
	req.session.destroy();
	res.redirect('/');	

};

exports.sigininAction = function(req,res)
{
	console.log(JSON.stringify(req.body));
	var email = req.body.email;
	var password = req.body.password;

	mongoConn.storyColl.find({email: email, password:password}).toArray(function(err, document) 
	{
		if(err)
		{
			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
		}
		else
		{
			console.log(document.length);
			console.log(JSON.stringify(document));

			if(document.length >= 1)
			{
				req.session.email = email;
				res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"User loginIn successfully"}));
			}
			else
			{				
				res.send(JSON.stringify({ "status": "success","code" :0,"msg":"User credentials not correct"}));
			}
		}	
	});
};

exports.sigininSocialAction = function(req,res)
{
	var username = req.body.username;
	var email = req.body.userid;
	var password = req.body.userid;


	var userjson = {"writerid" : "","username" : username,"password" : password,"universityname" : "","city" : "","email" : email,"facebooklinks" : "","twitterlinks" : "","aboutyou":"","profilepicture" : [ ],"storylist" :[],"profileupdate":"false"};

	mongoConn.storyColl.find({email: email}).toArray(function(err, document) 
	{
		if(err)
		{
			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
		}
		else
		{
			console.log(document.length);
			console.log(JSON.stringify(document));
			if(document.length >= 1)
			{
				req.session.email = email;
    			res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"User already exists"}));
			}
			else
			{
				client.getSpace(space_id)
				.then((space) => {
					space.createEntry('writer', {
				     	fields: {
				       		email: {
								'en-US': email
				       		},
				       		password: {
								'en-US': password
				       		},
				       		name:{
				       			'en-US':username
				       		}
				     	}
				   	})
				   	.then((user) => {
				   		console.log(user.sys.id);	 
				   		userjson.writerid = user.sys.id
				   		mongoConn.storyColl.insert(userjson,function(err, result) 
						{
							console.log(JSON.stringify(result));
							console.log(result.ops[0].email);
							req.session.email = result.ops[0].email;
		    				res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"User created successfully"}));
						});  		
				   	})
			    })
				
			}
		}	
	});

	
};

exports.submitArticletoContentful = function(req,res)
{

	if(req.session.email)
	{
		var email = req.session.email;
		var storyid = req.session.storyid

		mongoConn.storyColl.find({email: email}).toArray(function(err, document) 
		{
			if(err)
			{
				res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
			}
			else
			{
				console.log(document.length);
				console.log(JSON.stringify(document));
				if(document.length >= 1)
				{
					var storylist = document[0].storylist;

					console.log(JSON.stringify(document[0].storylist));
					console.log("------------------------------------------");
					var story = storylist[storyid-1];
					var subheading = story.subheading;
					var title = story.title;
					var bodycontent = story.bodycontent;
					var storypicture = story.storypicture[0];

					var space_id = '17u05p4x0l0r';
					var accessToken = '11be9dfd82b44b3711c26bb448612610eb8afb90ce5a53b1404979aea178b744';

					imageUrl = "http://2adpro.com/images/newlogo.png";
					client.getSpace(space_id)
					.then((space) => {
					space.createAsset({
				      fields: {
				      	title: {
				      		'en-US' : imageUrl.replace(/^.*[\\\/]/, '')
				      	},
				        file: {
				          'en-US': {
				             contentType: 'image/jpeg',
				             fileName: imageUrl.replace(/^.*[\\\/]/, ''),
				             upload: imageUrl
				          }
				        }
				      }
				    })
				    .then(function(e) {
				    	console.log("Asset id = "+e.sys.id);
				    	request({
					 		method: 'POST',
					 		url: 'https://api.contentful.com/spaces/'+space_id+'/entries/',
						 	headers: {
						   'Authorization': 'Bearer ' + accessToken,
							    'Content-Type': 'application/vnd.contentful.management.v1+json',
							    'X-Contentful-Content-Type': 'article',
							    'X-Contentful-Version': '4'
						  },
						  body: "{  \"fields\": {  \"title\": {  \"en-US\": \""+title+"\" },\"content\": { \"en-US\": \""+bodycontent+"\" },\"subHeading\":{\"en-US\":\""+subheading+"\"}}}"
						}, 
						function (error, response, body) 
						{
						  	console.log('Status:', response.statusCode);
						  	console.log('Headers:', JSON.stringify(response.headers));
						  	console.log(typeof(body));
						  	var jsonobj = JSON.parse(body);
						  	console.log(jsonobj.sys.id);

						  	document[0].storylist[storyid-1].articleid = jsonobj.sys.id;
							document[0].storylist[storyid-1].storystatus = "Submited";

							mongoConn.storyColl.save(document[0],function(err,result) {
								res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"User created successfully"}));
							});
						});
				    })
				})

					
				}
			}
		});
	}
	/*
	
	*/
};

//fetch updated profiles

exports.getProfileupdateStatus = function(req,res)
{
	var email = req.session.email;
	mongoConn.storyColl.find({email: email},{ profileupdate: 1}).toArray(function(err, document) 
	{
		if(err)
		{
			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
		}
		else
		{
			console.log(JSON.stringify(document));
			var profileupdate = document[0].profileupdate;profileupdate
			console.log(profileupdate);
			res.send(JSON.stringify({ "status": "success","code" : 1,"profileupdate":profileupdate}));
		}
	});
};

exports.profileformSubmit = function(req,res)
{
	var email = req.session.email;
	console.log(JSON.stringify(req.body));

	var username = req.body.username;
	var universityname = req.body.universityname;
	var city = req.body.city;
	var email = req.body.email;
	var facebooklinks = req.body.facebooklinks;
	var twitterlinks = req.body.twitterlinks;
	var aboutyou = req.body.aboutyou;

	
	mongoConn.storyColl.find({email: email}).toArray(function(err, document) 
	{
		if(err)
		{
			res.send(JSON.stringify({ "status": "failure","code" : 0,"msg":"Some server side error occured"}));
		}
		else
		{			
			console.log(JSON.stringify(document));
			document[0].username = username
			document[0].universityname = universityname;
			document[0].city = city;
			document[0].email = email;
			document[0].facebooklinks = facebooklinks; 
			document[0].twitterlinks = twitterlinks;
			document[0].aboutyou =  aboutyou;
			if (req.body.hasOwnProperty('imageid') && req.body.imageid != '') {
				document[0].profilepicture.push(req.body.imageid);
			}
			if(aboutyou != "") document[0].profileupdate = true; 
	     	mongoConn.storyColl.save(document[0],function(err,result) {
				res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"profile updated successfully"}));
	     	});
	     	
		}
	});

};

exports.updateCategory = function(req,res)
{
	if(req.session.email)
	{
		req.session.category = req.body.category;
	}
	res.send(JSON.stringify({ "status": "success","code" : 1,"msg":"storytype updated"}));
};


exports.uploadimages = function(req,res)
{
	console.log("----------------------------------------------------------------");
	console.log(req.url);
	console.log("----------------------------------------------------------------");
	res.send("."+req.url);
}