import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/todos";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // ------------------------
  // GET ALL TODOS
  // ------------------------
  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ------------------------
  // CREATE TODO
  // ------------------------
  const createTodo = async (e) => {
    e.preventDefault();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    });

    const data = await res.json();
    if (res.ok) {
      setTodos([data, ...todos]);
      setTitle("");
    } else {
      alert(data.error);
    }
  };

  // ------------------------
  // TOGGLE COMPLETE
  // ------------------------
  const toggleCompleted = async (id, value) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: value }),
    });

    if (res.ok) {
      setTodos(todos.map((t) =>
        t._id === id ? { ...t, completed: value } : t
      ));
    }
  };

  // ------------------------
  // DELETE TODO
  // ------------------------
  const deleteTodo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTodos(todos.filter((t) => t._id !== id));
    }
  };

  // ------------------------
  // UPDATE TODO
  // ------------------------
  const updateTodo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });

    if (res.ok) {
      setTodos(
        todos.map((t) =>
          t._id === id ? { ...t, title: editingTitle } : t
        )
      );
      setEditingId(null);
      setEditingTitle("");
    }
  };

  // ------------------------
  // CLEAR COMPLETED
  // ------------------------
  const clearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed);

    await Promise.all(
      completedTodos.map((todo) =>
        fetch(`${API_URL}/${todo._id}`, {
          method: "DELETE",
        })
      )
    );

    setTodos(todos.filter((t) => !t.completed));
  };

  // ------------------------
  // FILTERED TODOS
  // ------------------------
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo CRUD App</h1>

      {/* CREATE TODO */}
      <form onSubmit={createTodo}>
        <input
          type="text"
          placeholder="Add new todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add Todo</button>
      </form>

      <hr />

      {/* LEGEND */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Total:</strong> {todos.length} |
        <strong> Active:</strong> {activeCount} |
        <strong> Completed:</strong> {completedCount}
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFilter("all")}
          style={{ fontWeight: filter === "all" ? "bold" : "normal" }}>
          All
        </button>

        <button onClick={() => setFilter("active")}
          style={{ fontWeight: filter === "active" ? "bold" : "normal", marginLeft: "10px" }}>
          Active
        </button>

        <button onClick={() => setFilter("completed")}
          style={{ fontWeight: filter === "completed" ? "bold" : "normal", marginLeft: "10px" }}>
          Completed
        </button>

        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            style={{ marginLeft: "20px", color: "red" }}
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* LIST TODOS */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo._id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={todo.completed || false}
              onChange={(e) => toggleCompleted(todo._id, e.target.checked)}
            />

            {editingId === todo._id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginLeft: "10px"
                  }}
                >
                  {todo.title}
                </span>

                <button onClick={() => {
                  setEditingId(todo._id);
                  setEditingTitle(todo.title);
                }}>
                  Edit
                </button>

                <button onClick={() => deleteTodo(todo._id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
