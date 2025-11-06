import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const username = "marianadavid"; 
  const apiUrl = `https://playground.4geeks.com/apis/fake/todos/user/${username}`;

 
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    fetch(apiUrl)
      .then(resp => {
        if (!resp.ok) {

          if (resp.status === 404) {
            createUser();
          }
          throw new Error("No se pudieron cargar las tareas");
        }
        return resp.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(err => console.log("Error al obtener tareas:", err));
  };

 
  const createUser = () => {
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify([]), 
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al crear usuario");
        return resp.json();
      })
      .then(() => getTasks())
      .catch(err => console.log("Error al crear usuario:", err));
  };

  const addTask = newTask => {
    if (newTask.trim() === "") return;
    const updatedTasks = [...tasks, { label: newTask, done: false }];

    fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(updatedTasks),
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al agregar tarea");
        return resp.json();
      })
      .then(() => getTasks())
      .catch(err => console.log("Error al agregar tarea:", err));
  };

  
  const deleteTask = index => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(updatedTasks),
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al eliminar tarea");
        return resp.json();
      })
      .then(() => getTasks())
      .catch(err => console.log("Error al eliminar tarea:", err));
  };

  const clearAll = () => {
    fetch(apiUrl, { method: "DELETE" })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al limpiar todas las tareas");
        setTasks([]);
      })
      .catch(err => console.log("Error al limpiar tareas:", err));
  };

 
  return (
    <div className="todo-container">
      <h1>My TODO List</h1>
      <button onClick={createUser}>Crear usuario</button>

      <input
        type="text"
        placeholder="Agregar nueva tarea"
        onKeyDown={e => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addTask(e.target.value);
            e.target.value = "";
          }
        }}
      />

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.label}
            <button onClick={() => deleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button onClick={clearAll}>🗑️ Limpiar todas</button>
      )}
    </div>
  );
};

export default TodoList;
