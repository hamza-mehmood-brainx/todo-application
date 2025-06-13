import { showToast, validateTodo } from "./utilities.js";

const API_URL = "https://jsonplaceholder.typicode.com/todos";
const LOCAL_STORAGE_KEY = "todos";
const USER_ID = 1;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addTodoForm");
  const titleInput = document.getElementById("title");
  const completedInput = document.getElementById("completed");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validation
    if (!titleInput.checkValidity()) {
      titleInput.classList.add("is-invalid");
      return;
    }
    titleInput.classList.remove("is-invalid");

    const newTodo = {
      title: titleInput.value.trim(),
      completed: completedInput.checked,
      userId: USER_ID,
    };

    // Function to show loading state
    function showLoadingState(isLoading) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = isLoading;
      submitBtn.innerHTML = isLoading
        ? '<span class="spinner-border spinner-border-sm"></span> Loading...'
        : "Submit";
    }

    try {
      showLoadingState(true);
      // API call
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();

      // Assign a unique ID
      data.id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Validating Todo before saving
      if (!validateTodo(data)) {
        showToast("Invalid todo data. Please check your input.", "danger");
        return;
      }
      // Save to localStorage
      const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      todos.push(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));

      // Reset form
      form.reset();
      showToast("Todo added successfully!", "success");
    } catch (error) {
      showToast("Failed to add todo. Please try again.", "danger");
    } finally {
      showLoadingState(false);
    }
  });
});
