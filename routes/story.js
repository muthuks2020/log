
/*
 * GET users listing.
 */
 var mongo = require('mongodb');
 var mongoConn = require('../routes/connection');


exports.view = function(req, res)
{
	if(req.session.email)
	{
		var email = req.session.email;
		mongoConn.storyColl.find({email: email},{ profileupdate: 1}).toArray(function(err, document) 
		{
			if(!err)
			{		
				var profileupdatestatus = 0;
				console.log(JSON.stringify(document));
				var profileupdatedb = document[0].profileupdate;
				if(profileupdatedb == true) profileupdatestatus = 1;
				else profileupdatestatus = 0;
				console.log("formstory = "+profileupdatestatus);
	  			res.render('story', { title: 'Express',sessiontrue: 1,profileupdate:0 ,profileupdatestatus:profileupdatestatus});
			}

		});
	}
	else
	{
	 	res.redirect('/');	
	}
};

exports.storyboardview = function(req,res)
{
	console.log("storyboardview = "+req.params.storytype);
	if(req.session.email)
	{
		var storytype = req.session.category;
		//req.sesssion.storytype = storytype;

		var sotryid = req.session.storyid;

		var email = req.session.email;

		if(req.session.storyid){
			mongoConn.storyColl.find( {"email":email}).toArray(function(err,articleresult)
			{
				console.log(articleresult[0]);
				var storyid = req.session.storyid;
				console.log("---storyid = "+storyid)
				var story = articleresult[0].storylist[storyid-1];
				console.log("story = "+story);
				var storytype = req.session.category;


				var storypictures = story.storypicture;
				var profileid = storypictures[storypictures.length-1];

				var o_id = new mongo.ObjectID(profileid);
				mongoConn.profilepictureColl.find({"_id":o_id}).toArray(function(err,profileimage) 
				{
					console.log(profileimage);
					if(profileimage.length >= 1)
					{
						var path = profileimage[0].path;
						console.log("-----------singleprofileimage - "+path);
						story.storypicture = '../'+path.split("public/")[1];
						story.storyid = req.session.storyid
						//res.render('storypreview',{title:'StoryPreview',storytype:storytype,sessiontrue: 1,story:story});
						res.render('storyboard',{title: 'Storyboard',storytype:storytype,sessiontrue: 1,story:storytype,story:story});


					}		
					else
					{
						story.storyid = req.session.storyid;

						story.storypicture = '../images/pro-pic.jpg';
						//res.render('storypreview',{title:'StoryPreview',storytype:storytype,sessiontrue: 1,story:story});
						res.render('storyboard',{title: 'Storyboard',storytype:storytype,sessiontrue: 1,story:story});

					}		
				});
			});
		}
		else
		{
			var story = {title:'',subheading:'',bodycontent:'',storypicture:'../images/pro-pic.jpg',storyid:0};
			res.render('storyboard',{title: 'Storyboard',storytype:storytype,sessiontrue: 1,story:story});
		}

	}	
	else
	{
	 	res.redirect('/');	
	}
};

exports.storytypeview = function(req,res)
{
	if(req.session.email)
	{
		console.log("storytypeview");
		res.render('storytype',{title: 'StoryType',sessiontrue: 1});
	}	
	else
	{
	 	res.redirect('/');	
	}
};

exports.storypreview = function(req,res)
{
	if(req.session.email)
	{
		var email = req.session.email;
		var storytype = req.session.category;
		var storyid = req.session.storyid;

		if(req.session.storyid)
		{
			mongoConn.storyColl.find( {"email":email}).toArray(function(err,articleresult)
			{
				console.log(articleresult[0]);
				var storyid = req.session.storyid;
				console.log(storyid)
				var story = articleresult[0].storylist[storyid-1];
				console.log(story);
				var storytype = req.session.category;


				var storypictures = story.storypicture;
				var profileid = storypictures[storypictures.length-1];

				var o_id = new mongo.ObjectID(profileid);

				mongoConn.profilepictureColl.find({"_id":o_id}).toArray(function(err,profileimage) 
				{
					console.log(profileimage);
					if(profileimage.length >= 1)
					{
						var path = profileimage[0].path;
						console.log("-----------singleprofileimage - "+path);
						story.storypicture = path.split("public/")[1];
						res.render('storypreview',{title:'StoryPreview',storytype:storytype,sessiontrue: 1,story:story});

					}		
					else
					{
						story.storypicture = 'images/pro-pic.jpg';
						res.render('storypreview',{title:'StoryPreview',storytype:storytype,sessiontrue: 1,story:story});
					}		
				});
			});
		}
		else
		{
			var story = {'title':'','subheading':'','bodycontent':'','storypicture':''};
			res.render('storypreview',{title:'StoryPreview',storytype:storytype,sessiontrue: 1,story:story});
		}

	}	
	else
	{
	 	res.redirect('/');	
	}
}


