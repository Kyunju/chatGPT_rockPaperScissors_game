class Emoji {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 0: 가위, 1: 바위, 2: 보
    this.speed = 0.3;
    this.radius = 13;
  }

  draw(ctx) {
    const emojiCharacter =
      this.type === 0 ? '✂️' : this.type === 1 ? '🪨' : '✋';

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiCharacter, this.x, this.y);
  }

  updatePosition(target) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const emojis = [];

function generateEmojis() {
  for (let i = 0; i < 20; i++) {
    for (let type = 0; type < 3; type++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      emojis.push(new Emoji(x, y, type));
    }
  }
}

function getClosestEmoji(emoji) {
  let minDistance = Infinity;
  let closestEmoji = null;

  for (let otherEmoji of emojis) {
    if (emoji === otherEmoji) continue;
    const dx = emoji.x - otherEmoji.x;
    const dy = emoji.y - otherEmoji.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
      closestEmoji = otherEmoji;
    }
  }

  return closestEmoji;
}

function checkCollisions() {
  for (let i = 0; i < emojis.length; i++) {
    for (let j = i + 1; j < emojis.length; j++) {
      const dx = emojis[i].x - emojis[j].x;
      const dy = emojis[i].y - emojis[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = emojis[i].radius + emojis[j].radius;

      if (distance < minDistance) {
        const winnerType = (emojis[i].type - emojis[j].type + 3) % 3;

        if (winnerType === 1) {
          // emojis[i]가 이김
          emojis[j].type = emojis[i].type;
        } else if (winnerType === 2) {
          // emojis[j]가 이김
          emojis[i].type = emojis[j].type;
        }
      }
    }
  }
}

function updatePositions() {
  for (let emoji of emojis) {
    const targetType = (emoji.type + 2) % 3;
    const targetEmojis = emojis.filter((e) => e.type === targetType);

    if (targetEmojis.length === 0) continue;

    let targetEmoji = targetEmojis[0];
    let minDistance = Infinity;

    for (let e of targetEmojis) {
      const dx = emoji.x - e.x;
      const dy = emoji.y - e.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        targetEmoji = e;
      }
    }

    emoji.updatePosition(targetEmoji);

    // 겹치지 않게 하기 위한 반발력 추가
    for (let otherEmoji of emojis) {
      if (emoji === otherEmoji) continue;
      const dx = emoji.x - otherEmoji.x;
      const dy = emoji.y - otherEmoji.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = emoji.radius + otherEmoji.radius;

      if (distance < minDistance) {
        const overlap = minDistance - distance;
        const angle = Math.atan2(dy, dx);
        emoji.x += Math.cos(angle) * overlap * 0.5;
        emoji.y += Math.sin(angle) * overlap * 0.5;
        otherEmoji.x -= Math.cos(angle) * overlap * 0.5;
        otherEmoji.y -= Math.sin(angle) * overlap * 0.5;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let emoji of emojis) {
    emoji.draw(ctx);
  }
}

function gameLoop() {
  checkCollisions();
  updatePositions();
  draw();
  requestAnimationFrame(gameLoop);
}

generateEmojis();
gameLoop();
