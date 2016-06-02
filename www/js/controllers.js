angular.module('starter.controllers', ['ngStorage', 'ionic-timepicker', 'ngCordova'])


.controller('AppCtrl', function($scope, $state, $http, $sessionStorage, $window, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.apilink = "http://eliesmakhlouf.com/API/";
    $scope.userData = {};
    $scope.users = [];
    $scope.coaches = [];


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
        $timeout(function(){
            $sessionStorage.$reset();
            $state.go('app.login');
            $window.location.reload(true);
        }, 200);

    };
})
    .controller('RegisterController', function($scope, $http, $state, $ionicPopup, $window){

        $scope.register = function() {
            if ($scope.userData.user_pseudo && $scope.userData.user_email && $scope.userData.user_password) {
                if ($scope.userData.user_pseudo && $scope.userData.user_email && $scope.userData.user_password) {
                    $http.post($scope.apilink + "User/UserController.php", {
                            type: "user",
                            action: "register",
                            user: {
                                user_pseudo: $scope.userData.user_pseudo,
                                user_email: $scope.userData.user_email,
                                user_password: $scope.userData.user_password
                            }
                        })
                        .then(function (res) {
                                var response = res.data;
                                if (response.success == true) {
                                    $ionicPopup.alert({
                                        title: "Inscription réussi",
                                        buttons: [
                                            {
                                                text: 'Connectez-vous',
                                                type: 'button-positive',
                                                onTap: function () {
                                                    $state.go('app.login');
                                                    $window.location.reload(true);
                                                }
                                            }
                                        ]
                                    });
                                }else {
                                    $ionicPopup.alert({
                                        title:"Ce compte existe déjà",
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


    .controller('LoginController', function($scope, $http, $state, $sessionStorage, $window, $ionicPopup, $timeout){

        if (angular.isDefined($sessionStorage.currentUser)) {
            $state.go('app.profil');
        }

        $scope.viewQuestion = function() {
            $state.go("app.form");
            $scope.error = "";
        };

        $scope.login = function() {
            if ($scope.userData.user_email && $scope.userData.user_password) {
                $http.post($scope.apilink + "User/UserController.php", {
                        type: "user",
                        action: "login",
                        user: {
                            user_email: $scope.userData.user_email,
                            user_password: $scope.userData.user_password
                        }
                    })
                    .then(function (res) {
                            var response = res.data;

                            if(response.success == true) {
                                $scope.userData = {};
                                $sessionStorage.currentUser = response.user;
                                $timeout(function(){
                                    $state.go('app.profil');
                                    $window.location.reload(true);
                                    console.log($sessionStorage.currentUser);
                                }, 300);
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

    .controller('ProfilController', function($scope, $http, $state, $sessionStorage, $ionicPopup){

        if($scope.logged == true){
            $http.post($scope.apilink + "Coach/CoachController.php", {
                    type : "coach",
                    action : "findAll"
                })
                .then(function(res){
                        var response = res.data;
                        $scope.coaches = response;
                    },

                    function(error){
                        console.log(error)
                    });
        }


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


        $scope.updateUser = function (){
            if($scope.userData.user_password && $scope.userData.user_password_confirm){
                if ($scope.userData.user_password == $scope.userData.user_password_confirm) {
                    $scope.error = "";

                    $http.post($scope.apilink+"User/UserController.php",
                        {
                            type : 'user',
                            action : 'update',
                            user: {
                                user_id : $sessionStorage.currentUser.user_id,
                                user_password : $scope.userData.user_password
                            }
                        })

                        .then(function (res){
                                var response = res.data;
                                $ionicPopup.alert({
                                    title: "Mot de passe modifié",
                                    buttons: [
                                        {
                                            text: 'Ok',
                                            type: 'button-positive',
                                            onTap: function () {
                                                $state.go($state.current, {}, {reload: true});
                                                $scope.userData = {};
                                            }
                                        }
                                    ]
                                });
                            },
                            function(error){
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
                else {
                    $ionicPopup.alert({
                        title:"Password doesn't match",
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
                    $scope.userData.user_password_confirm = "";
                }
            }
            else {
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

        $scope.deleteUser = function () {
            $ionicPopup.confirm({
                title: 'Supprimer mon compte ?',
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current, {}, {reload: true});
                        }
                    },
                    {
                        text: 'Oui',
                        type: 'button-assertive',
                        onTap: function () {
                            $http.post($scope.apilink + "User/UserController.php", {
                                    type: 'user',
                                    action: 'delete',
                                    user: {
                                        user_id: $sessionStorage.currentUser.user_id,
                                        user_email: $sessionStorage.currentUser.user_email
                                    }
                                })

                                .then(function (res) {
                                        var response = res.data;
                                        $scope.logout();


                                    }, function () {
                                        console.warn('ERROR DELETE PRODUCT');
                                    }
                                );
                        }
                    }
                ]
            });
        }
    })
    .controller('FormController', function($scope, $http, $state, $sessionStorage, $window, $rootScope){
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

        var sexeArray = ['homme', 'femme', 'peu importe'];
        var choixSexe = sexeArray[Math.floor(Math.random() * sexeArray.length)];
        console.log(choixSexe);

        if (choixSexe === "peu importe") {
            var sexeArray = ['homme', 'femme'];
            var choixSexe = sexeArray[Math.floor(Math.random() * sexeArray.length)];
            console.log(choixSexe);
        }

        var attitudeArray = ['ami', 'officier', 'peu importe'];
        var choixAttitude = attitudeArray[Math.floor(Math.random() * attitudeArray.length)];
        console.log(choixAttitude);

        if (choixAttitude === "peu importe") {
            var attitudeArray = ['ami', 'officier'];
            var choixAttitude = attitudeArray[Math.floor(Math.random() * attitudeArray.length)];
            console.log(choixAttitude);
        }

        function _choiceCoach() {

            if(choixSexe === "femme" && choixAttitude === "ami"){
                console.log('Jade');
            }else if (choixSexe === "femme" && choixAttitude === "officier"){
                console.log('Celine');
            }else if (choixSexe === "homme" && choixAttitude === "ami") {
                console.log('Arthur');
            }else{
                console.log('Bruce')
            }

        }
        _choiceCoach();
    })

    .controller('ResultsController', function($scope, $state, $window){
        /*  $scope.viewProfil = function() {
            $state.go("app.profil", {}, {reload: true});
            $scope.error = "";
            $window.location.reload(true);
        };*/

        $scope.viewRegister = function() {
            $state.go("app.register");
            $scope.error = "";
        };

    })

    .controller('ProgramController', function($scope, ionicTimePicker, $cordovaLocalNotification, $stateParams, $ionicPlatform, $window ){
        $scope.timePicker = "";
        $scope.timetime = function(){
            var ipObj1 = {
                callback: function (val) {
                    if (typeof (val) === 'undefined') {
                        console.log('Time not selected');
                    } else {
                        var selectedTime = new Date(val * 1000);
                        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                        $scope.timePicker = 'Votre entrainement est à ' + selectedTime.getUTCHours()+ ' H ' + selectedTime.getUTCMinutes();
                    }
                },

                inputTime: 50400,   //Optional
                format: 24,         //Optional
                step: 5,           //Optional
                setLabel: 'Valider'    //Optional

            };
            ionicTimePicker.openTimePicker(ipObj1);
        };

        $scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
            alert("Added a notification");
        });

/*
        $scope.add = function() {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes() + 1);
            $cordovaLocalNotification.add({
                id: "1234",
                date: alarmTime,
                message: "This is a message",
                title: "This is a title",
                autoCancel: true,
                sound: null
            }).then(function () {
                console.log("The notification has been set");
            });
        };

        $ionicPlatform.ready(function() {
            if(device.platform === "iOS") {
                window.plugin.notification.local.promptForPermission();
            }
        });

        $scope.isScheduled = function() {
            $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                alert("Notification 1234 Scheduled: " + isScheduled);
            });
        };
*/
    });