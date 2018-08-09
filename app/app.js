// 'use strict';

// // Declare app level module which depends on views, and components
// angular.module('myApp', [
//   'ngRoute',
//   'myApp.view1',
//   'myApp.view2',
//   'myApp.version'
// ]).
// config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
//   $locationProvider.hashPrefix('!');

//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);



'use strict';

// Declare app level module which depends on views, and components
// angular.module('myApp', [
//   'ui.router'
// ]).
var routerApp = angular.module('myApp', ['ui.router']);
// config(['$stateProvide', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
//   // $stateProvider

//   //   // HOME STATES AND NESTED VIEWS ========================================
//   //   .state('home', {
//   //     url: '/home',
//   //     templateUrl: 'view1/view1.html'
//   //   })
// }]);
routerApp.config(function($stateProvider, $urlRouterProvider) {



    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
        url: '/home',
        templateUrl: 'view1/view1.html',
        controllerName: 'aboutCtrl'
    })

    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('about', {
        url: '/about',
        templateUrl: 'view2/view2.html',
        // we'll get to this in a bit       
    });
    $urlRouterProvider.otherwise('/home');
});