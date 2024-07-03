class ProductDto{
    constructor(product){
        this.id = product._id,
        this.code = product.code,
        this.title = product.title,
        this.description = product.description,
        this.price = product.price,
        this.thumbnail = product.thumbnail,
        this.stock = product.stock,
        this.category= product.category,
        this.status = product.status
    }
}

module.exports = ProductDto;