class Product {
    constructor(_id, _name, _price, _screen, _frontCamera, _backCamera , _imageUrl, _description, _type){
        this.id = _id;
        this.name = _name;
        this.price = _price;
        this.screen = _screen;
        this.frontCamera = _frontCamera;
        this.backCamera = _backCamera;
        this.imageUrl = _imageUrl;
        this.description = _description;
        this.type = _type
    };
};

export default Product;