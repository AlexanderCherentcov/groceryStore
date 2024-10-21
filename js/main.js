const products = document.querySelectorAll('.shelf__product'); // Продукты
const cart = document.getElementById('cart'); // Корзина
const payBtn = document.getElementById('payment'); // Ссылка
let itemCount = 0;
let draggedElement = null;
let initialPosition = {};

// Уникальные ID для продуктов и обработчики событий
products.forEach((product, index) => {
  product.id = `product${index + 1}`;

  product.addEventListener('dragstart', dragStart); // десктоп
  product.addEventListener('touchstart', touchStart); //сенсор
  product.addEventListener('touchmove', touchMove);
  product.addEventListener('touchend', touchEnd);
});

function dragStart(e) {
  e.dataTransfer.setData('text', e.target.id);
}

function touchStart(e) {
  draggedElement = e.target;
  const rect = draggedElement.getBoundingClientRect();
  initialPosition = {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top,
  };
  draggedElement.style.position = 'absolute';
}

function touchMove(e) {
  if (!draggedElement) return;

  const touch = e.touches[0];
  const offsetX = touch.clientX - initialPosition.x;
  const offsetY = touch.clientY - initialPosition.y;

  // Обновляем позицию
  draggedElement.style.left = `${offsetX}px`;
  draggedElement.style.top = `${offsetY}px`;
}

function touchEnd() {
  if (!draggedElement) return;

  const cartRect = cart.getBoundingClientRect();
  const draggedRect = draggedElement.getBoundingClientRect();

  // Проверка попадания в корзину
  if (
    draggedRect.left < cartRect.right &&
    draggedRect.right > cartRect.left &&
    draggedRect.top < cartRect.bottom &&
    draggedRect.bottom > cartRect.top
  ) {
    dropProduct(draggedElement); // Добавляем в корзину
  } else {
    // Возвращаем на место
    draggedElement.style.position = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';
  }

  draggedElement = null;
}

function dropProduct(product) {
  itemCount++;
  product.classList.add('fade-out');

  setTimeout(() => {
    product.style.position = 'absolute'; // Перемещаем продукт
    product.style.bottom = '70px';

    // Позиции по горизонтали
    const leftPositions = ['92px', '150px', '200px', '115px'];
    product.style.left = leftPositions[(itemCount - 1) % leftPositions.length];

    cart.appendChild(product);

    setTimeout(() => {
      product.classList.add('fade-in');
      product.style.opacity = '1'; // Показываем продукт
    }, 100);
  }, 500);

  // Показываем кнопку "Оплатить", если продуктов >= 3
  if (itemCount >= 3) {
    payBtn.classList.remove('hide');
  }
}

// Для сброса на десктопах
cart.addEventListener('dragover', e => {
  e.preventDefault();
});
cart.addEventListener('drop', e => {
  e.preventDefault();
  const productId = e.dataTransfer.getData('text');
  const product = document.getElementById(productId);
  dropProduct(product);
});
