document.addEventListener("DOMContentLoaded", () => {
    const sectors = [
        { number: 0, color: "green" },
        { number: 32, color: "red" },
        { number: 15, color: "black" },
        { number: 19, color: "red" },
        { number: 4, color: "black" },
        { number: 21, color: "red" },
        { number: 2, color: "black" },
        { number: 25, color: "red" },
        { number: 17, color: "black" },
        { number: 34, color: "red" },
        { number: 6, color: "black" },
        { number: 27, color: "red" },
        { number: 13, color: "black" },
        { number: 36, color: "red" },
        { number: 11, color: "black" },
        { number: 30, color: "red" },
        { number: 8, color: "black" },
        { number: 23, color: "red" },
        { number: 10, color: "black" },
        { number: 5, color: "red" },
        { number: 24, color: "black" },
        { number: 16, color: "red" },
        { number: 33, color: "black" },
        { number: 1, color: "red" },
        { number: 20, color: "black" },
        { number: 14, color: "red" },
        { number: 31, color: "black" },
        { number: 9, color: "red" },
        { number: 22, color: "black" },
        { number: 18, color: "red" },
        { number: 29, color: "black" },
        { number: 7, color: "red" },
        { number: 28, color: "black" },
        { number: 12, color: "red" },
        { number: 35, color: "black" },
        { number: 3, color: "red" },
        { number: 26, color: "black" }
    ];

    const wheel = document.getElementById('roulette-wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resultDisplay = document.getElementById('result');
    const betAmountInput = document.getElementById('bet-amount');

    const totalSectors = sectors.length;
    const sectorAngle = 360 / totalSectors;

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