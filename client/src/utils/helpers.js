
const CART_KEY = 'cart';
const TOKEN_KEY = 'token';

export const calculateTotalPrice = (cartItems) => {
    return `${cartItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2)
        }`;
};

// Cart: save cart
// value = cartItems = JS object 
// so serialize to string before saving
export const setCart = (value, cartKey = CART_KEY) => {
    if (localStorage) {
        localStorage.setItem(cartKey, JSON.stringify(value));
    }
};

// Cart: get cart
// value = cartItems = JS object 
// so de-serialize before returning since it was saved as string
export const getCart = (cartKey = CART_KEY) => {
    if (localStorage && localStorage.getItem(cartKey)) {
        return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
};

// Auth: save token
// value = JWT object = JS object
// so serialize to string before saving
export const setToken = (value, tokenKey = TOKEN_KEY) => {
    if (localStorage) {
        localStorage.setItem(tokenKey, JSON.stringify(value));
    }
}

// Auth: get token
// value = JWT object = JS object
// so de-serialize before returning since it was saved as string
export const getToken = (tokenKey = TOKEN_KEY) => {
    if (localStorage && localStorage.getItem(tokenKey)) {
        return JSON.parse(localStorage.getItem(tokenKey));
    }
    return {};
};