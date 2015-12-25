"use strict"

var app = angular.module("lottery",[]);
app.controller('main', ['$scope','$http','$timeout', function($scope, $http, $timeout){
    $scope.data = [];
    $scope.username = $('#username').text();
    $scope.gender = parseInt($('#gender').text());
    $scope.ttarget = false;

    $scope.dropdown = [];
    //check if targeted
    $scope.check = function(){
        $http({
            method: 'GET',
            url: 'http://pandora-dev.migocorp.com:12345/health/sex/check/'+ $scope.username +'/'
        }).then(function successCallback(response) {
            var data = response.data;
            if (data.Code == 1){
                $scope.disabled = false;
                $scope.Message = "Dear " + $scope.username +",你已經抽過籤了"
                $scope.warming = true;
            }else{
                $scope.disabled = true;
                $scope.warming = false;
            }
        }, function errorCallback(response) {
        });
    }
    var g = 0;
    if($scope.gender == 1){ g = 0;}else{g = 1;}
    $http({
        method: 'GET',
        url: 'http://pandora-dev.migocorp.com:12345/health/sex/merry/'+ g +'/'
    }).then(function successCallback(response) {
        var n = 1;
        var data = response.data;
        for (var x in data){
            var imgsrc = data[x].img;
            $scope.dropdown.push({
                'id':n,
                'name': data[x].name,
                'url': 'http://pandora-dev.migocorp.com:12345/static/images/' + imgsrc,
                'status':0
            });
            n ++;
        }
        $scope.dropdown.sort();
    }, function errorCallback(response) {
    });
    $scope.getlist = function(){
        $scope.data = [];
        $http({
            method: 'GET',
            url: 'http://pandora-dev.migocorp.com:12345/health/sex/merry/'+ $scope.gender +'/'
        }).then(function successCallback(response) {
            var n = 1;
            var data = response.data;
            for (var x in data){
                var imgsrc = data[x].img;
                if (data[x].img == 'Null'){
                    var rr = Math.floor(Math.random()*100);
                    var f = rr%5;
                    imgsrc = (f + 1).toString() + '.jpg';
                }
                $scope.data.push({
                    'id':n,
                    'name': data[x].name,
                    'url': 'http://pandora-dev.migocorp.com:12345/static/images/' + imgsrc,
                    'status':0
                });
                n ++;
            }
        }, function errorCallback(response) {
        });
    }
    $scope.is_start = false;
    $scope.result = "";
    $scope.add = function () {
        var last_id = getLastId();
        $scope.data.push({id:last_id,name:$scope.value,status:0})
    }
    $scope.del = function (id) {
        angular.forEach($scope.data,function(value, key) {
            if (id == value.id) {
                $scope.data.splice(key,1);
            };
        });
    }
    $scope.start2 = function(name) {
        $scope.username = name;
        $('#first').text(name);
        var url = 'http://pandora-dev.migocorp.com:12345/health/sex/q/' + $scope.username + '/';

        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            var data = response.data;
            $scope.gender = data[0].sex;
            $scope.getlist();
            $scope.check();
        }, function errorCallback(response) {
        });
    }
    $scope.start = function() {
        if ($scope.is_start) alert("");
        $scope.is_start = true;
        var queue = []; //滚动队列
        var circle = 1;
        var select_key = 0; //中奖的KEY
        //随机
        select_key = Math.floor(Math.random()*$scope.data.length);
        gettarget($scope.username, $scope.gender);
        var speed = 30;
        //滚动
        var next = function(key) {
            $scope.data[key].status = true;
            if ((key-1)>=0)
                $scope.data[key-1].status = false;
            if (key==0)
                $scope.data[$scope.data.length-1].status = false;
            var timer = $timeout(function() {
                //if (circle <=0 && select_key == key) {
                if (circle <=0 && $scope.target == $scope.data[key].name){
                    //alert("中了,主人是:"+$scope.data[key].name);
                    $scope.ttarget = true;
                    $scope.urls = $scope.data[key].url;
                    $scope.imgshow = true;
                    $("#master").attr({
                          src: $scope.urls,
                          });
                    $scope.result = $scope.data[key].name;
                    $scope.is_start = false;
                    return;
                };
                if ($scope.data.length == key+1){
                    speed += 50;
                    circle--;
                }
                if ($scope.data[key+1]) {
                    next(key+1)
                }else{
                    next(0)
                }
            },speed);
        }
        next(0);
    }
    /******私有方法 ***********/
    function gettarget(name, gender){
        var url = "http://pandora-dev.migocorp.com:12345/health/sex/target/"+name+"/"+gender+"/";
        name = '';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            var data = response.data;
            if (data.Code == 0){
                $scope.target = data.DATA.target;
            }
            
        }, function errorCallback(response) {
        });
    }
    function getLastId() {
        var id = 0;
        angular.forEach($scope.data,function(value, key) {
            if (id < value.id)
                id = value.id
            });
            return ++id;
    }
}]);
