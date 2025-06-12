const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const LOCAL_STORAGE_KEY = 'todos';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('updateTodoForm');
  const idInput = document.getElementById('todoId');
  const titleInput = document.getElementById('title');
  const completedInput = document.getElementById('completed');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    const id = parseInt(idInput.value, 10);
    if (!id || id <= 0) {
      idInput.classList.add('is-invalid');
      return;
    }
    idInput.classList.remove('is-invalid');

    if (!titleInput.checkValidity()) {
      titleInput.classList.add('is-invalid');
      return;
    }
    titleInput.classList.remove('is-invalid');

    const updatedTodo = {
      id,
      title: titleInput.value.trim(),
      completed: completedInput.checked,
      userId: 1,
    };

    try {
      form.querySelector('button[type="submit"]').disabled = true;

      // Mock API PUT request
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) throw new Error('Failed to update via API.');

      // Update localStorage
      const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === -1) {
        showToast('Todo not found in local storage.', 'danger');
      } else {
        todos[index] = { ...todos[index], ...updatedTodo };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        showToast('Task updated using API!', 'success');
        form.reset();
      }
    } catch (err) {
      showToast('Error updating todo. ' + err.message, 'danger');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
});

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} alert-dismissible fade show`;
  toast.role = 'alert';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  container.innerHTML = '';
  container.appendChild(toast);
}
