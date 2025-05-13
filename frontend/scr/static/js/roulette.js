
document.addEventListener("DOMContentLoaded", () => {
    const betAmountInput = document.getElementById('bet-amount');
    const quickBetButtons = document.querySelectorAll('.quick-bet');

    // Установка значения ставки по клику на кнопку
    quickBetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = button.dataset.amount;
            betAmountInput.value = amount;
        });
    });

    // Обработка нажатия на кнопку SPIN
    document.getElementById('spin-btn').addEventListener('click', async () => {
        const betAmount = parseFloat(betAmountInput.value);
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You need to log in first!');
            window.location.href = '/api/auth/login';
            return;
        }

        if (!betAmount || betAmount <= 0) {
            alert('Please enter a valid bet amount');
            return;
        }

        try {
            const response = await fetch('/api/games/roulette/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({amount: betAmount})
            });

            const data = await response.json();

            if (response.ok) {
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = `You got: ${data.result} (${data.color})`;
                resultDiv.className = `result ${data.color === 'red' ? 'win' : 'lose'}`;
                document.getElementById('balance').textContent = data.new_balance.toFixed(2);
            } else {
                alert(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        }

        // Создаем сектора
        sectors.forEach((sector, i) => {
            const outerSector = document.createElement('div');
            outerSector.className = 'sector';
            outerSector.style.transform = `rotate(${i * sectorAngle}deg)`;
            outerSector.style.background = sector.color;

            const innerSector = document.createElement('div');
            innerSector.className = 'sector-label';
            innerSector.textContent = sector.number;
            innerSector.style.transform = `rotate(${sectorAngle / 2}deg)`;

            outerSector.appendChild(innerSector);
            wheel.appendChild(outerSector);
        });

        // Вращение
        spinBtn.addEventListener('click', () => {
            const betAmount = parseFloat(betAmountInput.value);

            if (!betAmount || betAmount <= 0) {
                alert('Enter a valid bet amount');
                return;
            }

            const randomIndex = Math.floor(Math.random() * sectors.length);
            const winningNumber = sectors[randomIndex].number;
            const winningColor = sectors[randomIndex].color;

            const rotation = 360 * 5 + (randomIndex * sectorAngle); // 5 полных оборотов

            wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
            wheel.style.transform = `rotate(${rotation}deg)`;

            resultDisplay.classList.remove('win', 'lose');
            resultDisplay.textContent = `You got: ${winningNumber} (${winningColor})`;

            setTimeout(() => {
                resultDisplay.classList.add(winningColor === 'red' ? 'win' : 'lose');
            }, 5100);
        });
    });
});