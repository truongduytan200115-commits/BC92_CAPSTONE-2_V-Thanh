class Api{
    fetchProductsApi(){
        const promise = axios({
            url:"https://697a5e0f0e6ff62c3c5939e4.mockapi.io/Products",
            method: "GET",
        });

        return promise;
    };
}

export default Api;