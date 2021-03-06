'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginCtrl', function($scope, Users, $cookies, $location, $rootScope) {
        var vm = this;
        // logout before login
        $rootScope.user_info = {};
        $cookies.remove('user_info');
        $cookies.remove('appConfig');
        vm.login = function login(){
            Users.login(vm.username, vm.password).then(function(data){
                $rootScope.user_info = data;
                $cookies.put('user_info', JSON.stringify(data));
                vm.error = null;
                $location.path('dashboard/home');
            }).catch(function(){
                vm.error = 'Access Denied!';
            });
        };
    });
