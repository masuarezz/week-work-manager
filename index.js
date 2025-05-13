// Estructura para almacenar los miembros por día
        const weekdays = {
            lunes: { name: 'Lunes', tasks: [] },
            martes: { name: 'Martes', tasks: [] },
            miercoles: { name: 'Miércoles', tasks: [] },
            jueves: { name: 'Jueves', tasks: [] },
            viernes: { name: 'Viernes', tasks: [] }
        };
        
        // Referencias a elementos del DOM
        const daysContainer = document.getElementById('daysContainer');
        const taskText = document.getElementById('taskText');
        const daySelect = document.getElementById('daySelect');
        const addTaskBtn = document.getElementById('addTaskBtn');
        
        // Crear las tarjetas de días
        function createDayCards() {
            daysContainer.innerHTML = '';
            
            Object.keys(weekdays).forEach(day => {
                const dayData = weekdays[day];
                
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                dayCard.id = `day-${day}`;
                
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                
                const dayName = document.createElement('span');
                dayName.textContent = dayData.name;
                
                const taskCount = document.createElement('span');
                taskCount.className = 'task-count';
                taskCount.textContent = `${dayData.tasks.length}`;
                
                dayHeader.appendChild(dayName);
                dayHeader.appendChild(taskCount);
                
                const taskList = document.createElement('ul');
                taskList.className = 'task-list';
                
                dayData.tasks.forEach((task, index) => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'task-item';
                    
                    // Crear contenedor para el texto y botón de eliminar
                    const taskContent = document.createElement('div');
                    taskContent.style.display = 'flex';
                    taskContent.style.justifyContent = 'space-between';
                    taskContent.style.alignItems = 'center';
                    
                    // Texto del miembro
                    const taskText = document.createElement('span');
                    taskText.textContent = task;
                    
                    // Botón para eliminar miembro individual
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '×';
                    deleteBtn.style.background = 'none';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.color = '#e74c3c';
                    deleteBtn.style.fontSize = '18px';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.style.padding = '0 5px';
                    deleteBtn.title = 'Eliminar miembro';
                    
                    // Añadir evento al botón de eliminar
                    deleteBtn.addEventListener('click', function() {
                        weekdays[day].tasks.splice(index, 1);
                        createDayCards();
                        saveData();
                    });
                    
                    taskContent.appendChild(taskText);
                    taskContent.appendChild(deleteBtn);
                    taskItem.appendChild(taskContent);
                    
                    taskList.appendChild(taskItem);
                });
                
                dayCard.appendChild(dayHeader);
                dayCard.appendChild(taskList);
                daysContainer.appendChild(dayCard);
            });
        }
        
        // Añadir un nuevo miembro
        function addTask() {
            const text = taskText.value.trim();
            const day = daySelect.value;
            
            if (text && day) {
                // No hay límite de miembros, así que simplemente añadimos
                weekdays[day].tasks.push(text);
                taskText.value = '';
                
                // Actualizar la interfaz
                createDayCards();
                
                // Animación simple para el día actualizado
                const updatedCard = document.getElementById(`day-${day}`);
                updatedCard.style.transition = 'background-color 0.3s';
                updatedCard.style.backgroundColor = 'rgba(165, 123, 255, 0.2)';
                setTimeout(() => {
                    updatedCard.style.backgroundColor = '';
                }, 1000);
                
                // Guardar en localStorage
                saveData();
            } else {
                alert('Por favor, introduce el nombre del miembro');
            }
        }
        
        // Función para limpiar todos los miembros
        function clearAllTasks() {
            if (confirm('¿Estás seguro de que deseas eliminar todos los miembros?')) {
                // Limpiar todas los miembros en cada día
                Object.keys(weekdays).forEach(day => {
                    weekdays[day].tasks = [];
                });
                
                // Actualizar la interfaz
                createDayCards();
                
                // Efecto visual de confirmación
                daysContainer.style.transition = 'opacity 0.3s';
                daysContainer.style.opacity = '0.5';
                setTimeout(() => {
                    daysContainer.style.opacity = '1';
                }, 300);
                
                // Limpiar también el localStorage
                localStorage.removeItem('weekdayTasks');
            }
        }

        // Event listeners
        addTaskBtn.addEventListener('click', addTask);
        document.getElementById('clearAllBtn').addEventListener('click', clearAllTasks);
        
        // También permitir enviar al presionar Enter en el área de texto
        taskText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addTask();
            }
        });
        
        // Inicializar la aplicación
        createDayCards();
        
        // Guardar datos en localStorage
        function saveData() {
            localStorage.setItem('weekdayTasks', JSON.stringify(weekdays));
        }
        
        // Cargar datos desde localStorage
        function loadData() {
            const savedData = localStorage.getItem('weekdayTasks');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                Object.keys(parsedData).forEach(day => {
                    if (weekdays[day]) {
                        weekdays[day].tasks = parsedData[day].tasks;
                    }
                });
                createDayCards();
            }
        }
        
        // Guardar al salir
        window.addEventListener('beforeunload', saveData);
        
        // Cargar al inicio
        document.addEventListener('DOMContentLoaded', loadData);