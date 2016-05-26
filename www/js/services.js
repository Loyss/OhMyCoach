/*
angular.module('app.services', [])

    .factory('form', [function(){
         var questions = [
             {
                 question : "Quel est votre niveau sportif aujoud'hui?",
                 reponse:[
                     'Débutant',
                     'Intermédiare',
                     'Confirmé'
                 ],
                 jade: 0,
                 celine: 1,
                 bruce: 2
             },

             {
                 question: "Votre coach, vous préférez être suivi par : ",
                 reponse: [
                     'Une femme',
                     'Un homme',
                     'Peu importe'
                 ],
                 jade: 0,
                 bruce: 2,
                 celine: 1
             },
             {
                 question: "Votre coach, vous le voyez comme ?",
                 reponse: [
                     'Un ami',
                     'Un officier',
                     'Peu importe'
                 ],
                 jade: 0,
                 celine: 1,
                 bruce: 2
             }
         ];
     return {
         getQuestion: function(index){
             return questions[index];
         }
     };
    }])
     .service('results', [function(){
         var jade = 0;
         var celine = 1;
         var bruce = 2;

         return {
             getJade: function () {
                 return jade;
             },
             incrementJade: function () {
                 ++jade;
             },
             resetJade: function () {
                 jade = 0;
             },
             getCeline: function () {
                 return celine;
             },
             incrementCeline: function () {
                 ++celine;
             },
             resetCeline: function () {
                 celine = 0;
             },
             getBruce: function () {
                 return bruce;
             },
             incrementBruce: function () {
                 ++bruce;
             },
             resetBruce: function () {
                 bruce = 0;
             }
         }
     }]);


.controller('FormController', function($scope, $http, $state, $sessionStorage, $window, form, results){
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

    $scope.question ='';
    $scope.reponses = {};
    $scope.jade = 0;
    $scope.bouton = false;
    $scope.texteBouton = 'Question suivante';
    $scope.iconeBouton = 'ion-android-arrow-forward';
    results.resetJade();
    results.resetCeline();
    results.resetBruce();

    var step = 0;

    $scope.choix = function (index){
        $scope.disabled = true;
        $scope.bouton = true;

        if(index == $scope.jade){
            results.incrementJade();
        }else if(index == $scope.celine){
            results.incrementCeline();
        }else if(index == $scope.bruce){
            results.incrementBruce();
        }
    };

    $scope.suivant = function(){
        if(step == -1){
            step = 0;
            $scope.texteBouton = 'Question suivante';
            $scope.iconeBouton = 'ion-android-arrow-forward';
            results.resetJade();
            results.resetCeline();
            results.resetBruce();
        }
        getQuestion();
    };

    var getQuestion = function () {
        var item = form.getQuestion(step);
        $scope.bouton = false;
        $scope.disabled = false;
        $scope.question = item.question;
        $scope.reponses = item.reponses;
        $scope.jade = item.jade;
        $scope.celine = item.celine;
        $scope.bruce = item.bruce;
        for(var i = 0; i < item.reponses.length; i++){

        }
        ++step;
    };
    $scope.suivant();
})
    .controller('ResultsController', function($scope, results){
        $scope.setResults = function () {
            $scope.jade = results.getJade();
            $scope.celine = results.getCeline();
            $scope.bruce = results.getBruce();
        }
    })
*/

