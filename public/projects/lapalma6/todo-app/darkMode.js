const toggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check saved preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  toggle.textContent = 'Disable Dark Mode';
}

// Toggle function
toggle.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    toggle.textContent = 'Enable Dark Mode';
  } else {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    toggle.textContent = 'Disable Dark Mode';
  }
});