(function (app) {
  	'use strict';

	angular
		.module('account')
		.config(config)
		.controller('RegisterController', RegisterController);

	function config($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('register', {
				url: '/register',
				templateUrl : 'register.html',
				controller: 'RegisterController',
				controllerAs: 'vm'
			})

		//$urlRouterProvider.otherwise('/register');
	}

	function RegisterController($scope, $cookies, $state) {
		var vm = this;
		vm.client = null;
		vm.createWriter = createWriter;
		vm.form = {};
		vm.init = init;
		vm.register = register;

		/* init */
		vm.init();


		/* functions */
		function register(app) {
			if(app == 'email') {
		    	var fields = {
		       		name: {
						'en-US': vm.form.name
		       		},
		       		email: {
						'en-US': vm.form.email
		       		},
		       		password: {
						'en-US': vm.form.password
		       		}
		     	};
		     	vm.createWriter(fields);
				return;
			}
		    OAuth.popup(app).then(function(result) {
		        return result.me();
		    }).done(function(me) {
		    	var fields = {
		       		name: {
						'en-US': me.name
		       		}
		     	};
		     	if(app == 'twitter') {
		     		fields.twitterId = { 'en-US' : me.id };
		     		fields.twitterUsername = { 'en-US' : me.alias };
		     	} else if(app == 'facebook') {
			     	fields.facebookId = { 'en-US' : me.id };
			    }
				vm.createWriter(fields);
		    }).fail(function(err) {
			  // handle an error
			  console.log(err);
			});
		}

		function createWriter(fields) {
			vm.client.getSpace(app.config.contentfulSpaceID)
				.then((space) => {
					space.createEntry('writer', {
				     	fields: fields
				   	})
				   	.then((user) => {
	    				$cookies.put('writerId', user.sys.id);
				   		$state.transitionTo('article');
				   	})
				})
		}

		function init() {
			if($cookies.get('writerId')) {
				$state.transitionTo('article');
				return;
			}
			OAuth.initialize(app.config.oauth);
			vm.client = contentfulManagement.createClient({
			  accessToken: app.config.contentfulManagementAccessToken
			})
		}
	}
}(ApplicationConfiguration));
