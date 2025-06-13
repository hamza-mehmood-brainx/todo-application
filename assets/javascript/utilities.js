// utilities.js
export function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} alert-dismissible fade show`;
  toast.role = "alert";
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.innerHTML = "";
  container.appendChild(toast);
}

export function validateTodo(todo) {
  console.log("Validating todo:", todo);
  return (
    todo &&
    typeof todo === "object" &&
    typeof todo.id === "string" &&
    typeof todo.title === "string" &&
    todo.title.length >= 3 &&
    typeof todo.completed === "boolean"
  );
}
