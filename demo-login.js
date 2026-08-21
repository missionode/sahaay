document.querySelectorAll('.role-launch').forEach((button) => {
  button.addEventListener('click', () => {
    const role = button.dataset.role;
    window.location.href = `demo-view.html?role=${encodeURIComponent(role)}`;
  });
});
