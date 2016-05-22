angular.module('starter.controllers', ['ngStorage'])

.controller('AppCtrl', function($scope, $state, $http, $localStorage, $window) {

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

    if (angular.isDefined($localStorage.currentUser)) {
        $scope.logged = true;
    }
    else {
        $scope.logged = false;
    }
    if (angular.isDefined($localStorage.currentUser)) {
        $scope.currentUser = $localStorage.currentUser;
    }

    $scope.logout = function () {
        $localStorage.$reset();
        $state.go('app.login');
        $window.location.reload(true);
    };

})
    .controller('RegisterController', function($scope, $http, $state, $ionicPopup){
        $scope.apilink = "http://eliesmakhlouf.com/API/";

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
                                    $scope.error = "Ce compte existe déjà";
                                }
                            }
                        );
                }
            }else{
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs !",
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
        }
    })


    .controller('LoginController', function($scope, $http, $state, $localStorage, $window){
        $scope.apilink = "http://eliesmakhlouf.com/API/";

        if (angular.isDefined($localStorage.currentUser)) {
            $state.go('app.profil');
        }

        $scope.userData = {};

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
                            $state.go('app.profil');
                            $window.location.reload(true);
                            $scope.UserDate = {};
                            $localStorage.currentUser = response.user;
                            console.log($localStorage.currentUser);
                        },
                        function () {
                            console.warn('ERROR REGISTER');
                            $scope.userData = {};
                        });
            }else{
                $scope.error = "Veuillez remplir tous les champs"
            }
        };
    })

    .controller('ProfilController', function($scope, $http, $state, $localStorage, $window){
        $scope.users = [];
        $http.post($scope.apilink + "User/UserController.php", {
                type : "user",
                action : "findAll"
            })
            .then(function(res){
                    var response = res.data;
                    $scope.users = response;
                    console.log($scope.users);
                },

                function(error){
                    console.log(error)
                });
    });
