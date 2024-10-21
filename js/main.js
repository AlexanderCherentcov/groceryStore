const products = document.querySelectorAll('.shelf__product');
const cart = document.getElementById('cart');
const payBtn = document.getElementById('payment');
let itemCount = 0;

products.forEach((product, index) => {
  product.id = `product${index + 1}`;

  // Добавляем обработчики событий для мыши и касаний
  product.addEventListener('dragstart', dragStart);
  product.addEventListener('touchstart', handleTouchStart);
});

// Обработка перетаскивания
function dragStart(e) {
  e.dataTransfer.setData('text', e.target.id);
}

function handleTouchStart(e) {
  const touch = e.touches[0];
  const productId = e.target.id;
  e.dataTransfer.setData('text/plain', productId);

  // Позиционируем элемент на экране
  e.target.style.position = 'absolute';
  e.target.style.left = `${touch.clientX}px`;
  e.target.style.top = `${touch.clientY}px`;
}

// Обработка сброса продукта в корзину
cart.addEventListener('dragover', allowDrop);
cart.addEventListener('drop', dropProduct);
cart.addEventListener('touchmove', allowDrop);

// Разрешаем сброс в корзину
function allowDrop(e) {
  e.preventDefault();
}

// Добавляем продукт в корзину
function dropProduct(e) {
  e.preventDefault();
  const productId = e.dataTransfer.getData('text');
  const product = document.getElementById(productId);

  if (product) {
    itemCount++;
    product.classList.add('fade-out');

    setTimeout(() => {
      product.style.opacity = '0';

      product.style.bottom = '70px';
      const leftPositions = ['92px', '150px', '200px', '115px'];
      product.style.left =
        leftPositions[(itemCount - 1) % leftPositions.length];

      cart.appendChild(product);

      // Плавное появление продукта в корзине
      setTimeout(() => {
        product.classList.add('fade-in');
        product.style.opacity = '1';
      }, 100);
    }, 500);

    // Показываем кнопку "Оплатить"
    if (itemCount >= 3) {
      payBtn.classList.remove('hide');
    }
  }
}
