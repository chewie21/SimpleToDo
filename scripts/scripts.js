`user strict`;

class ToDo {
    constructor(form, inputText, inputDate, toDoList, toDoListConst, toDoComleted, toDoCompletedConst) {
        //Форма и данные в ней
        this.form = document.querySelector(form);
        this.inputText = document.querySelector(inputText);
        this.inputDate = document.querySelector(inputDate);
        //Текущие задачи
        this.toDoList = document.querySelector(toDoList);
        this.toDoListConst = this.toDoList.querySelector(toDoListConst);
        //Выполненные задачи
        this.toDoComleted = document.querySelector(toDoComleted);
        this.toDoCompletedConst = this.toDoComleted.querySelector(toDoCompletedConst);
        //Сторадж
        this.toDoData = new Map(JSON.parse(localStorage.getItem(`toDo`)));
    }

    //Ген рандомного числа
    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //Ген. ключа
    generateKey() {
        return Math.random().toString(36).substring(2,15) +
            Math.random().toString(36).substring(2,15);
    }

    //Обработчик событий
    handler () {
        document.querySelectorAll(`.card`).forEach((item) => {
            item.addEventListener('click', (event) => {
                let target = event.target;
                if(target.closest(`.delete`)) {
                    this.deleteItem(item);
                } else if (target.closest(`.todo-complete`)) {
                    this.completedItem(item);
                } else if (target.closest(`.edit`)) {
                    item.querySelector(`.edit`).style.display = `none`;
                    const text = item.querySelector(`.text-todo`);
                    text.setAttribute(`contenteditable`, `true`);
                    const btn = item.querySelector(`.save`);
                    btn.style.display = 'inline-block';
                    btn.addEventListener('click', () => {
                        this.edit(item, text.textContent);
                    }) 
                }
            })
        }, this);
    }

    //Удаление
    deleteItem (item) {
        this.toDoData.delete(item.querySelector(`.key`).value);
        this.addToStorage();
        const animation = () => {
            let counter = 1;
            const newAnimation = () => {
                item.style.opacity = counter;
                counter -= 0.01;
                if(counter >= 0) {
                    requestAnimationFrame(newAnimation);
                } else {
                    this.render();
                }
            }
            newAnimation();
        }
        animation();
    }

    //Выполнение
    completedItem (item) {
        console.log(item.querySelector(`.key`).value);
        let data = this.toDoData.get(item.querySelector(`.key`).value);
        data.completed = !data.completed;
        this.toDoData.set(data.key, data);
        this.addToStorage();

        // console.log(this.toDoList.querySelector(`.card`).offsetHeight);
        // console.log(this.toDoList.offsetHeight);
        // console.log(this.toDoComleted.offsetHeight);

        if(data.completed) {
            const firstAnimation = () => {
                let counter = 0;
                const firstAnimation1 = () => {
                    item.style.top = counter + `px`;
                    counter++;
                    if(counter < this.toDoList.querySelector(`.card`).offsetHeight) {
                        requestAnimationFrame(firstAnimation1);
                    } else {
                        this.render();
                    }
                }
                firstAnimation1();
            }
            firstAnimation();
        } else {
            const firstAnimation = () => {
                let counter = 0;
                const firstAnimation1 = () => {
                    item.style.top = - counter + `px`;
                    counter++;
                    if(counter < this.toDoComleted.querySelector(`.card`).offsetHeight) {
                        requestAnimationFrame(firstAnimation1);
                    } else {
                        this.render();
                    }
                }
                firstAnimation1();
            }
            firstAnimation();
        }
    }

    //Редактирование
    edit (item, text) {
        let data = this.toDoData.get(item.querySelector(`.key`).value);
        data.value = text;
        this.toDoData.set(data.key, data);
        this.addToStorage();
        this.render();
    }

    //Добавление 
    addToDo(e) {
        e.preventDefault();
        const newToDo = {
            key: this.generateKey(),
            value: this.inputText.value,
            date: this.inputDate.value,
            completed: false
        };
        this.toDoData.set(newToDo.key, newToDo);
        this.inputText.value = "";
        this.inputDate.value = "";
        this.addToStorage();
        this.render();
    }

    //Отрисовка страницы
    render() {
        document.querySelectorAll('.todo-completed-item-const').forEach(function(item) {
            item.remove();
        });
        document.querySelectorAll('.todo-item-const').forEach(function(item){
            item.remove();
        });
        this.toDoComleted.querySelector('.text').style.display = 'block';
        this.toDoList.querySelector('.text').style.display = 'block';
        if(!(this.toDoData.size === 0)) {
            this.toDoData.forEach(this.createItem.bind(this));
        }
        this.handler();
    }

    //Добавление в сторадж
    addToStorage () {
        localStorage.setItem(`toDo`, JSON.stringify([...this.toDoData]));
    }

    //Создание элемента
    createItem(item) {
        if(item.completed) {
            this.toDoComleted.querySelector('.text').style.display = 'none';
            //Копируем "выполненную" карточку
            const toDoItem  = this.toDoCompletedConst.cloneNode(true);
            toDoItem.style.display = 'block';
            //Делаем рандомный фон
            let randomNumber = this.getRandomNumber(1, 4);
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
            toDoItem.querySelector(`.key`).value = item.key;
            this.toDoComleted.prepend(toDoItem);
        } else {
            this.toDoList.querySelector('.text').style.display = 'none';
            //Копируем "невыполненную" карточку
            const toDoItem  = this.toDoListConst.cloneNode(true);
            toDoItem.style.display = 'block';
            toDoItem.querySelector(`.save`).style.display = 'none';
            //Заполняем ее
            toDoItem.querySelector(`.key`).value = item.key;
            toDoItem.querySelector('.title-todo').textContent = item.date;
            toDoItem.querySelector('.text-todo').textContent = item.value;
            this.toDoList.prepend(toDoItem);
        }
    }

    //Точка входа
    init() {
        this.form.addEventListener(`submit`, this.addToDo.bind(this));
        this.render();
    }

}

const toDo = new ToDo(`.todo-control`, `.addText`, `.addDate`, `.todo-list`, `.todo-item-const`, `.todo-comleted`, `.todo-completed-item-const`);
toDo.init();