let items = [];
let currentAngle = 0;
let spinning = false;

document.getElementById('item-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

function addItem() {
    const input = document.getElementById('item-input');
    const item = input.value.trim();
    if (item) {
        items.push(item);
        input.value = '';
        drawWheel();
    }
}

function drawWheel() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const size = 500;
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2;
    const angleStep = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, size, size);

    items.forEach((item, index) => {
        const angle = index * angleStep;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + angleStep);
        ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#ffffe0';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + angleStep / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(item, radius - 10, 10);
        ctx.restore();
    });
}

function spinWheel() {
    if (items.length === 0) {
        alert('추첨할 항목이 없습니다.');
        return;
    }
    if (spinning) return;

    spinning = true;
    const canvas = document.getElementById('wheel');
    const duration = 5000;  
    const rotations = 6;  

    const endAngle = (Math.random() * 2 * Math.PI) + (rotations * 2 * Math.PI);
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const angle = currentAngle + (endAngle - currentAngle) * progress;

        canvas.style.transform = `rotate(${angle}rad)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentAngle = angle % (2 * Math.PI);
            spinning = false;
            selectItem(currentAngle);
        }
    }

    requestAnimationFrame(animate);
}

function selectItem(angle) {
    const totalAngle = 2 * Math.PI;
    const segmentAngle = totalAngle / items.length;
    const adjustedAngle = (angle + Math.PI / 2) % totalAngle;
    const index = Math.floor(adjustedAngle / segmentAngle);
    const selectedItem = items[index];

    const resultContainer = document.getElementById('result');
    resultContainer.textContent = `추첨 결과: ${selectedItem}`;
}