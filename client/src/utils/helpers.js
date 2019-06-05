
export const calculateTotalPrice = (cartItems) => {
    return `${cartItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2)
    }`;
}