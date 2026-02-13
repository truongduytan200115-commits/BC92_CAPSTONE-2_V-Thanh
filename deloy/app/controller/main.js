import Api from '../services/api.js';
import Product from '../models/products.js';
import Cart from '../models/cart.js';
import CartItem from '../models/cart_Item.js';

const api = new Api();
const cart = new Cart();
let productList = []; // Mảng chứa danh sách sản phẩm gốc từ Server

// Tạo hàm async để lấy danh sách sản phẩm từ API
const getListProduct = async () => {
    try {
        // Hiện loader khi bắt đầu gọi API
        const loader = document.getElementById("loader");
        if(loader) loader.style.display = "flex"; 

        const result = await api.fetchProductsApi();
        productList = result.data;
        renderUI(productList);

    } catch (error) {
        console.log(error);
    } finally {
        // Luôn ẩn loader khi đã có kết quả (kể cả thành công hay thất bại)
        const loader = document.getElementById("loader");
        if(loader) loader.style.display = "none";
    }
};

// Render danh sách sản phẩm ngoài trang chủ
const renderUI = (data) => {
    let content = "";
    data.forEach((product, index) => {
        content += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${parseInt(product.price).toLocaleString()}</td>
                <td>${product.screen}</td>
                <td>${product.frontCamera}</td>
                <td>${product.backCamera}</td>
                <td>
                    <img src="${product.img}" width="50" alt="${product.name}" />
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td> 
                    <button class="btn btn-info btn-sm" onclick="addToCart('${product.id}')">Add to cart</button>
                </td>
            </tr>
        `;
    });
    document.getElementById("tblDanhSachSP").innerHTML = content;
};

// Lọc sản phẩm
window.filterProduct = () => {
    const type = document.getElementById("loaiSP").value;
    let filteredList = [];

    if (type === "all") {
        filteredList = productList;
    } else {
        filteredList = productList.filter((product) => {
            return product.type.toLowerCase() === type.toLowerCase();
        });
    }
    renderUI(filteredList);
};

// Render giỏ hàng (Modal)
const renderCart = (cartArray) => {
    let content = "";

    let totalAmount = 0; // biến tổng tiền

    let totalQuantity = 0; // biến tổng số lượng

    cartArray.forEach((item, index) => {
        const { product, quantity } = item;
        
        // Tính toán
        const subTotal = product.price * quantity;
        totalAmount += subTotal;
        totalQuantity += quantity;

        content += `
            <tr>
                <td><img src="${product.img}" width="50" /></td>
                <td>${product.name}</td>
                <td>${parseInt(product.price).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="changeQty('${product.id}', -1)">-</button>
                    <span class="mx-2">${quantity}</span>
                    <button class="btn btn-sm btn-info" onclick="changeQty('${product.id}', 1)">+</button>
                </td>
                <td>${subTotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeCartItem('${product.id}')">Xóa</button>
                </td>
            </tr>
        `;
    });

    // In vào bảng
    const tblGioHang = document.getElementById("tblGioHang");
    if (tblGioHang) tblGioHang.innerHTML = content;

    // Cập nhật tổng tiền
    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) totalPriceElement.innerHTML = totalAmount.toLocaleString() + " VNĐ";

    // Cập nhật số lượng trên icon
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) cartCountElement.innerHTML = totalQuantity;
};

// Thêm vào giỏ hàng
window.addToCart = (productId) => {
    const product = productList.find((item) => item.id === productId);
    if (!product) return;

    const index = cart.findIndex(product.id);

    if (index === -1) {
        const cartItem = new CartItem(product, 1);
        cart.addProduct(cartItem);
    } else {
        cart.cartArray[index].quantity += 1;
    }
    
    alert("Đã thêm vào giỏ hàng!");
    renderCart(cart.cartArray);
    setLocalStorage();
};

// Thay đổi số lượng (+/-)
window.changeQty = (productId, num) => {
    const index = cart.findIndex(productId);
    if (index !== -1) {
        const cartItem = cart.cartArray[index]; // Lấy đối tượng CartItem
        const newQty = cartItem.quantity + num; // Tính số lượng mới

        if (newQty > 0) {
            cartItem.quantity = newQty;
        } else {
            if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
                cart.removeProduct(index);
            }
        }
        renderCart(cart.cartArray);
        setLocalStorage();
    }
};

// Xóa sản phẩm
window.removeCartItem = (productId) => {
    const index = cart.findIndex(productId);
    if (index !== -1) {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            cart.removeProduct(index);
            renderCart(cart.cartArray);
            setLocalStorage();
        }
    }
};

// Thanh toán (Check out)
window.checkOut = () => {
    if (cart.cartArray.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
    }

    const total = cart.cartArray.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    alert(`Cảm ơn bạn đã mua hàng! Tổng đơn hàng của bạn là: ${total.toLocaleString()} VNĐ`);

    cart.cartArray = []; // Reset mảng
    renderCart(cart.cartArray);
    setLocalStorage();
};

// Tạo local storage để lưu giỏ hàng
const setLocalStorage = () => {
    const dataString = JSON.stringify(cart.cartArray);
    localStorage.setItem("CART_LIST", dataString);
};

// Lấy giỏ hàng từ local storage
const getLocalStorage = () => {
    const dataString = localStorage.getItem("CART_LIST");
    if (dataString) {
        cart.cartArray = JSON.parse(dataString);
        renderCart(cart.cartArray);
    }
};

// Gọi API lấy danh sách sản phẩm
getListProduct();
