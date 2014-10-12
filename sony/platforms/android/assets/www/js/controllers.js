
var requestToken = "";
var accessToken = "";
var clientId = "3MVG99qusVZJwhsn159XaZ4kgfPD8U0gtg0tZvOTqRdphZwdV27esvNv6GohH9Y5JsjZnNeEOg03rDN44gcqB";
var clientSecret = "client_secret_here";
var apiVersion = "v30.0";
var loginUrl = "https://login.salesforce.com/";
var redirectURI = "http://localhost:8100/#/oauthcallback";
var client = new forcetk.Client(clientId, loginUrl);
angular.module('directory.controllers', [])
    
    .controller('EmployeeIndexCtrl', function ($scope, EmployeeService) {

        $scope.searchKey = "";

        $scope.clearSearch = function () {
            $scope.searchKey = "";
            findAllEmployees();
        }

        $scope.search = function () {
            EmployeeService.findByName($scope.searchKey).then(function (employees) {
                $scope.employees = employees;
            });
        }

        var findAllEmployees = function() {
            EmployeeService.findAll().then(function (employees) {
                $scope.employees = employees;
            });
        }

        findAllEmployees();

    })

    .controller('EmployeeDetailCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findById($stateParams.employeeId).then(function(employee) {
            $scope.employee = employee;
        });
    })

    .controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function(employees) {
            $scope.employees = employees;
        });
    })

    .controller('LoginController', function($scope, $http, $location) {
 
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
     
        $scope.login = function() {
            var ref = window.open(loginUrl + 'services/oauth2/authorize?display=popup&response_type=token&client_id=' + encodeURIComponent(clientId) + 
                '&redirect_uri=' + encodeURIComponent(redirectURI), '_blank', 'location=no');
            ref.addEventListener('loadstart', function(event) { 
                //alert('url : ' + event.url);
                if((event.url).startsWith("http://localhost:8100/#/oauthcallback")) {
                    alert('url : ' + event.url);
                    hashString = event.url;
                    alert('hashString : ' + hashString);
                    replacedString = hashString.replace("http://localhost:8100/#/oauthcallback#",'');
                    alert('replacedString : ' + replacedString);
                    params = replacedString.split('&');
                    response = {};
                    params.forEach(function (param) {
                        var splitter = param.split('=');
                        response[splitter[0]] = splitter[1];
                    });
                    alert(JSON.stringify(response));
                    oauthCallback(response);
                    function oauthCallback(response) {
                        alert('response : ' + JSON.stringify(response));
                        if (response && response.access_token) {
                            alert('response : ' + JSON.stringify(response));
                            client.setSessionToken(response.access_token, apiVersion, response.instance_url);
                            alert('response : ' + JSON.stringify(response));
                            if (!client.sessionId) {
                                alert('You are not authenticated. Please login first.');
                                return false;
                            }
                            alert('client : ' + JSON.stringify(client));
                            client.query('Select Name FROM Account LIMIT 1',
                                function (data) {
                                    alert(JSON.stringify(data));
                                },
                                function (error) {
                                    alert("Error: " + JSON.stringify(error));
                                });
                        } else {
                            alert("AuthenticationError: No Token");
                        }
                    }
                }
            });
        }
     
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }
        
    })

    .controller('storeListController',['$scope','$state','$location',function($scope,$state,$location){
        console.log(JSON.stringify($location.$$hash));
        params = $location.$$hash.split('&'),
        response = {};
        params.forEach(function (param) {
            var splitter = param.split('=');
            response[splitter[0]] = splitter[1];
        });
        console.log(JSON.stringify(response));
        oauthCallback(response);
        function oauthCallback(response) {
            alert('response : ' + JSON.stringify(response));
            if (response && response.access_token) {
                alert('response : ' + JSON.stringify(response));
                client.setSessionToken(response.access_token, apiVersion, response.instance_url);
                alert('response : ' + JSON.stringify(response));
                if (!client.sessionId) {
                    alert('You are not authenticated. Please login first.');
                    return false;
                }
                client.query('Select Name FROM Account LIMIT 1',
                    function (data) {
                        alert(JSON.stringify(data));
                    },
                    function (error) {
                        alert("Error: " + JSON.stringify(error));
                    });
            } else {
                alert("AuthenticationError: No Token");
            }
        }
    }]);
