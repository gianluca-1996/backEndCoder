class CartDto{
    constructor(cart){
        this.id = cart._id,
        this.products = cart.products
    }
}

module.exports = CartDto;