exports.savewriterStory = function(req,res)
{
	console.log(JSON.stringify(req.body));
	if(req.session.email)
	{
		var userid = req.session.email;
		mongoConn.storyColl.find({"email":userid}).toArray(function(err,writerresult) 
		{
			if(req.body.hasOwnProperty('storyid') && req.body.storyid >= 1)
			{
				var json = {};
				var storylistArry = writerresult[0].storylist;
				var storylength = storylistArry.length + 1;
				
				if (req.body.hasOwnProperty('imageid') && req.body.imageid != '') 
				{
					json = {"title":req.body.title,"subheading":req.body.subheading,"bodycontent":req.body.bodycontent,"storypicture":[req.body.imageid],"createddate":"","modifieddate":"","storystatus":"In progress","storycategory":"","storyid":storylength};
				}
				else
				{
					json = {"title":req.body.title,"subheading":req.body.subheading,"bodycontent":req.body.bodycontent,"createddate":"","modifieddate":"","storystatus":"In progress","storycategory":"","storyid":storylength};
				}
				var i= 0;
				req.session.storyid = storylength;
	 			writerresult[0].storylist.push(json);
		     	mongoConn.storyColl.save(writerresult[0],function(err,result) {});
	     	  	res.setHeader('Content-Type', 'application/json');
	    		res.send(JSON.stringify({ "status": "success","storyid":storylength}));

			}
			else
			{
				//console.log("writerresult = "+JSON.stringify(writerresult));
				var storylistArry = writerresult[0].storylist;
				var storylength = storylistArry.length + 1;
				var json;
				if (req.body.hasOwnProperty('imageid') && req.body.imageid != '') 
				{
					json = {"title":req.body.title,"subheading":req.body.subheading,"bodycontent":req.body.bodycontent,"storypicture":[req.body.imageid],"createddate":"","modifieddate":"","storystatus":"In progress","storycategory":"","storyid":storylength};
				}
				else
				{
					json = {"title":req.body.title,"subheading":req.body.subheading,"bodycontent":req.body.bodycontent,"createddate":"","modifieddate":"","storystatus":"In progress","storycategory":"","storyid":storylength};
				}
				var i= 0;
				req.session.storyid = storylength;
	 			writerresult[0].storylist.push(json);
		     	mongoConn.storyColl.save(writerresult[0],function(err,result) {});
	     	  	res.setHeader('Content-Type', 'application/json');
	    		res.send(JSON.stringify({ "status": "success","storyid":storylength}));
    		}
		});
	}
	else
	{
	 	res.redirect('/');	
	}
};

exports.getAllStoryList = function(req,res)
{
	if(req.session.email)
	{
		var userid = req.session.email;
		mongoConn.storyColl.find({"email":userid}).toArray(function(err,writerresult) 
		{
			var profilepictures = writerresult[0].profilepicture;
			var profileid = profilepictures[profilepictures.length -1];

			var o_id = new mongo.ObjectID(profileid);
			mongoConn.profilepictureColl.find({"_id":o_id}).toArray(function(err,profileimage) 
			{
				console.log(profileimage);
				if(profileimage.length >= 1)
				{
					var path = profileimage[0].path;
					console.log("-----------singleprofileimage - "+path);
					writerresult[0].profilepicture = path.split("public/")[1];
				}		
				else
				{
					writerresult[0].profilepicture = 'images/pro-pic.jpg';
				}		
				res.send(writerresult[0]);
			});

		});
	}
};

exports.picturefileUpload = function(req,res)
{
    upload(req,res,function(err) 
    {
        //console.log(req.body);
        var requstfiles = req.files[0];		

        if(err) 
        {
        	console.log(err);
            return res.end("Error uploading file.");
        }
        else
    	{
    		mongoConn.profilepictureColl.insert(requstfiles,function(err, result) 
			{
				console.log(JSON.stringify(result));
				console.log(result.insertedIds[0]);
	        	//res.end("File is uploaded");
	    		res.send(JSON.stringify({ "status": "success","fileid":result.insertedIds[0],"filename":result.ops[0].filename }));

			});
    	}
    });
};