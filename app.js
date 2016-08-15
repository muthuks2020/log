
/**
 * Module dependencies.
 */

var express = require('express');
_ = require('underscore')._;

var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
   	var originalfilename = file.originalname;
  	var filename = originalfilename.substr(0, originalfilename.lastIndexOf('.'));
  	var extension  = originalfilename.split('.').pop();

    cb(null, filename + '-' + Date.now()+'.'+extension)
  }
});

GLOBAL.upload = multer({ storage : storage }).array('profilepicturefile',1);

var http = require('http');
var path = require('path');


var app = express();

// all environments app.set('port', process.env.PORT || 3000);
app.set('port', process.env.PORT || 3000);

//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'uploads')));


app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(app.router);

var routes = require('./routes');
var user = require('./routes/user');
var story = require('./routes/story');

// development only
if('development' == app.get('env')) 
{
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/uploads/*.(png|jpeg|jpg|gif)', routes.uploadimages);

app.get('/storyview', story.view);
app.get('/storytypeview', story.storytypeview);
app.get('/storypreview',story.storypreview);

app.get('/storyboardview/:storytype',story.storyboardview);
app.post('/writerstory',story.savewriterStory);

app.post('/saveProfilePicture', story.picturefileUpload);

app.get('/getAllStories',story.getAllStoryList);

app.post('/savesignupform',routes.saveSignupForm);
app.post('/sigininAction',routes.sigininAction);
app.post('/sigininSocialAction',routes.sigininSocialAction);
app.get('/profileview',routes.profileview);

app.get('/getProfileupdateStatus',routes.getProfileupdateStatus);

app.get('/logout',routes.logoutWriter);

app.post('/submitArticletoContentful',routes.submitArticletoContentful);

app.post('/profileformSubmit',routes.profileformSubmit);

app.post('/updateCategory',routes.updateCategory);

http.createServer(app).listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
