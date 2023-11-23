import { cart, deleteItem, saveToStorage, updateId } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSum } from "./paymentSum.js";


export function renderOrderSum() {
let cartItemSum = '';

cart.forEach((item) => {
    const productId = item.productId;
    let matchedItem;
    
    products.forEach((products) => {
        if (products.id === productId) {
            matchedItem = products;
        }
    });

    const deliveryOptionId = item.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const day = dayjs();

    const deliveryDate = day.add(deliveryOption.deliveryDays,
        'days').format('dddd, MMMM D');

    cartItemSum += `
    <div class="cart-item-container js-cart-item-container-${matchedItem.id}">
        <div class="delivery-date">
            Delivery date: ${deliveryDate}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
                src="${matchedItem.image}">

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchedItem.name}
                </div>
                <div class="product-price">
                    $${(matchedItem.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${item.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary"
                        data-item-id="${matchedItem.id}">
                        Update
                    </span>
                    <span class="delete-quantity-link link-primary"
                        data-delete-id="${matchedItem.id}">
                        Delete
                    </span>
                </div>
            </div>
        
            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchedItem, item)}
            </div>
        </div>
    </div>
    `;
});

function deliveryOptionsHTML(matchedItem, cartItem) {

    let html = '';

    deliveryOptions.forEach(deliveryOption => {
        const day = dayjs();
        const deliveryDate = day.add(deliveryOption.deliveryDays,
            'days').format('dddd, MMMM D');
        const deliveryPrice = deliveryOption.priceCents === 0 ? 'FREE'
            : `$${(deliveryOption.priceCents / 100).toFixed(2)} - `;

        const isChecked = cartItem.deliveryOptionId === deliveryOption.id;

        html += `
        <div class="delivery-option"
            data-input-delivery-option="${deliveryOption.id}"
            data-input-cart-id="${matchedItem.id}">
            <input type="radio"
                ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchedItem.id}">
            <div>
                <div class="delivery-option-date">
                ${deliveryDate}
                </div>
                <div class="delivery-option-price">
                ${deliveryPrice} Shipping
                </div>
            </div>
        </div>`;
    });

    return html;
}

document.querySelector('.order-summary').innerHTML = cartItemSum;

document.querySelectorAll('.delete-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
        const deleteId = link.dataset.deleteId;
        deleteItem(deleteId);

        document.querySelector(`.js-cart-item-container-${deleteId}`).remove();
        renderOrderSum();
        renderPaymentSum();
        
    });
});

document.querySelectorAll('.delivery-option').forEach(input => {
    input.addEventListener('click', () => {
        const inputId = input.dataset.inputDeliveryOption;
        const productId = input.dataset.inputCartId;

        updateId(productId, inputId);
        renderOrderSum();
        renderPaymentSum();
    });
});

document.querySelectorAll('.update-quantity-link').forEach(element => {
    element.addEventListener('click', () => {
        const itemId = element.dataset.itemId;
        cart.forEach(item => {
            if (itemId === item.productId) {
                item.quantity ++;
                saveToStorage();
            }
            renderOrderSum();
            renderPaymentSum();
        })
    }) 
});

}
