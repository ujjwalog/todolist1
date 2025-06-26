document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    
    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No todos yet' : 
                                      currentFilter === 'active' ? 'No active todos' : 
                                      'No completed todos';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#888';
            todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach((todo, index) => {
                const todoItem = document.createElement('li');
                todoItem.className = 'todo-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'todo-checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleComplete(index));
                
                const todoText = document.createElement('span');
                todoText.className = 'todo-text';
                if (todo.completed) todoText.classList.add('completed');
                todoText.textContent = todo.text;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteTodo(index));
                
                todoItem.appendChild(checkbox);
                todoItem.appendChild(todoText);
                todoItem.appendChild(deleteBtn);
                
                todoList.appendChild(todoItem);
            });
        }
        
        updateItemsLeft();
        saveToLocalStorage();
    }
    
    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            renderTodos();
        }
    }
    
    // Toggle todo completion status
    function toggleComplete(index) {
        const filteredIndex = getFilteredIndex(index);
        if (filteredIndex !== -1) {
            todos[filteredIndex].completed = !todos[filteredIndex].completed;
            renderTodos();
        }
    }
    
    // Delete todo
    function deleteTodo(index) {
        const filteredIndex = getFilteredIndex(index);
        if (filteredIndex !== -1) {
            todos.splice(filteredIndex, 1);
            renderTodos();
        }
    }
    
    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    }
    
    // Update items left counter
    function updateItemsLeft() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${activeTodos} ${activeTodos === 1 ? 'item' : 'items'} left`;
    }
    
    // Get the actual index in the todos array from the filtered index
    function getFilteredIndex(filteredIndex) {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        if (filteredIndex >= 0 && filteredIndex < filteredTodos.length) {
            const todo = filteredTodos[filteredIndex];
            return todos.findIndex(t => t.text === todo.text && t.completed === todo.completed);
        }
        return -1;
    }
    
    // Save todos to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Initial render
    renderTodos();
});