import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

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

    // Apply background color if configured
    const bodies = li.querySelectorAll('.cards-card-body');

    if (bodies.length >= 2) {
      const label = bodies[bodies.length - 2]?.textContent.trim().toLowerCase();
      const value = bodies[bodies.length - 1]?.textContent.trim();

      if (label === 'background') {
        if (value.startsWith('#')) {
          li.style.backgroundColor = value;
        } else {
          li.classList.add(`bg-${value}`);
        }

        // Hide the background metadata
        bodies[bodies.length - 2].remove();
        bodies[bodies.length - 1].remove();
      }
    }

    ul.append(li);
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
