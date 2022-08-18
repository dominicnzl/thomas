"use strict";
const orderedTodoList = document.getElementById('ordered-todo-list');
const form = document.getElementById('todo-form');
const listTarget = document.getElementById('list-counter');
const sortToggle = document.getElementById('todo-input-toggle'); // unused
const todoList = JSON.parse(localStorage.getItem('todos'))

//localStorageUpdater saves the task-text content to local storage in the form of an array.
//it does this on every click action.
function localStorageUpdater() {
    console.log(`*** localStorageUpdater is called`)
    const todoItems = []
    let listItems = document.querySelectorAll('.list-item')
    for (let item of listItems) {
        let newItem = {}
        newItem.checked = item.getElementsByClassName('status-checked')[0].checked
        newItem.text = item.getElementsByClassName('task-text')[0].innerHTML
        console.log(`isChecked in listItems is ${item.getElementsByClassName('status-checked')[0].checked}`)
        console.log(`text in listItems is ${item.getElementsByClassName('task-text')[0].innerHTML}`)
        todoItems.push(newItem)
        console.log(todoItems)
    }
    const todoItemsStringified = JSON.stringify(todoItems)
    console.log(todoItemsStringified)
    localStorage.setItem('todos', todoItemsStringified)
}

//this function creates a counter that shows the amount of list items in the ordered to do list
//it gets updated everytime a new list item gets created or deleted.
//if the counter hits 0, the counter dissapears.
function listCounterUpdater() {
    let counter = document.getElementById('ordered-todo-list')?.childElementCount
    console.log(`updating listcounter with count ${counter}`)
    if (counter === 0) {
        listTarget.style.display = 'none'

    } else {
        listTarget.textContent = String(counter + ' :Todo left')
        listTarget.style.display = 'initial'
    }
}

function todoListCreator() {
    const todoForm = document.getElementById('todo-form')
    const copyHTML = listItemCreator(todoForm)
    orderedTodoList?.appendChild(copyHTML)
    listCounterUpdater()
}

function listItemCreator(todoForm) {
    console.log(`text in listItemCreator is ${document.getElementById('todo-input-text').value}`)
    console.log(`checkbox in listItemCreator is checked: ${document.getElementById('todo-input-toggle').value}`)
    console.log(`item text is ${todoForm.text} and item checkbox is ${todoForm.checked}`)
    const itemTemplate = document.getElementById('list-item-template').content;
    const copyHTML = document.importNode(itemTemplate, true);
    /*Give <span> element the textcontent of item (user input)*/
    copyHTML.querySelector('.task-text').textContent = document.getElementById('todo-input-text').value
    copyHTML.querySelector('.status-checked').checked = document.getElementById('todo-input-toggle').checked
    return copyHTML;
}

function listItemCreateOnload(item) {
    console.log(item)
    const itemTemplate = document.getElementById('list-item-template').content;
    const copyHTML = document.importNode(itemTemplate, true)
    copyHTML.querySelector('.task-text').textContent = item.text
    copyHTML.querySelector('.status-checked').checked = item.checked
    return copyHTML
}

//looks if the html element has a classname that includes delete.
//if it does, it removes the parent element.
orderedTodoList?.addEventListener("click", (event) => {
    const target = event.target;
    const closestListItem = target.closest('li')
    if (target.className.includes('delete')) {
        /*(event.target as HTMLElement).parentElement?.remove();*/
        closestListItem?.remove();
        listCounterUpdater();
        localStorageUpdater();
    }
});

form?.addEventListener('submit', (e) => {
    e.preventDefault()
    // resets input field to blank after user submits task
    const resetInput = document.getElementById('todo-input-text');
    resetInput.value = '';
    localStorageUpdater();
})

window.onload = () => {
    console.log(`todos = ${todoList}`)
    if (todoList == null) {
        return
    }
    for (let todo of todoList) {
        console.log(`creating listItem with ${JSON.stringify(todo)}`)
        const copy = listItemCreateOnload(todo)

        console.log(`appending copy to todoList: ${JSON.stringify(copy)}`)
        orderedTodoList?.appendChild(copy);
    }
    localStorageUpdater()
    listCounterUpdater()
}
