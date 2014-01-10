'use strict';

angular.element(document).ready(function() {
   angular.module('AngularFlask', ['angularFlaskServices', 'angularFlaskFilters', 'ngSanitize', 'directive.gsignin', 'directive.gsigninUpdate', 'directive.newlinesConvert'])
   	.config(['$routeProvider', '$locationProvider',
			function($routeProvider, $locationProvider) {
				$routeProvider
				.when('/', {
					templateUrl: 'static/partials/landing.html',
					controller: IndexController
				})
				
				.when('/posts', {
					templateUrl: 'static/partials/post-list.html',
					controller: PostListController
				})
				/* Create a "/blog" route that takes the user to the same place as "/post" */
				.when('/blog', {
					templateUrl: 'static/partials/post-list.html',
					controller: PostListController
				})
				.when('/post/:slug', {
					templateUrl: '/static/partials/post-detail.html',
					controller: PostController
				})
				/* Admin routes */
				.when('/admin/post/add', {
					templateUrl: '/static/partials/post-edit.html',
					controller: PostEditController
				})
				.when('/admin/post/:slug', {
					templateUrl: '/static/partials/post-edit.html',
					controller: PostEditController
				})
				// .when('/admin/post/delete/:url', {
				// 	templateUrl: '/static/partials/post-edit.html',
				// 	controller: PostController
				// })

				.when('/plus', {
					templateUrl: 'static/partials/gplus-posts.html',
					controller: GPlusActivitiesController
				})
				.otherwise({
					redirectTo: '/'
				});

				$locationProvider.html5Mode(true);
			}
	]);
  //Manual bootstrap 	
  angular.bootstrap(document, ['AngularFlask']);
});