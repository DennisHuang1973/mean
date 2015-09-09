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
        }
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
.directive('myClock',['$interval','dateFilter', function($interval, dateFilter){
    return {
        link: function(scope, element, attrs){
            function updateTime(){
                element.text(dateFilter(new Date(), attrs.format, attrs.timezone));
            };
            //var filter = $filter('date')
            var stopTime = $interval(updateTime, 1000);

            element.on('$destroy', function() {
                $interval.cancel(stopTime);
            });
        }
    }
}])
.directive('myCanvasClock',['$interval', function($interval){
    return {
        template: '<canvas></canvas>',
        link: function(scope, element, attrs){
            var canvas = element.find('canvas')[0];
            var clockcolor = attrs.color || '#666' ;
            var clockwidth = attrs.width || 200 ;
            var clockheight = attrs.height || clockwidth ;
            canvas.width = clockwidth ;
            canvas.height = clockheight;
            var ctx = canvas.getContext('2d');
            //ctx.imageSmoothingEnabled = true;

            var radius = clockwidth / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90;

            function drawClock() {
                drawFace(ctx, radius);
                drawNumbers(ctx, radius);
                drawDate(ctx, radius);
                drawTime(ctx, radius);

            }

            function drawFace(ctx, radius) {
                var grad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2*Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();

                grad = ctx.createRadialGradient(0, 0, radius*0.95, 0, 0,radius*1.05);
                grad.addColorStop(0, clockcolor);
                grad.addColorStop(0.5, 'white');
                grad.addColorStop(1, clockcolor);
                ctx.strokeStyle = grad;
                ctx.lineWidth = radius*0.1;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
                ctx.fillStyle = clockcolor;
                ctx.fill();
            }

            function drawNumbers(ctx, radius) {
                var ang;
                var num;
                ctx.font = radius*0.15 + "px arial";
                ctx.textBaseline="middle";
                ctx.textAlign="center";
                for(num = 1; num < 13; num++){
                    ang = num * Math.PI / 6;
                    ctx.rotate(ang);
                    ctx.translate(0, -radius*0.85);
                    ctx.rotate(-ang);
                    ctx.fillText(num.toString(), 0, 0);
                    ctx.rotate(ang);
                    ctx.translate(0, radius*0.85);
                    ctx.rotate(-ang);
                }
            };

            function drawTime(ctx, radius){
                var now = new Date();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                //hour
                hour=hour%12;
                hour=(hour*Math.PI/6)+
                    (minute*Math.PI/(6*60))+
                    (second*Math.PI/(360*60));
                drawHand(ctx, hour, radius*0.5, radius*0.09);
                //minute
                minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
                drawHand(ctx, minute, radius*0.7, radius*0.07);
                // second
                second=(second*Math.PI/30);
                drawHand(ctx, second, radius*0.9, radius*0.02);
            };

            function drawHand(ctx, pos, length, width) {
                ctx.beginPath();
                ctx.lineWidth = width;
                ctx.lineCap = "round";
                ctx.moveTo(0,0);
                ctx.rotate(pos);
                ctx.lineTo(0, -length);
                ctx.stroke();
                ctx.rotate(-pos);
            };

            function drawDate(ctx, radius){
                var now = new Date();
                var month = now.getMonth()  + 1;
                var day = now.getDate();
                //ctx.strokeStyle = "#ff00ff";
                ctx.font = "21px serif";
                ctx.lineWidth = 1 ;
                var path = new Path2D;
                var w = radius * 0.4 ;
                path.rect(-w, -w, 2*w, 2*w);
                path.moveTo(-w, 0);
                path.lineTo(w, 0);
                path.moveTo(0, -w);
                path.lineTo(0, w);
                ctx.stroke(path);
                //ctx.strokeRect(-radius/3, -radius/3, 2*radius/3, 2*radius/3);
                month = ("0" + month).slice(-2);
                day = ("0" + day).slice(-2);

                ctx.fillText(month[0], -w/2, -w/2);
                ctx.fillText(month[1], w/2, -w/2);
                ctx.fillText(day[0], -w/2, w/2);
                ctx.fillText(day[1], w/2, w/2);
                //ctx.fillText(month, -radius/2, 0);
                //ctx.fillText(day, radius/2, 0);
            }

            function updateTime(){
                //element.text(dateFilter(new Date(), attrs.format, attrs.timezone));
                drawClock();
            };
            //var filter = $filter('date')
            var stopTime = $interval(updateTime, 1000);

            element.on('$destroy', function() {
                $interval.cancel(stopTime);
            });


        }
    }
}])

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