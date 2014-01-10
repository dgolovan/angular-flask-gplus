'use strict';

/* Controllers */

/*
function SigninController($scope) {
	$scope.welcome_str = "";
	$scope.signinCallback = function(authResult) {
		console.log("signinCallback!");
    if (authResult['access_token']) {
    	// User successfully authorized the G+ App!
    	$scope.access_token = authResult['access_token'];
    	gapi.auth.setToken("token", $scope.access_token);
    	gapi.client.load('plus','v1', function(){
        var request = gapi.client.plus.people.get({
         'userId': 'me'
        });
        request.execute(function(resp) {
          var identity = resp;
          if(resp.displayName == "Denis Denisenko"){
          	$scope.welcome_str = 
            "<a href='"+resp.url+"'><image style='height:30px;'  class='img-rounded' src='"+resp.image.url+"' /></a>"+ 
            "<span class='welcome-box'>Welcome,<br /><a href='"+resp.url+"'>"+resp.displayName +"</a></span>";
            $scope.$apply();
          }
          //console.log($scope);
        });
      });
      
    } 
    else if (authResult['error']) {
      $scope.welcome_str = "Authorization Error";
    }

	};
	window.signinCallback = $scope.signinCallback;
}*/

function MenuController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}

function IndexController($scope) {
	
}


function PostListController($scope, Post) {
	$scope.posts = Post.query();
}

function PostController($scope, $routeParams, Post, $location){
	
	var slug = $routeParams.slug;
	if(slug){
		$scope.post = Post.get({ slug: slug });
	}else{
		$scope.post = {};
	}
		
}

function PostEditController($scope, $routeParams, Post, $location){
	
	var slug = $routeParams.slug;
	if(slug){
		$scope.post = Post.get({ slug: slug });
	}else{
		$scope.post = {};
	}
	
	
	$scope.savePost = function () {
    if (slug){
        $scope.post.$update({slug: slug});
    }else{
    		Post.create($scope.post);
    }
    $location.path('/blog');
  }

  $scope.deletePost = function () {
    $scope.post.$delete({slug: slug}, function() {
        alert('Post ' + post.title + ' deleted')
  		$location.path('/blog');
    });
  }

  $scope.cancel = function () {
  	$location.path('/blog');
  }

}


//Google Plus
//Simply get a list of all public activities and then use the G+ embed feature for displaying the actual posts
function GPlusActivitiesController($scope, $http) {
	$scope.activities = '';

	$http.jsonp('https://www.googleapis.com/plus/v1/people/[YOUR_ACCOUNT]/activities/public?key=[YOUR_PUBLIC_KEY]&callback=JSON_CALLBACK').success(function(data) {
    	
    	//$scope.activities = data.items;
  		for(var i=0; i < data.items.length; i++){
  			var item = '<div class="g-post" data-href="' + data.items[i].url + '"></div>';
  			
  			
			console.log(item);
  			$scope.activities += item;
  		}
  	});
}