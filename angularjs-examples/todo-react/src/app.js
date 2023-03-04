import angular from "angular";
import './todo-list/todo-list-service.js'
import './app.css'
import { angularize } from "./angularise.cjs";
import TodoList from "./todo-list/todo-list.jsx";

angularize(TodoList, "todoList", angular.module("todoList", []), {
    items: "<",
    onChange: "&"
});

angular.module('app', ['todoList', 'todoListService'])
    .controller('AppCtrl', function ($log, $scope, todoListService) {
        $scope.items = []

        // DIFF: Replace watchers with onChange callbacks
        $scope.onChange = () => {
            $scope.items = [...$scope.items]
            todoListService.saveList($scope.items).catch($log.error)
            console.log($scope.items.length)
        }

        todoListService.getItems().then((items) => {
            $scope.items = items;
        });
    })