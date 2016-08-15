'use strict';

// Declare app level module which depends on views, and components
angular.module('cleanUI', [
    'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    $routeProvider.when('/:section/:page', {
        template: '<div ng-include="include"></div>',
        controller: 'DynamicRouteCtrl'
    });

    $routeProvider.otherwise({redirectTo: 'dashboards/index.html'});

}]).
controller('DynamicRouteCtrl', function($scope, $routeParams) {

    // Dynamically include templates
    $scope.include = $routeParams.section + '/' + $routeParams.page;

}).
directive('leftMenu', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', '.left-menu-link', function() {

                if ($(this).attr('href') !== 'javascript: void(0);') {

                    $('.left-menu-list-active').removeClass('left-menu-list-active');
                    $(this).closest('li').addClass('left-menu-list-active');

                    if (!$(this).closest('.left-menu-list-submenu').length) {

                        $('.left-menu-list-opened > a + ul').slideUp(200, function(){
                            $('.left-menu-list-opened').removeClass('left-menu-list-opened');
                        });

                    }

                }

            });
        }
    };
});