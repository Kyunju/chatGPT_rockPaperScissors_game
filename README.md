# 가위 바위 보 시뮬레이션 게임

해당 시뮬레이션은 다음과 같은 로직으로 움직입니다.

1. 가위 -> 바위 -> 보 -> 가위 를 향해 움직임
2. 아이콘끼리 충돌 할 때 상성에 따라 진쪽이 이긴쪽을 변경됨
3. 하나의 아이콘으로 모두 바뀌면 정지

<br>

# ChatGPT 를 활용하여

인스타그램에서 이러한 영상을 하나 봤었는데 (찾으면 링크를 올려두겠습니다.) 따라서 만들어보고 싶어서 chatGPT를 통해 어떻게 구현 할 수 있을지 고민하고 만들어보았습니다.

아래는 ChatGPT와 나눈 대화들을 기록합니다.

## ChatGPT와의 대화

#### _질문1._

**내가 만들고 싶은 게임이 있는데 잘 듣고 가이드라인을 제시해주면 좋겠어**

1. 게임 내용 : <br>

- 가위, 바위, 보 이모티콘이 각각 20개씩 화면에 랜덤으로 생성된다.
- 가위는 바위를 향해 움직이고, 바위는 가위를 향해, 보는 바위를 향해 움직인다.
- 각 가위, 바위, 보 이모티콘이 닿으면 가위, 바위, 보 상성에 의해서 진 이모티콘이 이긴 이모티콘으로 변경된다. - 예시 : 가위랑 보가 충돌하면 보가 졌으니 가위 이모티콘으로 변경, 바위랑 보 이모티콘이 닿으면 바위가 졌으니 보 이모티콘으로 변경

2. 기술 : html, css, javascript 로 구현 javscript는 ES6 문법을 준수

#### _답변1._

좋습니다! 가위바위보 이모티콘 게임을 만들기 위한 가이드라인을 제공해 드리겠습니다. 기본적인 구조는 아래와 같습니다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>가위바위보 이모티콘 게임</title>
    <style>
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>
  <body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script src="game.js"></script>
  </body>
</html>
```

```javascript
class Emoji {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 0: 가위, 1: 바위, 2: 보
    this.speed = 1;
    this.radius = 15;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle =
      this.type === 0 ? 'red' : this.type === 1 ? 'blue' : 'green';
    ctx.fill();
    ctx.closePath();
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
    const targetType = (emoji.type + 1) % 3;
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
```

#### _질문2_

**아주 좋아 내가 원하는 대로 되었어 근데 움직일 때 같은 색의 원일 경우 서로 겹치는 것 같아 원이 서로 겹치지 않도록 수정 할 수 있어?**

#### _답변2_

네, 서로 겹치지 않게 수정할 수 있습니다. 원이 겹치지 않도록 하는 방법 중 하나는 원들이 서로 가까워질 때 반발력을 주어 겹치지 않게 하는 것입니다. updatePositions() 함수를 다음과 같이 수정하여 원이 겹치지 않게 할 수 있습니다.

```javascript
function updatePositions() {
  for (let emoji of emojis) {
    const targetType = (emoji.type + 1) % 3;
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
```

<br>

#### _질문3_

**원을 실제 이모지로 바꿀 수 있는 방법이 있을까?**

#### _답변3_

물론 가능합니다! 원 대신 실제 이모지를 그리려면 Emoji 클래스의 draw() 메서드를 수정해야 합니다. 이모지를 그리려면 fillText() 메서드를 사용할 수 있습니다. 아래 코드를 참고해주세요.

```javascript
class Emoji {
  // ... (생략)

  draw(ctx) {
    const emojiCharacter =
      this.type === 0 ? '✌️' : this.type === 1 ? '✊' : '✋';

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiCharacter, this.x, this.y);
  }

  // ... (생략)
}
```

위 코드에서 draw() 메서드를 수정하여 원 대신 이모지가 그려지도록 했습니다. 이제 캔버스에서 가위바위보 이모지가 움직이고 충돌하는 것을 볼 수 있습니다. 이모지 크기를 조절하려면 ctx.font의 값을 변경하면 됩니다.
