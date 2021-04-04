//我的資料
const apiPath = `jordanttcdesign`;
const domProductList = document.querySelector('.list')
// const token = ``
let data;
let cartList;
axios
  .get(
    `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/products`
  )
  .then(function (response) {
    // 成功會回傳的內容
    data = response.data;
    // console.log(data);
    let productData = data.products
    let productPriceList = sortList(productData,'price');
    cardRender(productPriceList);
    getCart()
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    // console.log(error);
  });
//addCart

function getCart(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts
    `).
    then(function (response) {
    //   console.log(response.data);
      cartList = response.data.carts
    })
}
domProductList.addEventListener('click',function(e){
    // console.log(e.target);
    if(!e.target.dataset.name){
        return
    }else{
        console.log(e.target);
        let productId = e.target.dataset.name
        add(productId)
    }
})
function add(productId){
    // console.log(productId);
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts
    `).
    then(function (response) {
    //   console.log(response.data);
      cartList = response.data.carts
    //   console.log(cartList)
    let obj={};
    obj.id=productId;
    obj.num = 1;
    cartList.forEach(function(item){
        if(item.product.id == productId){
            console.log(item.quantity)
            obj.num = item.quantity;
            obj.num +=1 ;
            console.log('已存在於購物車')
        }else{
            return
        }
    })
    console.log(obj);
    addCart(obj);
    })
}
function addCart(obj){
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts`,{
    data: {
      "productId": obj.id,
      "quantity": obj.num
    }
  }).
    then(function (response) {
      console.log(response.data);
    })
}
// cardRender
function cardRender(list){
    let str = ''; 
    list.forEach(function(item){
        // console.log(item);
        str += `<li class="list_card" id='${item.id}'>
        <div class="box">
            <p>產品名稱：${item.title}</p>
            <p>產品價格 : ${item.price}</p>
            <p>產品描述 : ${item.description}</p>
            <input type="button" value="加入購物車" data-name='${item.id}' class="addCart">
        </div>
    </li>`
    }) 
    domProductList.innerHTML = str;
}
//整理排序
function sortList(list,reference){
    return list.sort(function(a,b){
        return a[reference] - b[reference]
    })
    // console.log(list)
}