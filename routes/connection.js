// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
//MongoClient.connect('mongodb://admin:password@localhost:27017/db', function (err, db) {
MongoClient.connect("mongodb://heroku_g9lw5ts9:jlv5d9kvfgbfq9k8jlua26mp07@ds141685-a0.mlab.com:41685,ds141685-a1.mlab.com:41685/heroku_g9lw5ts9?replicaSet=rs-ds141685", function(err, db)
{

	if(err) { return console.dir(err); }

	console.log("MongoDB connnection established");

	db.collection('writerscollection', {w:1}, function(err, collection) 
	{
		exports.storyColl = collection;
	});

	db.collection('profilepicturecollection', {w:1}, function(err, collection) 
	{
		exports.profilepictureColl = collection;
	});

});