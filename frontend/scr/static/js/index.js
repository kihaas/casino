document.addEventListener('DOMContentLoaded', () => {
    // Check auth status
    checkAuthStatus();

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Game navigation
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => {
        item.addEventListener('click', () => {
            gameItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // Here you would load the selected game
        });
    });
});

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/profile/balance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const usernameEl = document.getElementById('sidebar-username');
            const balanceEl = document.getElementById('sidebar-balance');

            if (usernameEl) usernameEl.textContent = 'User'; // You would get username from another endpoint
            if (balanceEl) balanceEl.textContent = `$${data.balance.toFixed(2)}`;
        } else {
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

async function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}