import angular from "angular";
import './todo-list/todo-list-service.js'
import './app.css'
import { angularize } from './angularise.cjs';
import TodoList from "./todo-list/todo-list.jsx";
import TodoListAi from "./todo-list/todo-list.ai.jsx";

// angularize(TodoList, "todoList", angular.module("todoList", []), {
//     items: "<",
//     setItems: "&"
// });

angularize(TodoListAi, "todoListAi", angular.module("todoListAi", []), {
    items: "<",
    setItems: "&"
});

angularize(TodoList, "todoList", angular.module("todoList", []), {
    items: "<",
    setItems: "&"
});

angular.module('app', ['todoList', 'todoListAi', 'todoListService'])
    .controller('AppCtrl', function ($log, $scope, todoListService) {
        $scope.items = []

        // DIFF: Replace watchers with onChange callbacks
        $scope.setItems = (items) => {
            $scope.items = items
            todoListService.saveList($scope.items).catch($log.error)
            console.log($scope.items.length)
        }

        todoListService.getItems().then((items) => {
            $scope.items = items;
        });
    })