import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const username = "marianadavid"; // 👈 usa tu nombre de usuario único

  // ✅ Cargar tareas al iniciar (GET)
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    fetch(`https://playground.4geeks.com/todo/todos/${username}`)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        else setTasks([]); // Si no hay tareas
      })
      .catch(error => console.log("Error al cargar tareas:", error));
  };

  // ✅ Crear usuario (solo la primera vez)
  const createUser = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => resp.json())
      .then(() => getTasks())
      .catch(err => console.log("Error al crear usuario:", err));
  };

  // ✅ Agregar una nueva tarea (POST)
  const addTask = newTask => {
    const taskObj = { label: newTask, is_done: false };
    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "POST",
      body: JSON.stringify(taskObj),
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => resp.json())
      .then(() => getTasks()) // Recarga lista
      .catch(err => console.log("Error al agregar tarea:", err));
  };

  // ✅ Eliminar una tarea individual (DELETE)
  const deleteTask = id => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    })
      .then(resp => resp.json())
      .then(() => getTasks())
      .catch(err => console.log("Error al eliminar tarea:", err));
  };

  // ✅ Eliminar todas las tareas del usuario
  const clearAll = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
      method: "DELETE"
    })
      .then(() => setTasks([]))
      .catch(err => console.log("Error al limpiar tareas:", err));
  };

  // ✅ Interfaz visual
  return (
    <div className="todo-container">
      <h1>My TODO List</h1>
      <button onClick={createUser}>Crear usuario</button>

      <input
        type="text"
        placeholder="Agregar nueva tarea"
        onKeyDown={e => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addTask(e.target.value.trim());
            e.target.value = "";
          }
        }}
      />

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.label}
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && <button onClick={clearAll}>🗑️ Limpiar todas</button>}
    </div>
  );
};

export default TodoList;
