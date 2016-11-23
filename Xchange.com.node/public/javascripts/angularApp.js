'use strict';

// Declare app level module which depends on views, and components
/*angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
*/


angular.module('myApp',['ui.router'] )
    .factory('auth', ['$http', '$window', function($http, $window){
        var auth = {};

        auth.saveToken = function (token){
            $window.localStorage['xchange-token'] = token;
        };

        auth.getToken = function (){
            return $window.localStorage['xchange-token'];
        };

        auth.isLoggedIn = function(){

            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function(){
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.currentUserId = function(){
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload._id;
            }
        };

        auth.register = function(user){
            return $http.post('/register', user).success(function(data){
                auth.saveToken(data.token);
            });
        };

        auth.logIn = function(user){
            return $http.post('/login', user).success(function(data){
                auth.saveToken(data.token);
            });
        };

        auth.logOut = function(){
            $window.localStorage.removeItem('xchange-token');
        };

        return auth;
    }])
    .factory('posts', ['$http','auth',  function($http , auth){
  var o = {
      posts: [],
      rposts: [],
      xchangeComments:[]
  };

    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    o.getAllByISBN = function(searchBy , findText) {
        return $http({
            url: '/search',
            method: "GET",
            params: { searchBy: searchBy,
                      findText: findText}
        }).success(function(data){
            angular.copy(data, o.posts);
        });
    };

        o.getRecommendPosts = function(id) {
            //id = auth.currentUser()._id;
            return $http.get('/users/' + id + '/posts').success(function(data){
                angular.copy(data, o.rposts);
                console.log("url output"+ o.rposts);
            });
        };

    o.create = function(post) {
        return $http.post('/posts', post, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            o.posts.push(data);
        });
    };

    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                post.upvotes += 1;
                post.status = 'Deal Done';
            });
    };
        o.upvotebyId = function(id) {
            return $http.put('/posts/' + id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                post.upvotes += 1;
                post.status = 'Deal Done';
            });
        };

    o.update = function(post) {
        return $http.put('/posts/' + post._id)
            .success(function(data){
                post.upvotes += 1;
                post.status = 'sold';
            });
    };


    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    o.getAllCommentsByPost = function(id){
        return $http.get('/posts/' + id + '/comments').success(function(data){
            console.log("i'm in comments by post"+data);
            angular.copy(data, o.xchangeComments);
            console.log("i'm in comments by post"+o.xchangeComments);
            //return res.data;
        });
    };

    o.addComment = function(id, comment) {
        console.log("add Comment" + id);
        console.log("comment"+comment.post);
        console.log("asdf"+comment.bookId);
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        });
    };



    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                comment.upvotes += 1;
                comment.xchangeBookStatus = 'Deal Done';
                post.status = 'Deal Done';
            });
    };
        return o;


    }])
    . factory('comments', ['$http','auth',  function($http , auth){
        var c = {
            comments: []
        };


        c.getOtherInterested = function() {
            return $http.get('/comments/posts/'+ post._id).success(function(data){
                angular.copy(data, o.posts);
            });
        };

        return c;

    }])
.controller('MainCtrl', [
  '$scope',
  'posts',
    'auth',
  function($scope,posts , auth){
    $scope.test = 'Hello world!';
    $scope.posts = [];

      $scope.addPost = function(){
          if(!$scope.title || $scope.title === '') { return; }
          posts.create({
              title: $scope.title,
              description: $scope.description,
              bookAuthor: $scope.bookAuthor,

              ISBN: $scope.ISBN,
              link: $scope.link
              
          });
          $scope.title = '';
          $scope.description = '';
          $scope.bookAuthor = '';
          $scope.ISBN = '';
          $scope.link = '';

      };

      $scope.incrementUpvotes = function(post) {
          posts.upvote(post);
      };

      $scope.posts = posts.posts;
      console.log('scope' +$scope.posts);

      $scope.isLoggedIn = auth.isLoggedIn;
  }])

