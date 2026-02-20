const codersData = [
    { id: 1, name: "Md. Samiul Islam Soumik", batch: "Batch - 5", rating: "2 star (Max Rating - 1587)", cf: "Soumik_SHU", cc: "soumik_prime", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Fiaze Ahamed", batch: "Batch - 4", rating: "3 star (Max Rating - 1650)", cf: "fiaze_code", cc: "fiaze_master", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "MD. Tanbir Hasan", batch: "Batch - 5", rating: "2 star (Max Rating - 1490)", cf: "tanbir_dev", cc: "tanbir_pro", img: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "MD Rayhan", batch: "Batch - 3", rating: "4 star (Max Rating - 1720)", cf: "rayhan_algo", cc: "rayhan_boss", img: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Md Murad Hossain", batch: "Batch - 5", rating: "2 star (Max Rating - 1510)", cf: "murad_h", cc: "murad_dev", img: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "Sharif Ahmed", batch: "Batch - 4", rating: "2 star (Max Rating - 1555)", cf: "sharif_code", cc: "sharif_x", img: "https://i.pravatar.cc/150?u=6" },
    { id: 7, name: "Sakib Al Hasan", batch: "Batch - 5", rating: "2 star (Max Rating - 1480)", cf: "sakib_75", cc: "sakib_pro", img: "https://i.pravatar.cc/150?u=7" },
    { id: 8, name: "Nusrat Jahan", batch: "Batch - 4", rating: "3 star (Max Rating - 1605)", cf: "nusrat_j", cc: "nusrat_dev", img: "https://i.pravatar.cc/150?u=8" },
    { id: 9, name: "Kamrul Hasan", batch: "Batch - 3", rating: "4 star (Max Rating - 1750)", cf: "kamrul_h", cc: "kamrul_master", img: "https://i.pravatar.cc/150?u=9" },
    { id: 10, name: "Rahim Uddin", batch: "Batch - 5", rating: "2 star (Max Rating - 1530)", cf: "rahim_u", cc: "rahim_code", img: "https://i.pravatar.cc/150?u=10" },
    { id: 11, name: "Karim Islam", batch: "Batch - 4", rating: "3 star (Max Rating - 1620)", cf: "karim_i", cc: "karim_dev", img: "https://i.pravatar.cc/150?u=11" },
    { id: 12, name: "Lina Akter", batch: "Batch - 5", rating: "2 star (Max Rating - 1470)", cf: "lina_a", cc: "lina_pro", img: "https://i.pravatar.cc/150?u=12" }
];

// Grid Config
const COLS = 6;
const ROWS = 3;
const GRID_SIZE = COLS * ROWS;
const gridContainer = document.getElementById('codersGrid');
const marqueeTrack = document.getElementById('marqueeTrack');
let gridSlots = [];
let activeCoderId = null;
let loopInterval;
let isHovered = false;

// History buffer
const recentMoves = [];
const MAX_HISTORY = 6;

// 1. Initialize Grid: Ensure Valid Constraint State
function initGrid() {
    let attempts = 0;
    let isValid = false;

    // Retry loop to generate a valid starting grid
    while (!isValid && attempts < 100) {
        attempts++;
        gridSlots = [];

        // Setup Grid Structure
        for (let i = 0; i < GRID_SIZE; i++) {
            gridSlots.push({
                index: i,
                col: i % COLS,
                row: Math.floor(i / COLS),
                content: null
            });
        }

        // Randomly place 1 empty slot per column (Basic Distribution)
        const emptySlotIndices = [];
        for (let c = 0; c < COLS; c++) {
            const randomRow = Math.floor(Math.random() * ROWS);
            const slotIndex = randomRow * COLS + c;
            emptySlotIndices.push(slotIndex);
        }

        // Fill remaining with coders
        let availableSlots = gridSlots.filter(s => !emptySlotIndices.includes(s.index));
        const shuffledCoders = [...codersData].sort(() => Math.random() - 0.5);

        shuffledCoders.forEach((coder, i) => {
            if (i < availableSlots.length) {
                availableSlots[i].content = coder;
            }
        });

        // Check if this random setup violates "No Adjacent Empty"
        if (checkConstraints()) {
            isValid = true;
            console.log("Valid initial grid found on attempt", attempts);
        }
    }

    if (!isValid) console.error("Could not generate valid initial grid.");

    renderGrid();
}

function renderGrid() {
    gridContainer.innerHTML = '';

    gridSlots.forEach(slot => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.dataset.slotIndex = slot.index;
        div.dataset.col = slot.col;

        if (slot.content) {
            div.appendChild(createCoderCard(slot.content));
        }
        gridContainer.appendChild(div);
    });
}

