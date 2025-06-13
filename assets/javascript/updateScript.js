import { showToast } from "./utilities.js";
const API_URL = "https://jsonplaceholder.typicode.com/todos";
const LOCAL_STORAGE_KEY = "todos";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("updateTodoForm");
  const idInput = document.getElementById("todoId");
  const titleInput = document.getElementById("title");
  const completedInput = document.getElementById("completed");

  // Function to show loading state
  function showLoadingState(isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = isLoading;
    submitBtn.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Loading...'
      : "Submit";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    const id = parseInt(idInput.value);
    if (!id || id <= 0) {
      idInput.classList.add("is-invalid");
      return;
    }
    idInput.classList.remove("is-invalid");

    if (!titleInput.checkValidity()) {
      titleInput.classList.add("is-invalid");
      return;
    }
    titleInput.classList.remove("is-invalid");

    const updatedTodo = {
      id,
      title: titleInput.value.trim(),
      completed: completedInput.checked,
      userId: 1,
    };

    try {
      showLoadingState(true);
      // Mock API PUT request
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error("Failed to update via API.");

      // Update localStorage
      const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === -1) {
        showToast("Todo not found in local storage.", "danger");
      } else {
        todos[index] = { ...todos[index], ...updatedTodo };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        showToast("Task updated using API!", "success");
        form.reset();
      }
    } catch (err) {
      showToast("Error updating todo. " + err.message, "danger");
    } finally {
      showLoadingState(false);
    }
  });
});
