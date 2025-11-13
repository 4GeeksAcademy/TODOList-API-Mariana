import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const username = "marianadavid";
  const apiUrl = "https://playground.4geeks.com/todo";

  // 🔹 Cargar usuario al iniciar
  useEffect(() => {
    getUser();
  }, []);

  // 🔹 Obtener tareas del usuario
  const getUser = async () => {
    try {
      const resp = await fetch(`${apiUrl}/users/${username}`);

      // Usuario NO existe → crearlo
      if (resp.status === 404) {
        console.log("Usuario no existe, creando...");
        return createUser();
      }

      if (!resp.ok) throw new Error("Error cargando usuario");

      const data = await resp.json();
      console.log("Tareas cargadas:", data.todos);
      setTasks(data.todos || []);
    } catch (error) {
      console.error("❌ Error al cargar usuario:", error);
    }
  };

  // 🔹 Crear usuario si no existe
  const createUser = async () => {
    try {
      const resp = await fetch(`${apiUrl}/users/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok && resp.status !== 400) {
        throw new Error("Error al crear usuario");
      }

      console.log("🧍 Usuario creado o ya existente");
      getUser();
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
    }
  };

  // 🔹 Agregar tarea
  const addTask = async (newTask) => {
    if (!newTask.trim()) return;

    const taskObj = {
      label: newTask,
      is_done: false,
    };

    try {
      const resp = await fetch(`${apiUrl}/todos/${username}`, {
        method: "POST",
        body: JSON.stringify(taskObj),
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok) throw new Error("Error al agregar tarea");

      const createdTask = await resp.json();

      // 🔥 Agregarla al estado sin recargar toda la lista
      setTasks([...tasks, createdTask]);

      console.log("✔ Tarea añadida:", createdTask);
    } catch (error) {
      console.error("❌ Error al agregar tarea:", error);
    }
  };

  // 🔹 Eliminar tarea (FIX: actualizar estado inmediatamente)
  const deleteTask = async (id) => {
    try {
      const resp = await fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) throw new Error("Error al eliminar tarea");

      // 🔥 Actualizar estado al instante (sin recargar la página)
      setTasks((prev) => prev.filter((t) => t.id !== id));

      console.log("🗑️ Tarea eliminada:", id);
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
    }
  };

  // 🔹 Eliminar todas las tareas
  const clearAll = async () => {
    try {
      const resp = await fetch(`${apiUrl}/users/${username}`, {
        method: "DELETE",
      });

      if (!resp.ok) throw new Error("Error al limpiar tareas");

      setTasks([]);

      console.log("🧹 Todas las tareas eliminadas");
    } catch (error) {
      console.error("❌ Error al limpiar tareas:", error);
    }
  };

  return (
    <div className="todo-container text-center p-4">
      <h1 className="mb-3">📋 My TODO List</h1>

      <button className="btn btn-primary mb-3" onClick={createUser}>
        🧍 Crear usuario
      </button>

      <input
        type="text"
        placeholder="Escribe una tarea y presiona Enter"
        className="form-control mb-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            addTask(e.target.value);
            e.target.value = "";
          }
        }}
      />

      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task.label}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTask(task.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button className="btn btn-warning mt-3" onClick={clearAll}>
          🗑️ Eliminar todas
        </button>
      )}
    </div>
  );
};

export default TodoList;
