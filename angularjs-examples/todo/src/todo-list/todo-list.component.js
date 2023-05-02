import angular from "angular";
import todoListTpl from "./todo-list.html";
import './todo-list.css'

class TodoListCtrl {
    constructor() {
        this.items = [];
    }
    /**
     * 
     * @param {number} index 
     */
    onDeleteItem(index) {
        this.items.splice(index, 1);
    }

    onAddItem() {
        this.newItem = this.newItem?.trim();
        if (!this.newItem) {
            return;
        }
        if (!this.items.includes(this.newItem)) {
            this.items.push(this.newItem);
        }
        this.newItem = '';
    }
}

angular.module('todoList', [])
    .component('todoList', {
        controller: TodoListCtrl,
        template: `<div class="todoList">
        <h1>Todo List</h1>
        <dl class="todoList__items">
          <li ng-repeat="x in $ctrl.items"><span>{{x}}</span><button ng-click="$ctrl.onDeleteItem($index)" class="todoList__deleteItemBtn"><i class="las la-minus-circle"></i></button></li>
        </dl>
        <form ng-submit="$ctrl.onAddItem()">
          <input type="text" ng-model="$ctrl.newItem" placeholder="Add a new item">
          <button type="submit" class="todoList__addItemBtn"><i class="las la-plus-circle"></i></button>
          </form>
      </div>
      `,
        bindings: {
            items: '<',
        }
    })