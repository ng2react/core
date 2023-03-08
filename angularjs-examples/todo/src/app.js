import angular from "angular";
import './todo-list/todo-list.component.js'
import './todo-list/todo-list-service.js'
import './app.css'

angular.module('app', ['todoList', 'todoListService'])
    .controller('AppCtrl', function ($log, $scope, todoListService) {
        $scope.items = []

        todoListService.getItems().then((items) => {
            $scope.items = items;
            $scope.$watch('items.length', () => {
                todoListService.saveList($scope.items).catch($log.error)
            })
        });
    })