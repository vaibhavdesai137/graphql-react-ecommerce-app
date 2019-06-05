
const CART_KEY = 'cart';

export const calculateTotalPrice = (cartItems) => {
    return `${cartItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2)
        }`;
};

// Save cart to storage
export const setCart = (value, cartKey = CART_KEY) => {
    if (localStorage) {
        localStorage.setItem(cartKey, JSON.stringify(value));
    }
};

// Get cart from storage
export const getCart = (cartKey = CART_KEY) => {
    if (localStorage && localStorage.getItem(cartKey)) {
        return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
};