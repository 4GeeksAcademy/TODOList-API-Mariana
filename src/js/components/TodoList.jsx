import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const username = "marianadavid"; 
  const apiUrl = `https://playground.4geeks.com/todo`;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    fetch(`${apiUrl}/users/${username}`)
      .then(resp => {
        if (!resp.ok) {
          if (resp.status === 404) {
            createUser(); 
          } else {
            throw new Error("Error al obtener usuario");
          }
        }
        return resp.json();
      })
      .then(data => {
        if (data && Array.isArray(data.todos)) setTasks(data.todos);
      })
      .catch(error => console.error("Error cargando tareas:", error));
  };

  const createUser = () => {
    fetch(`${apiUrl}/users/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => {
        if (resp.status === 400) {
          console.log("El usuario ya existe, continuando...");
          getUser();
          return;
        }
        if (!resp.ok) throw new Error("Error al crear usuario");
        return resp.json();
      })
      .then(() => getUser())
      .catch(err => console.error("Error creando usuario:", err));
  };

  const addTask = newTask => {
    if (newTask.trim() === "") return;
    const taskObj = { label: newTask, is_done: false };

    fetch(`${apiUrl}/todos/${username}`, {
      method: "POST",
      body: JSON.stringify(taskObj),
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al agregar tarea");
        return resp.json();
      })
      .then(() => getUser())
      .catch(err => console.error("Error agregando tarea:", err));
  };

  const deleteTask = id => {
    fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE"
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al eliminar tarea");
        return resp.json();
      })
      .then(() => getUser())
      .catch(err => console.error("Error eliminando tarea:", err));
  };

  
  const clearAll = () => {
    fetch(`${apiUrl}/users/${username}`, {
      method: "DELETE"
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al limpiar usuario");
        setTasks([]);
      })
      .catch(err => console.error("Error limpiando tareas:", err));
  };

  return (
    <div className="todo-container">
      <h1>My TODO List</h1>
      <button onClick={createUser}>🧍 Crear usuario</button>

      <input
        type="text"
        placeholder="Escribe una tarea y presiona Enter"
        onKeyDown={e => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addTask(e.target.value);
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

      {tasks.length > 0 && (
        <button onClick={clearAll}>🗑️ Eliminar todas</button>
      )}
    </div>
  );
};

export default TodoList;
