/**
 * Created by DennisHuang on 15/09/07.
 */

var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('User', ['$resource',
    function($resource){

        this.resource = $resource(
                '/users/api',
                {id: '@id'}, {
                    'query': {
                        method: 'GET',
                        params: {isArray: false}
                    },
                    'update': {
                        method: 'PUT'
                    }
        });

        //this.getAll = this.resource.query;

        return {
            //resource:   this.resource,
            getAll:     this.resource.query,
            delete:     this.resource.remove,
            add:        this.resource.save,
            update:     this.resource.update
        }
}]);

userServices.service('UserS', ['$resource',
    function($resource){

        this.resource = $resource(
            '/users/api',
            {id: '@id'}, {
                'query': {
                    method: 'GET',
                    params: {isArray: false}
                },
                'update': {
                    method: 'PUT'
                }
            });

        //this.getAll = this.resource.query;

        return {
            //resource:   this.resource,
            getAll:     this.resource.query,
            delete:     this.resource.remove,
            add:        this.resource.save,
            update:     this.resource.update
        };
}]);