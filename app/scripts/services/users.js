'use strict';
angular.module('sbAdminApp').factory('Users', function(Helper, $http, httpi, $q, APP_CONFIG) {
    return {
        list: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.list;
            var data = {
                page: page,
                limit: limit
            };
            httpi({
                method: 'GET',
                url: url,
                data: data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        get: function(id){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.get;
            httpi({
                method: 'GET',
                url: url,
                data: {
                    id: id
                }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        register: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.create;
            httpi({
                method: 'POST',
                url: url,
                data: data,
                transformRequest: Helper.transformRequestEncodeURI,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        activate: function(token){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.activate;
            $http({
                method: 'POST',
                url: url,
                data: { token: token },
                transformRequest: Helper.transformRequestEncodeURI,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        update: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.update;
            httpi({
                method: 'PUT',
                url: url,
                data: data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        login: function(username, password){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.login;
            $http({
                method: 'POST',
                url: url,
                data: { username: username, password: password },
                transformRequest: Helper.transformRequestEncodeURI,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                // login success
                deferred.resolve(data);
            }).error(function(data){
                // login fails
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
});
