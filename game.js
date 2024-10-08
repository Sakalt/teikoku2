const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let objects = []; // ゲーム内のオブジェクト
let residents = []; // 住民のリスト
let paths = []; // 道路のパス
let isDrawingRoad = false; // 道路の描画中フラグ
let mouseX = 0; // マウスのX座標
let mouseY = 0; // マウスのY座標

// マウスの位置を追跡
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// マウスクリックで道路を描く
canvas.addEventListener('click', () => {
    if (isDrawingRoad) {
        paths.push({ x: mouseX, y: mouseY });
    }
});

// ゲームの初期化
function init() {
    loadGame(); // 保存データがあれば読み込む
    draw(); // 描画を開始
}

// 土台を作成
function createFoundation() {
    const width = parseInt(document.getElementById('foundationWidth').value) || 100;
    const height = parseInt(document.getElementById('foundationHeight').value) || 20;
    objects.push({ type: 'foundation', x: mouseX, y: mouseY, width, height });
}

// 車のタイヤ作成
function createWheel() {
    const radius = parseInt(document.getElementById('wheelRadius').value) || 10;
    objects.push({ type: 'wheel', x: mouseX, y: mouseY, radius });
}

// 家を作る
function createHouse() {
    const width = parseInt(document.getElementById('houseWidth').value) || 50;
    const height = parseInt(document.getElementById('houseHeight').value) || 50;
    objects.push({ type: 'house', x: mouseX, y: mouseY, width, height });
}

// 会社を作る（名前指定）
function createCompany() {
    const name = document.getElementById('companyName').value || '会社';
    const width = parseInt(document.getElementById('companyWidth').value) || 100;
    const height = parseInt(document.getElementById('companyHeight').value) || 100;
    objects.push({ type: 'company', x: mouseX, y: mouseY, width, height, name });
}

// 道路を作成（パスを指定）
function startDrawingRoad() {
    isDrawingRoad = true;
    paths = [];
}

// 道路を確定
function createRoad() {
    if (paths.length > 1) {
        objects.push({ type: 'road', path: paths });
    }
    isDrawingRoad = false;
}

// 高速道路を作成
function createHighway() {
    startDrawingRoad();
    // 高速道路としての処理を追加する場合はここに記述
}

// 車を作る
function createCar() {
    const width = parseInt(document.getElementById('carWidth').value) || 30;
    const height = parseInt(document.getElementById('carHeight').value) || 15;
    objects.push({ type: 'car', x: mouseX, y: mouseY, width, height, speed: 2 });
}

// 住民を追加（名前と画像指定、動作追加）
function createResident() {
    const name = document.getElementById('residentName').value || '住民';
    const imageInput = document.getElementById('residentImage');
    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            residents.push({ name, x: mouseX, y: mouseY, image, targetHouse: null, action: 'wander' });
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert('住民の画像を選択してください');
    }
}

// オブジェクトの描画
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const obj of objects) {
        switch (obj.type) {
            case 'foundation':
                ctx.fillStyle = 'brown';
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                break;
            case 'wheel':
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'house':
                ctx.fillStyle = 'blue';
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                break;
            case 'company':
                ctx.fillStyle = 'green';
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.fillText(obj.name, obj.x + 5, obj.y + 15);
                break;
            case 'road':
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(obj.path[0].x, obj.path[0].y);
                for (let i = 1; i < obj.path.length; i++) {
                    ctx.lineTo(obj.path[i].x, obj.path[i].y);
                }
                ctx.stroke();
                break;
            case 'car':
                ctx.fillStyle = 'purple';
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                obj.x += obj.speed; // 車の移動
                if (obj.x > canvas.width) obj.x = -obj.width; // 画面外に出たら戻す
                break;
        }
    }
    
    // 住民の描画と動作
    for (const resident of residents) {
        iちf (resident.image.complete) {
            ctx.drawImage(resident.image, resident.x, resident.y, 20, 20);
        }
        if (resident.action === 'wander') {
            resident.x += Math.random() * 2 - 1;
            resident.y += Math.random() * 2 - 1;
        }
        // 簡単な家に入る動作
        if (resident.targetHouse) {
            const house = resident.targetHouse;
            resident.x += (house.x - resident.x) * 0.01;
            resident.y += (house.y - resident.y) * 0.01;
        }
    }
    requestAnimationFrame(draw);
}

// ゲームの状態を保存
function saveGame() {
    localStorage.setItem('gameState', JSON.stringify({ objects, residents }));
    alert('ゲームが保存されました！');
}

// ゲームの状態を読み込み
function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        objects = state.objects || [];
        residents = state.residents || [];
        alert('ゲームが読み込まれました！');
    }
}

// 初期化を実行
init();ち
