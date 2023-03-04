import angular from "angular";

const LS_KEY = 'angularjs-examples::todoList';

angular.module('todoListService', [])
    .factory('todoListService', ($q, $window) => {
        // Items is used as global state
        if (!$window.localStorage.getItem(LS_KEY)) {
            $window.localStorage.setItem(LS_KEY, JSON.stringify([
                'Create mock AngularJS TODO List App for testing', 
                '???', 
                'Profit!'
            ]));
        }
        return {
            getItems: () => {
                return $q.resolve(JSON.parse($window.localStorage.getItem(LS_KEY)));
            },
            saveList: (items) => {
                if (!Array.isArray(items)) {
                    return $q.reject(Error('Items must be an array'));
                }
                return $q.resolve().then(() => $window.localStorage.setItem(LS_KEY, JSON.stringify(items)))
            }
        }
    });