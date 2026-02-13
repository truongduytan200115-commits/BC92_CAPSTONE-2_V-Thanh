export default class Cart {
    constructor() {
        this.cartArray = []; // Mảng chứa các đối tượng CartItem
    }

    // Phương thức thêm sản phẩm vào giỏ
    addProduct(cartItem) {
        this.cartArray.push(cartItem);
    }

    // Phương thức tìm vị trí sản phẩm trong giỏ (check trùng)
    // Trả về index nếu tìm thấy, -1 nếu không thấy
    findIndex(id) {
        // Duyệt mảng, so sánh id của product bên trong cartItem
        return this.cartArray.findIndex((item) => item.product.id === id);
    }
    
    // Phương thức xóa 
    removeProduct(index) {
        this.cartArray.splice(index, 1);
    }
}