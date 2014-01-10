'use strict';

/* Directives */

//Google+ Signin
angular.module('directive.gsignin', []).
  directive('gsignin', function () {
    return {
      restrict: 'E',
      template: '<span></span>',
      replace: true,
      link: function (scope, element, attrs) {
        
        // Set class.
        attrs.$set('class', 'g-signin');

        attrs.$set('data-clientid', attrs.clientid + '.apps.googleusercontent.com');

        // Some default values, based on prior versions of this directive
        var defaults = {
          callback: 'signinCallback',
          cookiepolicy: 'single_host_origin',
          requestvisibleactions: 'http://schemas.google.com/AddActivity',
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
          width: 'wide'
        };

        // Provide default values if not explicitly set
        angular.forEach(Object.getOwnPropertyNames(defaults), function(propName) {
          if (!attrs.hasOwnProperty('data-' + propName)) {
            attrs.$set('data-' + propName, defaults[propName]);
          }
        });

        // Asynchronously load the G+ SDK.
        (function() {
          var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
          po.src = 'https://apis.google.com/js/client:plusone.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
      }
    };
  });

//Google+ Signin Update the username
angular.module('directive.gsigninUpdate', []).
  directive('gsigninUpdate', function () {
  	
  	return {
  		restrict: 'A',
  		link: function(scope, el, attrs){
  			//var welcome_str = "";
				scope.$watch('welcome_str', function(newValue, oldValue){
					if(scope.welcome_str != ""){
						angular.element(document.querySelector('#signinButton')).addClass('hidden');
						el.html(scope.welcome_str);
					}
					else{
						angular.element(document.querySelector('#signinButton')).removeClass('hidden');
						el.html("");
					}
					// console.log("Welcome:");
					// console.log(scope.welcome_str);
				});
				
  		}
    };
  });

  angular.module('directive.newlinesConvert', []).
  directive('newlinesConvert', function () {
    
    return {
      restrict: 'A',
      link: function(scope, el, attrs){
        scope.$watch('post.body', function(newValue, oldValue){        
          if(scope.post.body){
            scope.post.body = scope.post.body.replace(/<br\s*\/?>/mg,"\n");
          }       
        });
        
      }
    };
  });
