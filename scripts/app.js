var firebase = require('firebase');

(function(){
    angular.module("DemoModule", [])
    .config(function(){
        firebase.initializeApp({
            apiKey: "AIzaSyC2yI5MKVaOtspLnH6mhYqnwysbSkCTdiM",
            authDomain: "angular-demo-a63b6.firebaseapp.com"
        })
    })
    .directive("userRegister", function(AuthService, DataService){
        return {
            restrict : "ACE",
            templateUrl : "./views/auth/register.html",
            controller : function($scope){
                $scope.registerUser = function(){
                    console.log($scope.email, $scope.password);
                    AuthService.registerUser($scope.email, $scope.password);
                }
                $scope.loginUser = function(){
                    console.log($scope.email, $scope.password);
                    AuthService.loginUser($scope.email, $scope.password);
                }
                $scope.getData = function(){
                    DataService.getUserData()
                        .then(function(response){
                            console.log(response)
                        }).catch(function(err){ console.log(err)});
                }
            }
        }
    })
    .controller("DemoController", function($scope){})
    .service("AuthService", function(){
        var token = "";
        this.registerUser = function(email, password){
            console.log("Calling Firebase!");
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(response){
                    console.log(response)
                }).catch(function(err){
                    console.log(err);
                });
        }
        this.loginUser = function(email, password){
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(response){
                    console.log(response);
                    firebase.auth().currentUser.getIdToken()
                        .then(function(tk){
                            token = tk;
                            console.log(token);
                        }).catch(function(err){
                            console.log(err);
                        })
                })
                .catch(function(err){
                    console.log(err);
                });
        }
        this.getToken = function(){
            return token;
        }
    })
    .service("DataService", function($http, AuthService){
        this.getUserData = function(){
            return $http({
                url : "https://angular-demo-a63b6.firebaseio.com/users.json?auth=" 
                    + AuthService.getToken(),
                method : "GET" 
            })
        }
    })
})();