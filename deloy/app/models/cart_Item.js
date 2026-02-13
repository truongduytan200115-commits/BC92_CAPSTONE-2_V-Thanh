export default class CartItem {
    constructor(_product, _quantity) {
        this.product = _product; // Đây là object sản phẩm (chứa id, name, price...)
        this.quantity = _quantity; // Số lượng mua
    }
}