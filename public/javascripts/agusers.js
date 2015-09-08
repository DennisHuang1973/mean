/**
 * Created by DennisHuang on 15/08/25.
 */

angular.module('userApp', ['ngResource', 'userServices', 'ngRoute'])

//.controller('UserController', ['$scope', '$http','$resource', function($scope, $http, $resource){
.controller('UserController', ['$scope', '$http', 'User', function($scope, $http, User){
    //var resUsers = $resource(
    //    '/users/api',
    //    {id: '@id'}, {
    //    'query': {
    //        method: 'GET',
    //        params: {isArray: false}
    //    },
    //    'update':{
    //        method: 'PUT'
    //    }
    //});

    //var resUsers = User.resource ;
    //var User =  UserS ;
    var getUsers = function(){
        //resUsers.query(function(data){
        User.getAll(function(data){
            if (data.result){
                $scope.users = data.users ;
            }
            else {
                $scope.users = null ;
            };
        })
    };
    //var getUsers = User.getAll(function())

    $scope.delUser = function(event, id) {
        //resUsers.remove({id: id},function(data){
        User.delete({id: id},function(data){
            if (data){
                window.location.reload();
            }
            else {
                alert(data.message);
            };
        })
    };

    $scope.addUser = function(data){
        var username = $('#username').val();
        var password = $('#password').val();
        var newuser = {username: username, password: password} ;
        //resUsers.save(newuser, function(data){
        User.add(newuser, function(data){
            if (data.result){
                window.location.reload();
            }
            else {
                alert(data.message);
            };
        });
    };

    $scope.updateUser = function(user){
        //resUsers.update(user, function(data){
        User.update(user, function(data){
            if (data.result){
                window.location.reload();
            }
            else {
                alert(data.message);
            };
        });
    };

    //var getUsers = function(){
    //    var req = $http.get("/users/all");
    //
    //    req.then (function(res){
    //        var data = res.data ;
    //        if (data.result){
    //            $scope.users = data.users ;
    //        }
    //    });
    //
    //    return null ;
    //};
    //
    //$scope.delUser = function(event, id){
    //    $http.delete("/users/",{params:{id: id}})
    //        .then(function(res){
    //            var data = res.data ;
    //            if (data.result){
    //                window.location.reload();
    //            }
    //            else {
    //                alert(data.message);
    //            };
    //    })
    //};

    $scope.editUser = function(event, id){
        $scope.isView = false ;
        $scope.isEdits[id] = true ;
    };

    $scope.cancelEdit = function(event, id){
        $scope.isView = true ;
        $scope.isEdits[id] = false ;
    };

    $scope.isView = true ;
    $scope.isEdits  = {};
    $scope.init = function(){
        getUsers();
    };

    $scope.today = new Date() ;
    $scope.init();

}])
.directive('myUser', function(){
    return {
        restrict:'E',
        transclude: true,
        templateUrl: function(elem, attr){
            return '/html/' + attr.temp + '.html';
        }
    }
})
.directive('myUserc', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: false,
        templateUrl: function(elem, attr){
            return '/html/' + attr.temp + '.html';
        },
        compile: function(tElement, tAttrs){
            console.info("compile start!");

            return {
                pre: function preLink(scope, element, attributes) {
                    console.info("call pre link, watchers: " + scope.$$watchersCount);
                    element.on('click', 'a.edit', function(){
                        //scope.isView = false;
                        scope.isEdits[scope.user._id] = true;
                        scope.$apply();
                    });

                    element.on('click', 'a.cancel', function(){
                        //scope.isView = true;
                        scope.isEdits[scope.user._id] = false;
                        scope.$apply();
                    });

                    element.on('click', 'a.delete', function(event){
                        scope.delUser(event, scope.user._id);
                    });
                },

                post: function postLink(scope, element, attributes) {
                    console.info("call post link, watchers: " + scope.$$watchersCount);
                    //element.find('a.edit').on('click', function () {
                    //    scope.isView = false;
                    //    scope.isEdits[scope.user.id] = true;
                    //})
                    element.on('click', 'a.ok', function(event){
                        //save data
                        var username = $(event.target).parent().children("input").val();
                        scope.user.username = username ;
                        scope.updateUser(scope.user);
                        scope.isEdits[scope.user._id] = false;
                        scope.$apply();
                    });
                }
            }
        },
        //link: function(scope, element, attributes, controller){
        //    element.on('click', 'a.edit', function(){
        //        //scope.isView = false;
        //        scope.isEdits[scope.user._id] = true;
        //        scope.$apply();
        //    });
        //
        //    element.on('click', 'a.cancel', function(){
        //        //scope.isView = true;
        //        scope.isEdits[scope.user._id] = false;
        //        scope.$apply();
        //    });
        //}
    }
})
.directive('mySvg', function(){
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        template: '<rect height="100" width="100" style="fill: #ff00ff"></rect>',
        replace: true
    }
})
.filter('star', function(){
        return function(input) {
            if (input.startsWith('a')){
                return '*' + input ;
            }
            return input ;
        }
    })
.config(['$routeProvider',
        function($routeProvider){
            $routeProvider
                .when('/', {
                    templateUrl: '/html/userlist.html'
                })
                .when('/add',{
                    templateUrl: '/html/useradd.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
}]);