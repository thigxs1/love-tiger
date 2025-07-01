// Casino Celebrity Roulette Game
// Author: Casino Developer
// Description: Interactive roulette game with celebrity prizes

class CasinoCelebrityRoulette {
    constructor() {
        this.isSpinning = false;
        this.playerChips = 5000;
        this.betAmount = 100;
        this.spinCost = 100;
        this.currentWinner = null;
        
        // Love interests configuration
        // NOTE: Place profile images in 'assets/' folder with these exact filenames:
        this.loveInterests = [
            {
                id: 1,
                name: "Reverssi",
                    image: "assets/reverssi.jpg", // PLACE IMAGE HERE: assets/reverssi.jpg
                    description: "💕 Que match incrível! Você encontrou Reverssi! Nosso Cristian Grey do interior, jovem trabalhor, engenheiro e de coração gigante. As vezes meio lerdão, mas cheio de potencial e tcham",
                    rarity: "Alma Gêmea",
                    value: 1500,
                    color: "#8B008B",
                    whatsapp: "5519984244480",
                    message: "Oii amor! Me mostra por que te chamam de SR. Grey e me usa! ❤️"
            },
            {
                id: 2,
                name: "Boleta",
                image: "assets/boleta.jpg", // PLACE IMAGE HERE: assets/boleta.jpg
                description: "💖 Você achou Boleta! Gordinho bololo da galera, amante de rodizio japones, loiras e whisky, um homem de classe alguns diriam. Que combinação perfeita!",
                rarity: "Coração Doce",
                value: 1200,
                color: "#FF69B4",
                whatsapp: "5519983656904",
                message: "Olá Bolinha, me mostra que não é só em itaquera que habita um gigante rs 💕"
            },
            {
                id: 3,
                name: "Fiapo",
                image: "assets/fiapo.jpg", // PLACE IMAGE HERE: assets/fiapo.jpg
                description: "💝 Encontrou Fiapo! Amante do RJ e dançarino de longa data, pode ser que encontre sua paz nesses cachinhos (Ou não)",
                rarity: "Sensível",
                value: 1400,
                color: "#9370DB",
                whatsapp: "5519982087454",
                message: "Ei FP, faz a jogadinha pra mim! 🎰❤️"
            },
            {
                id: 4,
                name: "Raposo",
                image: "assets/raposo.jpg", // PLACE IMAGE HERE: assets/raposo.jpg
                description: "🦊 Que esperto! Você encontrou Raposo! Carinha de bebê, mas não se engane, este é nosso querido raposo, amante de raves e um antropo de talentos (as vezes uteis)",
                rarity: "Esperto",
                value: 1000,
                color: "#BA55D3",
                whatsapp: "5519981502331",
                message: "Raposo, me pegue! 🌟"
            },
            {
                id: 5,
                name: "Marson",
                image: "assets/marson.jpg", // PLACE IMAGE HERE: assets/marson.jpg
                description: "🌟 Nosso projeto de opala, viciado em experiencias e de grande coração, um pouco quieto mas se der uma chance... não vai se arrepender",
                rarity: "Protetor",
                value: 1600,
                color: "#8B008B",
                whatsapp: "5519978273226",
                message: "Olá Marson! Você foi meu prêmio especial! 💖"
            },
            {
                id: 6,
                name: "Thigas",
                image: "assets/thigas.jpg", // PLACE IMAGE HERE: assets/thigas.jpg
                description: "⚡ Talvez um pouco mais louco do que aceitavel, mas sincero e leal, fuma do bom e cozinha melhor 🍁❤️",
                rarity: "Energético",
                value: 1300,
                color: "#DA70D6",
                whatsapp: "5519998662579",
                message: "Me mostra que essas mãos sabem além de bolar e cozinhar...😏"
            },
            {
                id: 7,
                name: "Amigão",
                image: "assets/amigao.jpg", // PLACE IMAGE HERE: assets/amigao.jpg
                description: "🤗 Que sorte! Será? Você encontrou Amigão! Uma pessoa tão leal quanto desatenta, o empresário do grupo ( Tamo esperando ele aposentar geral ), sempre q louco nos agracia com um bom humor e piadas.",
                rarity: "Amigo Fiel",
                value: 1100,
                color: "#9370DB",
                whatsapp: "5519988403286",                    message: "Ei amigão, vai toma no cu 🎯💕"
            }
        ];

        this.init();
    }

    init() {
        this.createRouletteWheel();
        this.setupEventListeners();
        this.startJackpotAnimation();
        this.updatePlayerChips();
    }

