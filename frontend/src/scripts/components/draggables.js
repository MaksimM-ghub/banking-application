export function dragEvent(className) {
  const container = document.querySelector(className);

  container.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('draggable')) {
      e.target.classList.add('dragging');
    }
  });

  container.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('dragging')) {
      e.target.classList.remove('dragging');
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();

    const dragging = container.querySelector('.dragging');
    if (!dragging) return;

    const targetElement = getMouseOverElement(container, e.clientX, e.clientY);

    if (targetElement && targetElement !== dragging) {
      // Меняем местами блоки, только если наводимся на другой блок
      swapElements(dragging, targetElement);
    }
  });
}

// Функция определения элемента, над которым находится мышь
function getMouseOverElement(container, mouseX, mouseY) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ];

  // Возвращаем элемент, который находится под мышкой
  return draggableElements.find((element) => {
    const rect = element.getBoundingClientRect();
    return (
      mouseX > rect.left &&
      mouseX < rect.right &&
      mouseY > rect.top &&
      mouseY < rect.bottom
    );
  });
}

// Функция для обмена местами двух элементов
function swapElements(dragging, target) {
  const parent = dragging.parentNode;

  // Определяем положение целевого элемента относительно перетаскиваемого
  if (dragging.nextSibling === target) {
    // Если целевой блок идет сразу после перетаскиваемого, просто поменяем их местами
    parent.insertBefore(target, dragging);
  } else if (target.nextSibling === dragging) {
    // Если перетаскиваемый блок идет сразу после целевого, поменяем их местами
    parent.insertBefore(dragging, target);
  } else {
    // Если блоки находятся не рядом, меняем их местами
    const targetNext = target.nextSibling;
    parent.insertBefore(dragging, targetNext);
    parent.insertBefore(target, dragging);
  }
}
