// --tile-size: 48px;
// --helmet-offset: 12px;
// --game-size: calc(var(--tile-size) * 20);

const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`); // 48px
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`); // 12px
root.style.setProperty('--game-size', `${GAME_SIZE}px`); // 48px * 20 = 960px

// ----

function createBoard() {
  const boardElement = document.getElementById('board');

  function createElement(options) {
    let { item, top, left } = options;

    const htmlElement = document.createElement('div');
    htmlElement.className = item;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;

    boardElement.appendChild(htmlElement);

    function getNewDirection(buttonPressed) {
      switch(buttonPressed) {
        case 'ArrowUp':
          return { top: top - TILE_SIZE, left };
        case 'ArrowRight':
          return { top: top, left: left + TILE_SIZE };
        case 'ArrowDown':
          return { top: top + TILE_SIZE, left };
        case 'ArrowLeft':
          return { top: top, left: left - TILE_SIZE };
        default:
          return { top, left };
      }
    }

    function move(buttonPressed) {
      const { top: newTop, left: newLeft } = getNewDirection(buttonPressed);
      top = newTop;
      left = newLeft;

      htmlElement.style.top = `${top}px`;
      htmlElement.style.left = `${left}px`;
    }

    return {
      move,
    }
  }

  function createItem(options) {
    createElement(options);
  }

  function createHero(options) {
    const hero = createElement({
      item: 'hero',
      ...options,
    });

    document.addEventListener('keydown', (event) => {
      hero.move(event.key);
    })
  }

  function createEnemy(options) {
    const enemy = createElement({
      item: 'mini-demon',
      ...options,
    });

    setInterval(() => {
      const direction = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
      const randomIndex = Math.floor(Math.random() * direction.length);
      const randomDirection = direction[randomIndex];

      enemy.move(randomDirection);
    }, 1000);
  }

  return {
    createItem,
    createHero,
    createEnemy
  }
}

const board = createBoard();

board.createItem({ item: 'trap', top: TILE_SIZE * 10, left: TILE_SIZE * 10 });
board.createItem({ item: 'chest', top: TILE_SIZE * 15, left: TILE_SIZE * 15 });

board.createEnemy({ top: TILE_SIZE * 5, left: TILE_SIZE * 5 });
board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });

