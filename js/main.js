//**************************Счетчик**************************
window.addEventListener('click', function(event){
    let counter;

    // строгое сравнение, теперь искать родителя будем только с + и -
    if(event.target.dataset.action === "plus" || event.target.dataset.action === "minus"){
        const counterWrapper = event.target.closest('.counter-wrapper');
        counter = counterWrapper.querySelector('.items__current');
    }

    if(event.target.dataset.action === "plus"){
        counter.innerText = ++counter.innerText;
    }

    if(event.target.dataset.action === "minus"){
        // чтобы не допускать кол-во товара меньше 1
        if (parseInt(counter.innerText)>1){
            counter.innerText = --counter.innerText;
        }else if (event.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1){

            event.target.closest('.cart-item').remove();

            // отображение статуса корзины
            toggleCartStatus();

            //пересчет итоговой суммы
            calcCartPriceAndDelivery();
        }
    }

    // проверяем на + и - внутри корзины 
    if(event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')){
        // пересчет итоговой суммы
        calcCartPriceAndDelivery();
    }
})




//**********************Корзина**********************
const cartWrapper = document.querySelector('.cart-wrapper');

window.addEventListener('click', function(event){
    if(event.target.hasAttribute('data-cart')){
        const card = event.target.closest('.card');
        const productInfo ={
            id: card.dataset.id,
            imgSrc: card.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.item-title').innerText,
            itemsInBox: card.querySelector('[data-items-in-box]').innerText,
            weight: card.querySelector('.price__weight').innerText,
            price: card.querySelector('.price__currency').innerText,
            counter: card.querySelector('[data-counter]').innerText,
        };
 

        // проверка есть ли уже такой товар
        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
        if(itemInCart){
            const counterElement = itemInCart.querySelector('[data-counter]');
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
        }else{
            const cartItemHTML = `<div class="cart-item" data-id="${productInfo.id}">
                <div class="cart-item__top">
                    <div class="cart-item__img">
                        <img src="${productInfo.imgSrc}" alt="">
                    </div>
                    <div class="cart-item__desc">
                        <div class="cart-item__title">${productInfo.title}</div>
                        <div class="cart-item__weight">${productInfo.itemsInBox} / ${productInfo.weight}</div>

                        <div class="cart-item__details">
                            <div class="items items--small counter-wrapper">
                                <div class="items__control" data-action="minus">-</div>
                                <div class="items__current" data-counter="">${productInfo.counter}</div>
                                <div class="items__control" data-action="plus">+</div>
                            </div>

                            <div class="price">
                                <div class="price__currency">${productInfo.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
        }

        // сброс счетчика 
        card.querySelector('[data-counter]').innerText = '1';

        // отображение статуса корзины
        toggleCartStatus();

        // пересчет итоговой суммы
        calcCartPriceAndDelivery();
    }
})




//*****************Надпись корзина пуста и оформить заказ*****************
function toggleCartStatus(){
    const cartEmptyBadge = document.querySelector('[data-cart-empty]');
    const orderForm = document.querySelector('#order-form');

    if(cartWrapper.children.length>0){
        cartEmptyBadge.classList.add('none');
        orderForm.classList.remove('none');
    }else{
        cartEmptyBadge.classList.remove('none');
        orderForm.classList.add('none');
    }
}



//***************************Работа с ценами***************************
function calcCartPriceAndDelivery() {
    const priceEl = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');

    let priceTotal = 0;

    priceEl.forEach(function(item){
        const amountEl = item.closest('.cart-item').querySelector('[data-counter]');

        priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });

    // добавление суммы доставки
    if(priceTotal<600 && priceTotal>0){
        totalPriceEl.innerText = priceTotal + 250;
    }else{
        totalPriceEl.innerText = priceTotal;
    }

    //доставка
    if(priceTotal>0){
        cartDelivery.classList.remove('none');
    }else{
        cartDelivery.classList.add('none');
    }

    if(priceTotal>=600){
        deliveryCost.classList.add('free');
        deliveryCost.innerText = 'бесплатно';
    }else{
        deliveryCost.classList.remove('free');
        deliveryCost.innerText = '250 ₽';
    }
}