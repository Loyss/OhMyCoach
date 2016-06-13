// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'ngCordova'])

    .run(function($ionicPlatform, $rootScope, $timeout) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            /*window.plugin.notification.local.onadd = function (id, state, json) {
                var notification = {
                    id: id,
                    state: state,
                    json: json
                };
                $timeout(function() {
                    $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
                });
            };*/

            // Enable to debug issues.
            // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            var notificationOpenedCallback = function(jsonData) {
                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };

            window.plugins.OneSignal.init("7aeecdfd-9e70-4e0a-9aa5-87b8381bb2f6",
                {googleProjectNumber: "698431587597"},
                notificationOpenedCallback);

            // Show an alert box if a notification comes in when the user is in your app.
            window.plugins.OneSignal.enableInAppAlertNotification(true);

            var push = new Ionic.Push({
                "debug": true
            });

            push.register(function(token) {
                console.log("Device token:",token.token);
                push.saveToken(token);  // persist the token in the Ionic Platform
            });
            
        });
    })


    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent' : {
                        templateUrl: 'templates/register.html',
                        controller: "RegisterController"
                    }
                }
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: "LoginController"
                    }
                }
            })
            .state('app.profil', {
                url: '/profil',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profil.html',
                        controller: "ProfilController"
                    }
                }
            })
            .state('app.form', {
                url: '/form',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/form.html',
                        controller: "FormController"
                    }
                }
            })
            .state('app.form2', {
                url: '/form2',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/form2.html',
                        controller: "FormController"
                    }
                }
            })
            .state('app.form3', {
                url: '/form3',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/form3.html',
                        controller: "FormController"
                    }
                }
            })
            .state('app.result', {
                url: '/result',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/result.html',
                        controller: "ResultsController"
                    }
                }
            })
            .state('app.program', {
                url: '/program',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/program.html',
                        controller: "ProgramController"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    });

