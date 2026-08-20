import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  let previousCard = null;

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    const bodies = li.querySelectorAll('.cards-card-body');

    // Handle metadata row: background | value
    if (
      bodies.length >= 2 &&
      bodies[0].textContent.trim().toLowerCase() === 'background'
    ) {
      const value = bodies[1].textContent.trim();

      if (previousCard) {
        if (value.startsWith('#')) {
          previousCard.style.backgroundColor = value;
        } else {
          previousCard.classList.add(`bg-${value}`);
        }
      }

      // Don't render this metadata row as a card
      return;
    }

    ul.append(li);
    previousCard = li;
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '750' }],
      ),
    );
  });

  block.replaceChildren(ul);
}
