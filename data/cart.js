export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
    }];
}


export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    let matchedItem;

    cart.forEach(items => {
        if (items.productId === productId) {
            matchedItem = items;
        }
    });

    if (matchedItem) {
        matchedItem.quantity++;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '3'
        });
    }

    saveToStorage();
}

export function deleteItem(deleteId) {
    const newCart = [];

    cart.forEach(item => {
        if (item.productId == deleteId) {
            if (item.quantity > 1) {
                item.quantity--;
                saveToStorage();
            } else {
                cart.forEach(item => {
                    if (item.productId != deleteId) {
                        newCart.push(item);
                    }
                })
                cart = newCart;

                saveToStorage();
            }
        }
    });
}

export function updateId(productId, inputId) {
    let updateItem;

    cart.forEach(item => {
        if (item.productId === productId) {
            updateItem = item;
        }
    });

    updateItem.deliveryOptionId = inputId;

    saveToStorage();
}