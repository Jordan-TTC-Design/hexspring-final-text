//API的資料
const apiPath = `jordanttcdesign`;
const domProductList = document.querySelector(".list");
const domCartList = document.querySelector(".cartList");
// const token = ``

//主要畫面資料陣列
let data;
let cartList;

//預設動作
function init() {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/products`
    )
    .then(function (response) {
      // 成功會回傳的內容
      data = response.data;
      // console.log(data);
      let productData = data.products;
      let productPriceList = sortList(productData, "price");
      getCart();
      cardRender(productPriceList);
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      // console.log(error);
    });
}
init();

//顯示卡片
function cardRender(list) {
  let str = "";
  list.forEach(function (item) {
    // console.log(item);
    str += `<li class="list_card" id='${item.id}'>
      <div class="box">
          <p>產品名稱：${item.title}</p>
          <p>產品價格 : ${item.price}</p>
          <p>產品描述 : ${item.description}</p>
          <input type="button" value="加入購物車" data-id='${item.id}' class="addCart">
      </div>
  </li>`;
  });
  domProductList.innerHTML = str;
}
//整理排序
function sortList(list, reference) {
  return list.sort(function (a, b) {
    return a[reference] - b[reference];
  });
  // console.log(list)
}

//取得購物車資料
function getCart() {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts
    `
    )
    .then(function (response) {
      //   console.log(response.data);
      cartList = response.data.carts;
      cartRender();
    });
}

//監聽新增購物車
domProductList.addEventListener("click", function (e) {
  // console.log(e.target);
  if (!e.target.dataset.id) {
    return;
  } else {
    // console.log(e.target);
    let productId = e.target.dataset.id;
    addCart(productId);
  }
});

//新增購物車
function addCart(productId) {
  let cartListNum;
  let obj = {};
  obj.id = productId;
  obj.num = 1;
  cartList.forEach(function (item, index) {
    if (item.product.id == productId) {
      console.log(item.quantity);
      obj.num = item.quantity;
      obj.num += 1;
      console.log("已存在於購物車");
      cartListNum = index;
    } else {
      return;
    }
  });
  console.log(obj);
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts`,
      {
        data: {
          productId: obj.id,
          quantity: obj.num,
        },
      }
    )
    .then(function (response) {
      // console.log(response.data);
      getCart();
    });
}
//顯示購物車
function cartRender() {
  let str = "";
  cartList.forEach(function (item) {
    let obj = item.product;
    console.log(item);
    str += `<li class="d-flex"><p>品項：${obj.title}</p>
    <p>單價：${obj.price}</p>
    <p>數量：${item.quantity}</p>
    <p>金額：${item.quantity * obj.price}</p>
    <input type="button" value="刪除品項" data-id="${
      item.id
    }" class="deleteCart"/></li>`;
  });
  domCartList.innerHTML = str;
}

// 監聽刪除購物車
domCartList.addEventListener("click", function (e) {
  if (!e.target.dataset.id) {
    return;
  } else {
    // console.log(e.target);
    let cartId = e.target.dataset.id;
    deleteCart(cartId);
  }
});

//刪除購物車
function deleteCart(cartId) {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts/${cartId}`
    )
    .then(function (response) {
      console.log(response.data);
      getCart();
    });
}

// 送出預定資料
const payInfoBox = document.querySelector(".payInfoBox");
let payInfo = {};
// payInfoBox.addEventListener('click',function(e){
// if (e.target.nodeName !== 'INPUT'){
//   return
// }
// console.log('hi')
// })

const sendPayInfo = document.querySelector(".sendPayInfo");
//送出預定資料
sendPayInfo.addEventListener("click", function () {
  createOrder();
});

function createOrder() {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/orders`,
      {
        data: {
          user: {
            name: "六角學院",
            tel: "07-5313506",
            email: "hexschool@hexschool.com",
            address: "高雄市六角學院路",
            payment: "Apple Pay",
          },
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
    });
}
