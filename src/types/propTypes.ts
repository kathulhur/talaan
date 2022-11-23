import { Item, Prisma, TodoList } from "@prisma/client"
import React, { SetStateAction } from "react"

export interface TodoItemProps {
    todoItem: Item
    itemOnUpdateIndex: number
    onItemOnUpdateIndexChanged: (itemId: number) => void
    onUpdate: (todoItem: Item, itemUpdateInput: Prisma.ItemUpdateInput) => void
    onDelete: (deletedItem: Item) => void
}

export interface TodoListProps {

    todoList: TodoList
    onUpdate: (updatedTodoList: TodoList) => void
    onDelete: (todoList: TodoList) => void
}

export interface TodoItemsProps {
    todoListId: number
}
