'use strick'

const toDoControl = document.querySelector('.todo-control'),
    addText = document.querySelector('.addText'),
    addDate = document.querySelector('.addDate'),
    addButton = document.querySelector('.addButton'),

    //Текущие задачи
    toDo = document.querySelector('.todo-list'),
    toDoItemConst = toDo.querySelector('.todo-item-const');

    //Выполненные задачи
    toDoComleted = document.querySelector('.todo-comleted'),
    toDoCompletedItemConst = toDoComleted.querySelector('.todo-completed-item-const');

//Local storage
let toDoData = localStorage.getItem('toDo');
toDoData = JSON.parse(toDoData);
if(toDoData === null) {
    toDoData = [];
}

console.log(toDoData);
function addTodo () {
    //Удаляем все элементы со страницы, чтоб они не рендерелись по чем зря
    document.querySelectorAll('.todo-completed-item-const').forEach(function(item) {
        item.remove();
    });
    document.querySelectorAll('.todo-item-const').forEach(function(item){
        item.remove();
    });
    if(toDoData.length === 0) {
        toDoComleted.querySelector('.text').style.display = 'block';
        toDo.querySelector('.text').style.display = 'block';
    }
    toDoData.forEach(function(item){
        //Проверяем - выводить текст или нет
        if(!toDoData.find(item => item.completed === true)){
            toDoComleted.querySelector('.text').style.display = 'block';
        } else {
            toDoComleted.querySelector('.text').style.display = 'none';
        } 
        if (!toDoData.find(item => item.completed === false)) {
            toDo.querySelector('.text').style.display = 'block';
        } else {
            toDo.querySelector('.text').style.display = 'none';
        }
        if(item.completed) {
            //Копируем "выполненную" карточку
            const toDoItem  = toDoCompletedItemConst.cloneNode(true);
            toDoItem.style.display = 'block';
            //Делаем рандомный фон
            let randomNumber = getRandomNumber(1, 4);
            if(randomNumber == '1'){
                toDoItem.classList.add('bg-primary');
            } else if (randomNumber == '2') {
                toDoItem.classList.add('bg-secondary');
            } else if (randomNumber == '3') {
                toDoItem.classList.add('bg-success');
            } else if (randomNumber == '4') {
                toDoItem.classList.add('bg-info');
            } else if (randomNumber == '5') {
                toDoItem.classList.add('bg-dark');
            }
            //Добавляем текст
            toDoItem.querySelector('.text-todo').textContent = item.value;
            toDoComleted.prepend(toDoItem);
            //Перемещение записи
            const toDoComletedButton = toDoItem.querySelector('.todo-complete');
            toDoComletedButton.addEventListener('click', () => {
                item.completed = !item.completed;
                toDoData.splice(toDoData.indexOf(item, 0), 1, item);
                localStorage.setItem('toDo', JSON.stringify(toDoData));
                addTodo();
            });
            //Удаление
            const deleteButton = toDoItem.querySelector('.delete');
            deleteButton.addEventListener('click', () => {
                toDoData.splice(toDoData.indexOf(item, 0), 1);
                localStorage.setItem('toDo', JSON.stringify(toDoData));
                addTodo();
            });

        } else {
            //Копируем "невыполненную" карточку
            const toDoItem  = toDoItemConst.cloneNode(true);
            toDoItem.style.display = 'block';
            //Заполняем ее
            toDoItem.querySelector('.title-todo').textContent = item.date;
            toDoItem.querySelector('.text-todo').textContent = item.value;
            toDo.prepend(toDoItem);
            //Перемещение
            const toDoComletedButton = toDoItem.querySelector('.todo-complete');
            toDoComletedButton.addEventListener('click', () => {
                item.completed = !item.completed;
                toDoData.splice(toDoData.indexOf(item, 0), 1, item);
                localStorage.setItem('toDo', JSON.stringify(toDoData));
                addTodo();
            });
            //Удаление
            const deleteButton = toDoItem.querySelector('.delete');
            deleteButton.addEventListener('click', () => {
                toDoData.splice(toDoData.indexOf(item, 0), 1);
                localStorage.setItem('toDo', JSON.stringify(toDoData));
                addTodo();
            });
        }
        
    })
}

//Начало работы
if (toDoData !== null) {
    addTodo(); 
};
toDoControl.addEventListener('submit', (event) => {
    event.preventDefault();
    let newToDo = {
        value: addText.value,
        date: addDate.value,
        completed: false
    };
    toDoData.push(newToDo);
    localStorage.setItem('toDo', JSON.stringify(toDoData));
    addText.value = "";
    addDate.value = "";
    addTodo();
});

//Допы
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

