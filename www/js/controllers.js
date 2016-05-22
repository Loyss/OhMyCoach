angular.module('starter.controllers', ['ngStorage'])

.controller('AppCtrl', function($scope, $state, $http, $sessionStorage, $window) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.apilink = "http://eliesmakhlouf.com/API/";
    $scope.userData = {};

    $scope.doRefresh = function() {
        $state.go($state.current, {}, {reload: true});
    };

    if (angular.isDefined($sessionStorage.currentUser)) {
        $scope.logged = true;
    }
    else {
        $scope.logged = false;
    }
    if (angular.isDefined($sessionStorage.currentUser)) {
        $scope.currentUser = $sessionStorage.currentUser;
    }

    $scope.logout = function () {
        $sessionStorage.$reset();
        $state.go('app.login');
        $window.location.reload(true);
    };

})
    .controller('RegisterController', function($scope, $http, $state, $ionicPopup){

        $scope.register = function() {
            if ($scope.userData.user_name && $scope.userData.user_password) {
                if ($scope.userData.user_name && $scope.userData.user_password) {
                    $http.post($scope.apilink + "User/UserController.php", {
                            type: "user",
                            action: "register",
                            user: {
                                user_name: $scope.userData.user_name,
                                user_password: $scope.userData.user_password
                            }
                        })
                        .then(function (res) {
                                var response = res.data;
                                if (response.success == true) {
                                    $ionicPopup.alert({
                                        title: "Success",
                                        button: [
                                            {
                                                text: 'Start Test',
                                                type: 'button-calm',
                                                onTap: function () {
                                                    $state.go('app.profil');
                                                    $scope.UserData = {};
                                                }
                                            }
                                        ]
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title:"Ce compte existe déjà",
                                        button:[
                                            {
                                                text: 'Ok',
                                                type: 'button-positive',
                                                onTap: function(){
                                                    $state.go('app.register');
                                                }
                                            }
                                        ]
                                    });
                                }
                            },
                            function(error) {
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
            }else{
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs",
                    button:[
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(){
                                $state.go($state.current);
                            }
                        }
                    ]
                });
            }
        }
    })


    .controller('LoginController', function($scope, $http, $state, $sessionStorage, $window, $ionicPopup){

        if (angular.isDefined($sessionStorage.currentUser)) {
            $state.go('app.profil');
        }


        $scope.viewRegister = function() {
            $state.go("app.register");
            $scope.error = "";
        };

        $scope.login = function() {
            if ($scope.userData.user_name && $scope.userData.user_password) {
                $http.post($scope.apilink + "User/UserController.php", {
                        type: "user",
                        action: "login",
                        user: {
                            user_name: $scope.userData.user_name,
                            user_password: $scope.userData.user_password
                        }
                    })
                    .then(function (res) {
                            var response = res.data;

                            if(response.success == true) {
                                $scope.userData = {};
                                $sessionStorage.currentUser = response.user;
                                $state.go('app.profil');
                                $window.location.reload(true);
                                console.log($sessionStorage.currentUser);
                            }else {
                                $scope.userData.user_password = "";
                                $ionicPopup.alert({
                                    title:"Identifiants incorrects",
                                    button:[
                                        {
                                            text: 'Ok',
                                            type: 'button-positive',
                                            onTap: function(){
                                                $state.go('app.login');
                                            }
                                        }
                                    ]
                                });
                            }
                    },
                        function () {
                            console.log('ERROR REGISTER');
                            $scope.userData = {};
                        });
            }else{
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs",
                    button:[
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(){
                                $state.go($state.current);
                            }
                        }
                    ]
                });
            }
        };
    })

    .controller('ProfilController', function($scope, $http, $state, $sessionStorage, $window){
        $scope.users = [];
        $http.post($scope.apilink + "User/UserController.php", {
                type : "user",
                action : "findAll"
            })
            .then(function(res){
                    var response = res.data;
                    $scope.users = response;
                },

                function(error){
                    console.log(error)
                });
    })
    .controller('FormController', function($scope, $http, $state, $sessionStorage, $window){
        $scope.viewForm2 = function() {
            $state.go("app.form2");
            $scope.error = "";
        };

        $scope.viewForm3 = function() {
            $state.go("app.form3");
            $scope.error = "";
        };
        $scope.viewResult = function() {
            $state.go("app.result");
            $scope.error = "";
        };
        $scope.viewProfil = function() {
            $state.go("app.profil", {}, {reload: true});
            $scope.error = "";
            $window.location.reload(true);
        };
    });