    // Create the roulette wheel segments
    createRouletteWheel() {
        const wheel = document.getElementById('rouletteWheel');
        const segmentAngle = 360 / this.loveInterests.length;

        this.loveInterests.forEach((person, index) => {
            const segment = document.createElement('div');
            segment.className = 'roulette-segment';
            segment.innerHTML = `
                <div class="segment-background" style="background-image: url('${person.image}'); background-size: cover; background-position: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"></div>
                <div class="segment-content">
                    <strong>${person.name}</strong>
                </div>
            `;
            
            // Position each segment and set background image
            const rotation = segmentAngle * index;
            segment.style.transform = `rotate(${rotation}deg)`;
            segment.setAttribute('data-person-id', person.id);
            
            // Set fallback background color
            segment.style.backgroundColor = person.color;
            
            wheel.appendChild(segment);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        const spinButton = document.getElementById('spinButton');
        const closeModal = document.getElementById('closeModal');
        const playAgainButton = document.getElementById('playAgainButton');
        const claimPrizeButton = document.getElementById('claimPrizeButton');
        const modal = document.getElementById('prizeModal');

        spinButton.addEventListener('click', () => this.spinWheel());
        closeModal.addEventListener('click', () => this.closeModal());
        playAgainButton.addEventListener('click', () => this.playAgain());
        claimPrizeButton.addEventListener('click', () => this.claimPrize());
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spinWheel();
            }
            if (e.code === 'Escape') {
                this.closeModal();
            }
        });
    }

    // Animate jackpot counter
    startJackpotAnimation() {
        const jackpotElement = document.getElementById('jackpotAmount');
        let currentAmount = 1337420;
        
        setInterval(() => {
            currentAmount += Math.floor(Math.random() * 1000) + 100;
            jackpotElement.textContent = `❤️ ${currentAmount.toLocaleString()}`;
        }, 5000);
    }

    // Update player chips display
    updatePlayerChips() {
        document.getElementById('playerChips').textContent = this.playerChips.toLocaleString();
    }

    // Main spin wheel function
    spinWheel() {
        if (this.isSpinning) return;
        
        // Check if player has enough chips
        if (this.playerChips < this.spinCost) {
            this.showInsufficientFundsAlert();
            return;
        }

        this.isSpinning = true;
        this.playerChips -= this.spinCost;
        this.updatePlayerChips();

        const spinButton = document.getElementById('spinButton');
        const wheel = document.getElementById('rouletteWheel');
        
        // Disable spin button
        spinButton.disabled = true;
        spinButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCURANDO...';

        // Add spinning class for animation
        wheel.classList.add('spinning');

        // Generate random result
        const winningIndex = Math.floor(Math.random() * this.loveInterests.length);
        const winningPerson = this.loveInterests[winningIndex];
        
        // Calculate final rotation
        const segmentAngle = 360 / this.loveInterests.length;
        const baseRotation = 1800; // 5 full rotations
        const finalRotation = baseRotation + (segmentAngle * winningIndex);
        
        // Apply rotation
        wheel.style.transform = `rotate(${finalRotation}deg)`;

        // Create spinning sound effect (visual feedback)
        this.createSpinningEffect();

        // Show result after animation
        setTimeout(() => {
            this.showWinningResult(winningPerson);
            this.isSpinning = false;
            
            // Reset button
            spinButton.disabled = false;
            spinButton.innerHTML = '<i class="fas fa-heart"></i> ENCONTRAR MEU AMOR <i class="fas fa-heart"></i>';
            
            // Remove spinning class
            wheel.classList.remove('spinning');
        }, 4000);
    }

    // Create visual spinning effects
    createSpinningEffect() {
        const container = document.querySelector('.game-container');
        
        // Add screen shake effect
        container.style.animation = 'shake 0.5s infinite';
        
        setTimeout(() => {
            container.style.animation = '';
        }, 3000);
    }

    // Show winning result modal
    showWinningResult(person) {
        const modal = document.getElementById('prizeModal');
        const prizeName = document.getElementById('prizeName');
        const prizeImage = document.getElementById('prizeImage');
        const prizeDescription = document.getElementById('prizeDescription');
        const prizeRarity = document.getElementById('prizeRarity');
        const prizeValue = document.getElementById('prizeValue');

        // Store current winner for WhatsApp claim
        this.currentWinner = person;

        // Update modal content
        prizeName.textContent = person.name;
        prizeImage.src = person.image;
        prizeImage.alt = person.name;
        prizeDescription.textContent = person.description;
        prizeRarity.textContent = person.rarity;
        prizeValue.textContent = person.value.toLocaleString();

        // Add prize value to player chips
        this.playerChips += person.value;
        this.updatePlayerChips();

        // Show modal with animation
        modal.classList.add('show');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Create confetti effect
        this.createConfettiEffect();
        
        // Play celebration sound effect (visual feedback)
        this.createCelebrationEffect();
    }

    // Create confetti animation
    createConfettiEffect() {
        const confettiContainer = document.getElementById('confettiContainer');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffc048', '#9b59b6', '#e74c3c'];
        
        // Clear previous confetti
        confettiContainer.innerHTML = '';
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    // Create celebration visual effects
    createCelebrationEffect() {
        const body = document.body;
        
        // Add celebration background flash
        body.style.animation = 'celebration-flash 0.5s ease-in-out 3';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 1500);
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('prizeModal');
        modal.classList.remove('show');
        
        // Restore body scroll when modal is closed
        document.body.style.overflow = '';
    }

    // Play again function
    playAgain() {
        this.closeModal();
        
        // Add some visual feedback
        const spinButton = document.getElementById('spinButton');
        spinButton.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            spinButton.style.animation = '';
        }, 500);
    }

    // Claim prize function - opens WhatsApp with pre-written message
    claimPrize() {
        // Get the current winner from the stored data
        const winner = this.currentWinner;
        if (!winner) {
            console.error('No winner data found');
            return;
        }
        
        const phoneNumber = winner.whatsapp;
        const message = encodeURIComponent(winner.message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappURL, '_blank');
        
        // Optional: Also close the modal after claiming
        // this.closeModal();
    }

    // Show insufficient funds alert
    showInsufficientFundsAlert() {
        // Create custom alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'insufficient-funds-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Corações Insuficientes!</h3>
                <p>Você precisa de pelo menos ${this.spinCost} corações para procurar o amor.</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 3000);
    }
}

