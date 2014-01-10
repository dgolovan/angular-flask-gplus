'use strict';

angular.module('angularFlaskServices', ['ngResource'])
	.factory('Post', function($resource) {
		return 	$resource(
					'/api/post/:slug', 
					{}, 
					{
						query: {
							method: 'GET',
							params: { slug: '' },
							isArray: true
						},
						get: {
							method: 'GET',
							params: { slug: '' },
							isArray: false
						},
						create: {
							method: 'POST',
							params: { slug: '' },
							isArray: false
						},
						update: {
							method: 'PUT',
							params: { slug: '' },
							isArray: false
						},
						delete: {
							method: 'DELETE',
							params: { slug: '' },
							isArray: false
						}
					}
				);
});
