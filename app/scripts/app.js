'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
.module('sbAdminApp')
.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider', '$httpProvider',
        function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $httpProvider) {

    $ocLazyLoadProvider.config({
        debug:false,
        events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
    .state('login',{
        templateUrl:'views/pages/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        url:'/login',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/login.js',
                            'scripts/services/users.js'
                        ]
                    });
            }
        }
    })
    .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        name:'sbAdminApp',
                        files:[
                            'scripts/directives/header/header.js',
                            'scripts/directives/header/header-notification/header-notification.js',
                            'scripts/directives/sidebar/sidebar.js',
                            'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                            'scripts/services/httpi.js'
                        ]
                    });
            }
        }
    })
    .state('dashboard.home',{
        url:'/home',
        templateUrl:'views/dashboard/home.html',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:[
                        'scripts/directives/timeline/timeline.js',
                        'scripts/directives/notifications/notifications.js',
                        'scripts/directives/chat/chat.js',
                        'scripts/directives/dashboard/stats/stats.js'
                    ]
                });
            }
        }
    })
    .state('dashboard.users',{
        templateUrl:'views/users/list.html',
        controller:'UserCtrl',
        url:'/users/:page/:limit',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:[
                        'scripts/controllers/users.js',
                        'scripts/services/users.js',
                    ]
                });
            }
        }
    });
    $httpProvider.interceptors.push('httpRequestInterceptor');
}])
.run(['$location', '$cookies', '$rootScope', function($location, $cookies, $rootScope){
    // keep user logged in after page refresh
    var user_info = $cookies.get('user_info') || '{}';
    $rootScope.user_info = JSON.parse(user_info);
    $rootScope.$on('$locationChangeStart', function () {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $location.path() !== '/login';
        var loggedIn = ($rootScope.user_info)? $rootScope.user_info.access_token: false;
        if (restrictedPage && !loggedIn){
            $location.path('/login');
        }
    });
    $rootScope.$on('unauthorized', function() {
        $location.path('/login');
    });
}])
.factory('httpRequestInterceptor', function ($rootScope, $cookies) {
    return {
        request: function (config) {
            var user_info = $cookies.get('user_info') || '{}';
            $rootScope.user_info = JSON.parse(user_info);
            config.headers.Authorization = 'Basic ' + $rootScope.user_info.access_token;
            return config;
        },
        responseError: function(response){
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        }
    };
});
