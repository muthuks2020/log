(function (app) {
  	'use strict';

	angular
		.module('article')
		.config(config)
		.controller('ArticleController', ArticleController);

	function config($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('article', {
				url: '/article',
				templateUrl : 'angular/article/article.html',
				controller: 'ArticleController',
				controllerAs: 'vm'
			})
	}

	function ArticleController($scope, $cookies, $state) {
		var vm = this;
		vm.client = null;
		vm.init = init;
		vm.form = {};
		vm.submitArticle = submitArticle;
		vm.logout = logout;

		/* init */
		vm.init();

		/* functions */
		function logout() {
			$cookies.remove('writerId');
			$state.transitionTo('register');
		}

		function submitArticle() {
			vm.client.getSpace(app.config.contentfulSpaceID)
				.then((space) => {
					space.createEntry('article', {
				     	fields: {
				       		title: {
								'en-US': vm.form.title
				       		},
				       		content: {
				       			'en-US' : vm.form.text
				       		},
				       		writer: {
				       			'en-US' : {
		       						"sys": {
										"type": "Link",
										"linkType": "Entry",
										"id": $cookies.get('writerId')
							        }
							    }
				       		}
				     	}
				   	})
				   	.then((user) => {
			   			alert('article submitted');
			   			$scope.$apply(function () {
				   			vm.field = {};
				   		});
				   	})
				})
		}

		function init() {
			if(!$cookies.get('writerId')) {
				$state.transitionTo('register');
				return;
			}

			vm.client = contentfulManagement.createClient({
			  accessToken: app.config.contentfulManagementAccessToken
			})
		}
	}
}(ApplicationConfiguration));
