import React, { useState } from 'react'
import './todo-list.css'

/**
 * This is the same as the TodoList component in todo-list.jsx, but it was
 * generated using ChatGPT.
 *
 * The only change made was the addition of the "setItems" prop to call back on state change.
 */
export default function TodoListAi({ items, setItems }) {
    const [newItem, setNewItem] = useState('')

    return (
        <div className="todoList">
            <h1>Todo List</h1>
            <dl className="todoList__items">
                {items.map((item, index) => (
                    <li key={index}>
                        <span>{item}</span>
                        <button className="todoList__deleteItemBtn" onClick={() => onDeleteItem(index)}>
                            <i className="las la-minus-circle"></i>
                        </button>
                    </li>
                ))}
            </dl>
            <form onSubmit={onAddItem}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new item"
                />
                <button type="submit" className="todoList__addItemBtn">
                    <i className="las la-plus-circle"></i>
                </button>
            </form>
        </div>
    )

    function onDeleteItem(index) {
        const updatedItems = [...items]
        updatedItems.splice(index, 1)
        setItems({ items: updatedItems })
    }

    function onAddItem(e) {
        e.preventDefault()
        const trimmedItem = newItem.trim()
        if (!trimmedItem) {
            return
        }
        if (!items.includes(trimmedItem)) {
            const updatedItems = [...items, trimmedItem]
            setItems({ items: updatedItems })
        }
        setNewItem('')
    }
}
