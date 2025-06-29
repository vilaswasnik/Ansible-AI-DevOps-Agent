document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    const msgDiv = document.getElementById('login-message');
    if (data.success) {
        window.location.href = '/aiagent.html';
    } else if (data.resetRequired) {
        window.location.href = `/reset.html?user=${encodeURIComponent(username)}`;
    } else {
        msgDiv.textContent = data.message || 'Login failed';
    }
});