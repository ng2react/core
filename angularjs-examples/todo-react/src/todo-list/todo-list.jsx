import React from "react";
import "./todo-list.css";

const TodoList = ({ items, setItems }) => {

  return (
    <div className="todoList">
      <h1>Todo List</h1>
      <dl className="todoList__items">
        {items.map((item, index) => (
          <li key={item}>
            <span>{item}</span>
            <button
              onClick={() => onDeleteItem(index)}
              className="todoList__deleteItemBtn"
            >
              <i className="las la-minus-circle"></i>
            </button>
          </li>
        ))}
      </dl>
      <form onSubmit={onAddItem}>
        <input type="text" name="newItem" placeholder="Add a new item" />
        <button type="submit" className="todoList__addItemBtn">
          <i className="las la-plus-circle"></i>
        </button>
      </form>
    </div>
  );

  function onAddItem(submitEvent) {
    submitEvent.preventDefault();
    let newItem = new FormData(submitEvent?.target).get("newItem");
    if (typeof newItem !== "string") {
      return;
    }
    newItem = newItem.trim();
    console.log(submitEvent, newItem);
    if (!newItem) {
      return;
    }
    if (!items.includes(newItem)) {
      items.push(newItem);
    }
    submitEvent.target.reset();
    setItems({items})
  }

  function onDeleteItem(index) {
    items.splice(index, 1);
    setItems({items})
  }
};

export default TodoList;
