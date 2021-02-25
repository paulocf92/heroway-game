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
  const elements = [];

  function createElement(options) {
    let { item, top, left } = options;

    const currentElement = { item, currentPosition: { top, left } };
    elements.push(currentElement);

    const htmlElement = document.createElement('div');
    htmlElement.className = item;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;

    boardElement.appendChild(htmlElement);

    function getNewDirection(buttonPressed, position) {
      switch(buttonPressed) {
        case 'ArrowUp':
          return { top: position.top - TILE_SIZE, left: position.left };
        case 'ArrowRight':
          return { top: position.top, left: position.left + TILE_SIZE };
        case 'ArrowDown':
          return { top: position.top + TILE_SIZE, left: position.left };
        case 'ArrowLeft':
          return { top: position.top, left: position.left - TILE_SIZE };
        default:
          return position;
      }
    }

    function validateMovement(position, conflictItem) {
      return (
        position.left >= 48 &&
        position.left <= 864 &&
        position.top >= 96 &&
        position.top <= 816 &&
        conflictItem?.item !== 'forniture'
      );
    }

    function getMovementConflict(position, els) {
      const conflictItem = els.find(currentElement => {
        return (
          currentElement.currentPosition.top === position.top &&
          currentElement.currentPosition.left === position.left
        );
      });

      return conflictItem;
    }

    function validateConflicts(currentEl, conflictItem) {
      function finishGame(message) {
        setTimeout(() => {
          alert(message);
          location.reload();
        }, 100);
      }
      if (currentEl.item === 'hero') {
        if (conflictItem?.item === 'mini-demon' ||
            conflictItem?.item === 'trap') {
          finishGame("Você morreu");
        }

        if (conflictItem?.item === 'chest') {
          finishGame("Você ganhou")
        }
      }

      if (currentEl.item === 'mini-demon' && conflictItem?.item === 'hero') {
        finishGame("Você morreu")
      }
    }

    function move(buttonPressed) {
      const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
      const conflictItem = getMovementConflict(newPosition, elements);
      const isValidMovement = validateMovement(newPosition, conflictItem);

      if (isValidMovement) {
        currentElement.currentPosition = newPosition;
        htmlElement.style.top = `${newPosition.top}px`;
        htmlElement.style.left = `${newPosition.left}px`;

        validateConflicts(currentElement, conflictItem);
      }
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

function placeEntities(item, quantity) {
  if (!['mini-demon', 'chest', 'trap'].includes(item)) return;

  let top = 0;
  let left = 0;

  for (let i=0; i<quantity; i++) {
    top = TILE_SIZE * (Math.floor(Math.random() * 14) + 2);
    left = TILE_SIZE * (Math.floor(Math.random() * 16) + 2);

    if (item === 'mini-demon') {
      board.createEnemy({ item, top, left });
    } else {
      board.createItem({ item, top, left });
    }
  }
}

const board = createBoard();
const entities = ['chest', 'trap', 'mini-demon'];

// Base entities
board.createItem({ item: 'forniture', top: TILE_SIZE * 17, left: TILE_SIZE * 2 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 8 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 16 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 3 });

// Hero
board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });

// Dynamic entities
entities.forEach(entity => {
  // Place only 1 chest, otherwise n+2 entities
  const quantity = entity !== 'chest' ? Math.floor(Math.random() * 15) + 2 : 1;
  placeEntities(entity, quantity);
});