.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    'auth',
    'comments',
    function($scope, posts, post, auth, comments){
        $scope.post = post;

        $scope.addComment = function(x){
         //   if($scope.body === '') { return; }
            posts.addComment(post._id, {
                bookId: x,
                body: $scope.body,
                author: auth.currentUser(),
                xchangeBookStatus: 'intersted'
            }).success(function(comment) {
                $scope.post.comments.push(comment);
                $scope.xchangeComments1.push(comment);

            });
            posts.updateInterstedPosts(x,{
               interstedPosts: posts.status
            });
            $scope.bookId = '';
            $scope.body = '';
            $scope.status = '';
            $scope.xchangeBookStatus = '';

        };

        $scope.incrementUpvotes = function(comment){
            console.log("increment"+post);
            posts.upvoteComment(post, comment);
            posts.upvote(post);
            posts.upvote(comment.bookId);
        };

        $scope.posts = posts.posts;
        posts.getAllCommentsByPost(posts._id);
        $scope.xchangeComments1 = posts.xchangeComments;
        console.log("xchangecomments"+ posts.xchangeComments);

        $scope.comments = comments.comments;

        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser();
        console.log("user" + $scope.currentUser );

    }])
    .controller('AuthCtrl', [
        '$scope',
        '$state',
        'auth',
        function($scope, $state, auth){
            $scope.user = {};

            $scope.register = function(){
                auth.register($scope.user).error(function(error){
                    $scope.error = error;
                }).then(function(){
                    $state.go('home');
                });
            };

            $scope.logIn = function(){
                auth.logIn($scope.user).error(function(error){
                    $scope.error = error;
                }).then(function(){
                    $state.go('home');
                });
            };
        }])
    .controller('NavCtrl', [
        '$scope',
        'auth',
        function($scope, auth){
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logOut;
        }])
    .controller('RecommendCtrl', [
        '$scope',
        'posts',
        function($scope, posts){
            posts.getRecommendPosts('581d99bf77c830156c35d34e');
            $scope.recommendPosts = posts.rposts;
            console.log("recommendation" + $scope.recommendPosts);
        }])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                        postPromise: ['posts', function(posts){
                        console.log('state'+posts.getAll());
                        return posts.getAll();
                    }],
                         recommendPosts: [ 'posts', function( posts) {
                         return posts.getRecommendPosts('581d99bf77c830156c35d34e');
                     }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'posts', function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }],

                    x: ['$stateParams', 'posts', function($stateParams, posts) {
                        return posts.getAll();
                    }],
                    xchangeComments1: ['$stateParams', 'posts', function($stateParams, posts) {
                        return posts.getAllCommentsByPost($stateParams.id);
                    }]
                }
            })
            .state('search', {
                url: '/search?findText&searchBy',
                templateUrl: '/search.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['$stateParams','posts', function($stateParams ,posts){
                        return posts.getAllByISBN($stateParams.searchBy ,$stateParams.findText );
                    }]
                }
            })



            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });


        $urlRouterProvider.otherwise('login');
    }])
  .
//camel cased directive name
//in your HTML, this will be named as bars-chart
directive('barsChart', function ($parse) {
    //explicitly creating a directive definition variable
    //this may look verbose but is good for clarification purposes
    //in real life you'd want to simply return the object {...}
    var directiveDefinitionObject = {
        //We restrict its use to an element
        //as usually  <bars-chart> is semantically
        //more understandable
        restrict: 'E',
        //this is important,
        //we don't want to overwrite our directive declaration
        //in the HTML mark-up
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {data: '=chartData'},
        link: function (scope, element, attrs) {
            //in D3, any selection[0] contains the group
            //selection[0][0] is the DOM node
            //but we won't need that this time
            var chart = d3.select(element[0]);
            //to our original directive markup bars-chart
            //we add a div with out chart stling and bind each
            //data entry to the chart
            chart.append("div").attr("class", "chart")
                .selectAll('div')
                .data(scope.data).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d + "%"; })
                .text(function(d) { return d + "%"; });
            //a little of magic: setting it's width based
            //on the data value (d)
            //and text all with a smooth transition
        }
    };
    return directiveDefinitionObject;
});

function Ctrl($scope) {
    $scope.myData = [10,20,30,40,60, 80, 20, 50];
};







