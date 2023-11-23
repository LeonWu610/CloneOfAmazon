import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderOrderSum } from "./orderSum.js";

export function renderPaymentSum() {
    let totalPrice = 0;
    let totalShipping = 0;
    let totalQuantity = 0;
    let paymentHtml = '';

    cart.forEach(element => {
        const productId = element.productId;
        let priceCents = 0;
        products.forEach(product => {
            if (productId === product.id) {
                priceCents = product.priceCents;
            }
        });
        totalPrice += priceCents * element.quantity;

        totalQuantity += element.quantity;

        let shippingPrice = 0;
        deliveryOptions.forEach(Option => {
            if (element.deliveryOptionId === Option.id) {
                shippingPrice = Option.priceCents;
            }
        });
        totalShipping += shippingPrice;
        
    });
    const taxPrice = totalPrice * 0.1;
    const sumPrice = totalPrice + taxPrice + totalShipping;

    

    paymentHtml += `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${totalPrice / 100}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${totalShipping / 100}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${totalPrice / 100}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(taxPrice / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(sumPrice / 100).toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>`;

    document.querySelector('.payment-summary').innerHTML = paymentHtml;
    document.querySelector('.return-to-home-link').innerHTML = `${totalQuantity} items`;
renderOrderSum();
}
