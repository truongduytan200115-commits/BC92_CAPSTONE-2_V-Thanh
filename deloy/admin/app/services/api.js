const BASE_URL = "https://697a5e0f0e6ff62c3c5939e4.mockapi.io/Products";

class Api{
    fetchProductsApi(){
        const promise = axios({
            url:"https://697a5e0f0e6ff62c3c5939e4.mockapi.io/Products",
            method: "GET",
        });

        return promise;
    };

    deleteProductApi(id) {
    return axios({
            url: `${BASE_URL}/${id}`,
            method: "DELETE",
        });
    }

    getProductByIdApi(id) {
        return axios({
            url: `${BASE_URL}/${id}`,
            method: "GET",
        });
    }

    addProductApi(product) {
        return axios({
        url: BASE_URL,
        method: "POST",
        data: product,
        });
    }

    updateProductApi(product) {
        return axios({
        url: `${BASE_URL}/${product.id}`,
        method: "PUT",
        data: product,
        });
    }


}

export default Api;