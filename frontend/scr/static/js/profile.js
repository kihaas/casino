document.addEventListener('DOMContentLoaded', () => {
    // Initialize the profile page
    initProfilePage();

    // Set up event listeners
    setupEventListeners();

    // Load user data and history
    loadUserData();
});

function initProfilePage() {
    // Set default tab to games
    document.querySelector('.tab-btn[data-tab="games"]').classList.add('active');
    document.getElementById('games-tab').classList.add('active');

    // Hide amount input initially
    document.getElementById('amount-input').style.display = 'none';
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Transaction buttons
    document.getElementById('deposit-btn').addEventListener('click', () => showAmountInput('deposit'));
    document.getElementById('withdraw-btn').addEventListener('click', () => showAmountInput('withdraw'));

    // Confirm transaction
    document.getElementById('confirm-transaction').addEventListener('click', processTransaction);

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function switchTab(e) {
    const tabId = e.target.getAttribute('data-tab');

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function showAmountInput(transactionType) {
    const amountInput = document.getElementById('amount-input');
    amountInput.style.display = 'flex';
    amountInput.setAttribute('data-transaction-type', transactionType);

    // Clear previous input
    document.getElementById('transaction-amount').value = '';

    // Focus on the input field
    document.getElementById('transaction-amount').focus();
}

async function processTransaction() {
    const amountInput = document.getElementById('amount-input');
    const transactionType = amountInput.getAttribute('data-transaction-type');
    const amount = parseFloat(document.getElementById('transaction-amount').value);

    // Validate input
    if (isNaN(amount)) {
        showAlert('Please enter a valid amount', 'error');
        return;
    }

    if (amount <= 0) {
        showAlert('Amount must be positive', 'error');
        return;
    }

    try {
        const response = await fetch('/api/profile/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                type: transactionType,
                amount: amount
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(`Successfully ${transactionType}ed $${amount.toFixed(2)}`, 'success');
            amountInput.style.display = 'none';
            loadUserData(); // Refresh user data
        } else {
            showAlert(data.error || 'Transaction failed', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred', 'error');
    }
}

async function loadUserData() {
    try {
        // Load balance
        const balanceResponse = await fetch('/api/profile/balance', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            updateBalanceDisplay(balanceData.balance);
        }

        // Load history
        const historyResponse = await fetch('/api/profile/history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            updateGamesHistory(historyData.games);
            updateTransactionsHistory(historyData.transactions);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showAlert('Failed to load user data', 'error');
    }
}

function updateBalanceDisplay(balance) {
    const balanceElements = document.querySelectorAll('.balance-display, .sidebar .balance');
    balanceElements.forEach(el => {
        el.textContent = `$${balance.toFixed(2)}`;
    });

    // Update sidebar balance if exists
    const sidebarBalance = document.getElementById('sidebar-balance');
    if (sidebarBalance) {
        sidebarBalance.textContent = `$${balance.toFixed(2)}`;
    }
}

function updateGamesHistory(games) {
    const tbody = document.getElementById('games-history');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (games.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No games played yet</td></tr>';
        return;
    }

    games.forEach(game => {
        const tr = document.createElement('tr');
        tr.className = game.result >= 0 ? 'win-row' : 'lose-row';

        tr.innerHTML = `
            <td>${game.type}</td>
            <td>$${game.amount.toFixed(2)}</td>
            <td>${game.result >= 0 ? '+' : ''}${game.result.toFixed(2)}</td>
            <td>${formatDateTime(game.timestamp)}</td>
        `;

        tbody.appendChild(tr);
    });
}

function updateTransactionsHistory(transactions) {
    const tbody = document.getElementById('transactions-history');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No transactions yet</td></tr>';
        return;
    }

    transactions.forEach(trans => {
        const tr = document.createElement('tr');
        tr.className = `${trans.type}-row`;

        tr.innerHTML = `
            <td>${trans.type.charAt(0).toUpperCase() + trans.type.slice(1)}</td>
            <td>$${trans.amount.toFixed(2)}</td>
            <td>${formatDateTime(trans.timestamp)}</td>
        `;

        tbody.appendChild(tr);
    });
}

function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert-message ${type}`;
    alert.textContent = message;

    // Add to DOM
    document.body.appendChild(alert);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}