// Additional CSS for effects (injected via JavaScript)
const additionalStyles = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    
    @keyframes celebration-flash {
        0%, 100% { background-color: rgba(255, 215, 0, 0); }
        50% { background-color: rgba(255, 215, 0, 0.1); }
    }
    
    .insufficient-funds-alert {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .alert-content {
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        border: 2px solid #ffd700;
    }
    
    .alert-content i {
        font-size: 3rem;
        margin-bottom: 15px;
        color: #ffd700;
    }
    
    .alert-content h3 {
        margin-bottom: 15px;
        font-size: 1.5rem;
    }
    
    .alert-content button {
        background: #ffd700;
        border: none;
        padding: 10px 30px;
        border-radius: 20px;
        color: #333;
        font-weight: bold;
        cursor: pointer;
        margin-top: 15px;
        transition: all 0.3s ease;
    }
    
    .alert-content button:hover {
        background: #ffed4e;
        transform: translateY(-2px);
    }
    
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const casinoGame = new CasinoCelebrityRoulette();
    
    // Add some fun console messages for developers
    console.log(`
    💕 ROLETA DO AMOR 💕
    ====================
    
    Bem-vindo à melhor roleta romântica!
    
    Dicas para desenvolvedores:
    - Pressione ESPAÇO para procurar o amor
    - Pressione ESC para fechar modais
    - Verifique o console para logs de debug
    
    Estrutura de imagens:
    📁 assets/
    ├── reverssi.jpg
    ├── boleta.jpg
    ├── fiapo.jpg
    ├── raposo.jpg
    ├── marson.jpg
    ├── thigas.jpg
    └── amigao.jpg
    
    Encontre seu match perfeito! 💖
    `);
    
    // Debug mode for developers
    window.loveDebug = {
        addHearts: (amount) => {
            casinoGame.playerChips += amount;
            casinoGame.updatePlayerChips();
            console.log(`💖 Adicionados ${amount} corações! Total: ${casinoGame.playerChips}`);
        },
        
        forceMatch: (personIndex) => {
            if (personIndex >= 0 && personIndex < casinoGame.loveInterests.length) {
                const person = casinoGame.loveInterests[personIndex];
                casinoGame.showWinningResult(person);
                console.log(`💕 Forçado match: ${person.name}`);
            }
        },
        
        listPeople: () => {
            console.table(casinoGame.loveInterests.map(p => ({
                id: p.id,
                name: p.name,
                rarity: p.rarity,
                value: p.value
            })));
        }
    };
    
    console.log('🔧 Debug mode ativo! Use window.loveDebug para comandos especiais.');
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('💾 Service Worker registrado com sucesso!');
            })
            .catch(error => {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
        console.log(`
        ⌨️  ATALHOS DE TECLADO
        =====================
        
        ESPAÇO: Girar a roleta
        ESC: Fechar modal
        Ctrl + /: Mostrar esta ajuda
        
        💡 Dica: Abra o console para ver comandos de debug!
        `);
    }
});

// Fun Easter Eggs
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Konami Code activated!
        window.casinoDebug.addChips(10000);
        
        const body = document.body;
        body.style.animation = 'rainbow 1s ease infinite';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 5000);
        
        console.log('🎊 KONAMI CODE ATIVADO! +10,000 fichas bônus!');
        konamiCode = [];
    }
});
