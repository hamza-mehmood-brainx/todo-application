(function () {
  const LOCAL_STORAGE_KEY = "todos";

  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#todosTable tbody");
    const loadingEl = document.getElementById("loading");
    const filterSelect = document.getElementById("filter");

    let todos = [];
    // Function to render todos
    function renderTodos(list) {
      tableBody.innerHTML = "";

      if (!list.length) {
        tableBody.innerHTML =
          '<tr><td colspan="3" class="text-center text-muted">No todos found.</td></tr>';
        return;
      }

      list.forEach((todo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${todo.id}</td>
        <td>${todo.title}</td>
        <td>${todo.completed ? "✅" : "❌"}</td>
      `;
        tableBody.appendChild(row);
      });
    }
    // Function to filter todos
    function filterTodos(status) {
      switch (status) {
        case "completed":
          return todos.filter((todo) => todo.completed);
        case "incomplete":
          return todos.filter((todo) => !todo.completed);
        default:
          return todos;
      }
    }
    async function fetchWithRetry(url, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Attempt ${i + 1} failed`);
          return await res.json();
        } catch (err) {
          if (i === retries - 1) throw err;
        }
      }
    }
    async function loadTodosFromAPI() {
      loadingEl.textContent = "Loading todos from API...";
      const baseURL = "https://jsonplaceholder.typicode.com";
      try {
        //  Checking if already todo exist
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        todos = stored ? JSON.parse(stored) : [];
        if (todos.length > 0) {
          renderTodos(todos);
          return;
        }
        // Fetching from api
        const data = await fetchWithRetry(`${baseURL}/users/1/todos`);
        // Saving todos to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        const newTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
        renderTodos(JSON.parse(newTodos));
      } catch (error) {
        tableBody.innerHTML =
          '<tr><td colspan="3" class="text-danger">Failed to load todos from API.</td></tr>';
      } finally {
        loadingEl.style.display = "none";
      }
    }
    // Checking for filter change
    filterSelect.addEventListener("change", () => {
      const filtered = filterTodos(filterSelect.value);
      renderTodos(filtered);
    });

    loadTodosFromAPI();
  });
})();