function createCoderCard(coder) {
    const card = document.createElement('div');
    card.className = `coder-card filled ${activeCoderId === coder.id ? 'active' : ''}`;
    card.dataset.id = coder.id;

    card.innerHTML = `
        <img src="${coder.img}" alt="${coder.name}">
        <div class="custom-tooltip">
            <div class="tooltip-header">
                <span class="badge-batch">${coder.batch}</span>
                <span class="badge-rating">${coder.rating}</span>
            </div>
            <div class="tooltip-user">
                <img src="${coder.img}" alt="Avatar">
                <span class="tooltip-name">${coder.name}</span>
            </div>
            <div class="tooltip-handles">
                <div>Codeforces Handle: ${coder.cf}</div>
                <div>CodeChef Handle: ${coder.cc}</div>
            </div>
        </div>
    `;

    card.addEventListener('mouseenter', () => {
        isHovered = true;
        setActive(coder.id);
    });

    card.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    return card;
}

// 2. Initialize Marquee
function initMarquee() {
    codersData.forEach(coder => {
        const span = document.createElement('div');
        span.className = 'marquee-item';
        span.textContent = coder.name;
        span.addEventListener('click', () => {
            setActive(coder.id);
        });
        marqueeTrack.appendChild(span);
    });
}

// 3. Set Active State
function setActive(coderId) {
    activeCoderId = coderId;
    document.querySelectorAll('.coder-card').forEach(card => {
        if (parseInt(card.dataset.id) === coderId) card.classList.add('active');
        else card.classList.remove('active');
    });

    const marqueeItems = document.querySelectorAll('.marquee-item');
    marqueeItems.forEach((item, index) => {
        if (codersData[index].id === coderId) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            item.classList.remove('active');
        }
    });
}

// 4. Loop Logic
function startLoop() {
    loopInterval = setInterval(() => {
        if (isHovered) return;
        shuffleConstraint();
    }, 2500);
}

function shuffleConstraint() {
    const filledSlots = gridSlots.filter(s => s.content !== null && !recentMoves.includes(s.content.id));
    const emptySlots = gridSlots.filter(s => s.content === null);

    if (filledSlots.length === 0 || emptySlots.length === 0) return;

    for (let i = 0; i < 50; i++) { // Increased attempts
        const sourceSlot = filledSlots[Math.floor(Math.random() * filledSlots.length)];
        const targetSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];

        const originalSourceContent = sourceSlot.content;

        // Try Move
        sourceSlot.content = null;
        targetSlot.content = originalSourceContent;

        if (checkConstraints()) {
            performSwap(sourceSlot, targetSlot);
            // Revert data here for the animation function to handle? No, performSwap needs correct final state logic?
            // Actually performSwap assumes data is correct or sets it?
            // Let's reset and let performSwap handle the transition
            sourceSlot.content = originalSourceContent;
            targetSlot.content = null;

            // Actually apply for real inside performSwap wrapper logic to be safe
            // But wait, checkConstraints used live data.
            // If I return here, I need to call performSwap.
            performSwap(sourceSlot, targetSlot);
            return;
        }

        // Revert
        sourceSlot.content = originalSourceContent;
        targetSlot.content = null;
    }
}

function checkConstraints() {
    // Constraint: NO ADJACENT EMPTY SLOTS (Max 1 consecutively)
    // Check Rows
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
            const current = gridSlots[r * COLS + c].content;
            const next = gridSlots[r * COLS + (c + 1)].content;
            if (current === null && next === null) return false;
        }
    }
    // Check Columns
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 1; r++) {
            const current = gridSlots[r * COLS + c].content;
            const next = gridSlots[(r + 1) * COLS + c].content;
            if (current === null && next === null) return false;
        }
    }
    return true;
}

function performSwap(sourceSlot, targetSlot) {
    const coderToMove = sourceSlot.content;
    recentMoves.push(coderToMove.id);
    if (recentMoves.length > MAX_HISTORY) recentMoves.shift();

    const sourceDiv = document.querySelector(`.grid-item[data-slot-index="${sourceSlot.index}"]`);
    const targetDiv = document.querySelector(`.grid-item[data-slot-index="${targetSlot.index}"]`);

    // 1. Update Data Model NOW to prevent race conditions or logic gaps
    targetSlot.content = sourceSlot.content;
    sourceSlot.content = null;

    // 2. Animate
    const card = sourceDiv.querySelector('.coder-card');
    if (card) {
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
    }

    setTimeout(() => {
        sourceDiv.innerHTML = '';
        targetDiv.innerHTML = '';
        const newCard = createCoderCard(coderToMove);
        targetDiv.appendChild(newCard);
        newCard.classList.remove('filled');
        setTimeout(() => newCard.classList.add('filled'), 50);
        setActive(coderToMove.id);
    }, 300);
}

// Buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    let currentIndex = codersData.findIndex(c => c.id === activeCoderId);
    if (currentIndex > 0) setActive(codersData[currentIndex - 1].id);
    else setActive(codersData[codersData.length - 1].id);
});
document.getElementById('nextBtn').addEventListener('click', () => {
    let currentIndex = codersData.findIndex(c => c.id === activeCoderId);
    if (currentIndex < codersData.length - 1) setActive(codersData[currentIndex + 1].id);
    else setActive(codersData[0].id);
});

// Init
initGrid();
initMarquee();
setActive(codersData[0].id);
startLoop();
