/**
 *  Module
 *
 * Description
 */
angular.module('Class', [
    'ngRoute',
    'navbar',
    'loading',
    'ngClipboard',
    'formValidation',
    'SoftRegist',
    'Class.services',
    'Class.controllers',
    'Class.directives']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'partials/home.html',
                resolve: {
                    initAll: ['ResourceManager', function (ResourceManager) {
                        return ResourceManager.initAll();
                    }]
                }
            })
    }]);

