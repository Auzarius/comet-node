angular.module('comet', 
               [
                    'app.routes',
                    'ngAnimate',
                    'authService',
                    'mainCtrl',
                    'userCtrl',
                    'userService',
                    'ticketCtrl',
                    'ticketService',
                    'customerService'
               ])
     // application configuration to integrate token into requests
     .config(function($httpProvider) {

          // attach our auth interceptor to the http requests
          $httpProvider.interceptors.push('AuthInterceptor');

     });
