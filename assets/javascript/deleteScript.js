import { showToast } from "./utilities.js";
(function () {
  const API_URL = "https://jsonplaceholder.typicode.com/todos";
  const LOCAL_STORAGE_KEY = "todos";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("deleteTodoForm");
    const idInput = document.getElementById("todoId");
    const confirmModal = new bootstrap.Modal(
      document.getElementById("confirmModal")
    );
    const confirmBtn = document.getElementById("confirmDeleteBtn");

    let todoIdToDelete = null;
    // Form EventListner
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = parseInt(idInput.value);
      if (!id || id <= 0) {
        idInput.classList.add("is-invalid");
        return;
      }
      idInput.classList.remove("is-invalid");

      todoIdToDelete = id;
      confirmModal.show(); // Show confirmation modal
    });

    // Confimr Delete
    confirmBtn.addEventListener("click", async () => {
      if (!todoIdToDelete) return;

      try {
        confirmBtn.disabled = true;

        // Simulate DELETE API call
        const response = await fetch(`${API_URL}/${todoIdToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("API deletion failed");

        // Update localStorage
        let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const index = todos.findIndex((todo) => todo.id === todoIdToDelete);

        if (index === -1) {
          showToast("Todo not found in local storage.", "danger");
        } else {
          todos.splice(index, 1);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
          showToast("Todo deleted successfully!", "success");
          document.getElementById("deleteTodoForm").reset();
        }

        confirmModal.hide();
      } catch (err) {
        showToast("Error deleting todo. " + err.message, "danger");
      } finally {
        confirmBtn.disabled = false;
        todoIdToDelete = null;
      }
    });
  });
})();
