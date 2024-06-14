let items = ["떡볶이", "삽겹살", "김밥", "곱창", "불고기", "순두부찌개", "칼국수", "된장찌개", "비빔밥", "김치찌개"];
let currentAngle = 0;
let spinning = false;

document.addEventListener('DOMContentLoaded', function() {
    drawWheel(); 
});

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

javascript


function selectItem(angle) {
    const totalAngle = 2 * Math.PI;
    const segmentAngle = totalAngle / items.length;

    // 화살표가 가리키는 각도를 계산합니다.
    let arrowAngle = (angle + Math.PI / 2) % (2 * Math.PI); // +π/2를 추가하여 90도(π/2 라디안)만큼 이동

    if (arrowAngle < 0) {
        arrowAngle += 2 * Math.PI; // 음수 값이면 다시 범위 내로 조정
    }

    // 화살표가 가리키는 각도가 어떤 항목의 각도 범위에 있는지 확인합니다.
    for (let i = 0; i < items.length; i++) {
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // 각도가 항목의 범위 내에 있는지 확인합니다.
        if (arrowAngle >= startAngle && arrowAngle < endAngle) {
            const selectedItem = items[i];
            const resultContainer = document.getElementById('result');
            resultContainer.textContent = `추첨 결과: ${selectedItem}`;
            return;
        }
    }
}