import Api from '../services/api.js';
import Product from '../models/products.js';

const api = new Api();

let productList = [];
let selectedProductId = null;

const renderUI = (data) => {
    let content = "";

    data.forEach((product, index) => {
        content += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.frontCamera}</td>
                <td>${product.backCamera}</td>
                <td>
                    <img src="${product.img}" width="50" />
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td> 
                    <button class="btn btn-danger btn-sm" onclick="handleDelete('${product.id}')">Delete</button>
                    <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal" onclick="handleEditProduct('${product.id}')">Edit</button>
                    
                </td>
            </tr>
        `;
    });

    document.getElementById("tblDanhSachSP").innerHTML = content;
};
const getListProducts = () =>{
    // request to server => get list products

    // pending: chờ(resquest to server--> gửi đi --> server ktra và trả phản hồi)
    // Mở loader
    // document.getElementById("loader").style.display = "block";

    const promise = api.fetchProductsApi();

    promise
        .then((result) => {
            productList = result.data;
            renderUI(productList);

            // tắt loader
            document.getElementById("loader").style.display = "none";
        })// thành công 

        .catch((error) =>{
            console.log(error);

            // tắt loader
            document.getElementById("loader").style.display = "none";
        })// thất bại
};

getListProducts();

// delete sản phẩm
window.handleDelete = (id) => {
    if (!confirm("Bạn muốn xóa sản phẩm này đúng không?")) return;

    api
        .deleteProductApi(id)
        .then(() => {
            getListProducts();
        })
        .catch((error) => {
            console.log(error);
        });
};

// Edit sản phẩm
const handleEditProduct = (id) => {
  document.querySelector(".modal-title").innerText = "Cập nhật sản phẩm";

  document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-warning"
            onclick="handleUpdateProduct('${id}')">
      Cập nhật
    </button>
  `;

  api.getProductByIdApi(id)
    .then((res) => {
      const p = res.data;

      document.getElementById("TenSP").value = p.name;
      document.getElementById("GiaSP").value = p.price;
      document.getElementById("ManHinhSP").value = p.screen;
      document.getElementById("CamTruoc").value = p.frontCamera;
      document.getElementById("CamSau").value = p.backCamera;
      document.getElementById("HinhSP").value = p.img;
      document.getElementById("MoTa").value = p.desc;
      document.getElementById("LoaiMay").value = p.type;
    })
    .catch(err => console.log(err));
};

window.handleEditProduct = handleEditProduct;

const handleUpdateProduct = (id) => {
  const product = {
    id,
    name: document.getElementById("TenSP").value,
    price: document.getElementById("GiaSP").value,
    screen: document.getElementById("ManHinhSP").value,
    frontCamera: document.getElementById("CamTruoc").value,
    backCamera: document.getElementById("CamSau").value,
    img: document.getElementById("HinhSP").value,
    desc: document.getElementById("MoTa").value,
    type: document.getElementById("LoaiMay").value,
  };

  api.updateProductApi(product)
    .then(() => {
      alert("Cập nhật sản phẩm thành công");
      getListProducts();
      document.querySelector("#myModal .close").click();
    })
    .catch(err => console.log(err));
};

window.handleUpdateProduct = handleUpdateProduct;

const openAddModal = () => {
  document.querySelector(".modal-title").innerText = "Thêm sản phẩm";

  document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-success" onclick="handleAddProduct()">
      Thêm sản phẩm
    </button>
  `;

  // reset form
  document.getElementById("TenSP").value = "";
  document.getElementById("GiaSP").value = "";
  document.getElementById("ManHinhSP").value = "";
  document.getElementById("CamTruoc").value = "";
  document.getElementById("CamSau").value = "";
  document.getElementById("HinhSP").value = "";
  document.getElementById("MoTa").value = "";
  document.getElementById("LoaiMay").value = "";
};

window.openAddModal = openAddModal;

const handleAddProduct = () => {
  const product = {
    name: document.getElementById("TenSP").value,
    price: document.getElementById("GiaSP").value,
    screen: document.getElementById("ManHinhSP").value,
    frontCamera: document.getElementById("CamTruoc").value,
    backCamera: document.getElementById("CamSau").value,
    img: document.getElementById("HinhSP").value,
    desc: document.getElementById("MoTa").value,
    type: document.getElementById("LoaiMay").value,
  };

  api.addProductApi(product)
    .then(() => {
      alert("Thêm sản phẩm thành công");
      getListProducts();
      document.querySelector("#myModal .close").click();
    })
    .catch(err => console.log(err));
};

window.handleAddProduct = handleAddProduct;





// search theo tên
window.handleSearch = () => {
    let keyword = document
        .getElementById("search")
        .value.toLowerCase();

    let result = productList.filter((product) =>
        product.name.toLowerCase().includes(keyword)
    );

    renderUI(result);
};

// sắp xếp theo giá
// sắp xếp giảm dần
window.sortPriceDesc = () => {
    let sortedList = [...productList].sort((a, b) => {
        return b.price - a.price; // GIẢM DẦN
    });

    renderUI(sortedList);
};

// sắp xếp tăng dần
window.sortPriceAsc = () => {
    let sortedList = [...productList].sort((a, b) => {
        return a.price - b.price;
    });

    renderUI(sortedList);
};

