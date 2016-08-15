var appUnipaper = angular.module("uniPaper", ["ngRoute"]);

//OAuth.initialize('LBntk8TZAhSwyEFcqSeX0UtUVg8');


appUnipaper.config(function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl : "templates/loginform.htm",
          	controller: 'signinCtrl'
		})
		.when("/signup", {
			templateUrl : "templates/signupform.htm",
          	controller: 'signupCtrl'
		})
});

appUnipaper.controller('signinCtrl', ['$scope', '$rootScope','authencationService', function($scope, $rootScope,authencationService)
{
	// create a blank object to handle form data.
	$scope.loginform = {};
	$scope.signupform = function() 
	{
		window.location.href= "#/signup";
	}

	$scope.submitLoginForm = function()
	{
		authencationService.signinForm($scope.loginform).then(function(response) 
		{
			if(response.code == 1)
			{
				window.location.href = "/storyview";
			}
			$scope.loginform = {};
			$scope.loginform = null;
		});
	}

	$scope.register = function(social) 
	{
		    lock.show();

		/*
		OAuth.popup(social).then(function(result) 
		{
			return result.me();
		}).done(function(me) {
			var userid = me.id;
			var name = me.name;
			authencationService.signinSocialForm(userid,name).then(function(response) 
			{
				if(response.code)
				{
					window.location.href = "/storyview";
				}
				else
				{
					alert("User not created in server");
				}
			});

		}).fail(function(err) {
		console.log(err);
		});
		*/
	}

	var AUTH0_CLIENT_ID='9V74nXrFX6yN7klTGOlXmoqZMrvasm0H'; 
	var AUTH0_DOMAIN='unipaper-writers-portal.auth0.com'; 
	var AUTH0_CALLBACK_URL=location.href;

	var lock = new Auth0Lock(
	    // These properties are set in auth0-variables.js
	    AUTH0_CLIENT_ID,
	    AUTH0_DOMAIN,
	    {
	        auth: {
	            params: {scope: 'openid'}
	        }
	    }
	);

	lock.on("authenticated", function(authResult) {
		lock.getProfile(authResult.idToken, function(error, profile) {
			if (error) {
			// Handle error
			return;
		}

		localStorage.setItem('id_token', authResult.idToken);

		localStorage.setItem('profile', JSON.stringify(profile));
			showLoggedIn();
		});
	});

	var id_token = localStorage.getItem('id_token');
	if (id_token) {
	lock.getProfile(id_token, function (err, profile) {
	if (err) {
	return alert('There was an error getting the profile: ' + err.message);
	}
	document.getElementById('nick').textContent = profile.name;
	});
	}

	

}]);

appUnipaper.controller('signupCtrl', ['$scope', '$rootScope','authencationService', function($scope, $rootScope,authencationService)
{
  // create a blank object to handle form data.
  $scope.signinform = {};

  $scope.loginform = function() {
  	window.location.href= "/";
  }

  $scope.submitSignupForm = function()
  {  	
 	authencationService.saveSignupForm($scope.signinform).then(function(response) 
 	{
      alert(response.msg);
      if(response.code == 1){
      	window.location.href = "/storyview";
      }
      $scope.signinform = {};
      $scope.signinform = null;
    });
  }

}]);

