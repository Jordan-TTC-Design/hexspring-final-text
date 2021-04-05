//API的資料
const apiPath = `jordanttcdesign`;
const domProductList = document.querySelector(".list");
const domCartList = document.querySelector(".cartList");
const domDeleteCartAll = document.querySelector(".deleteCartAll");
const domProductsFilter = document.querySelector("#productsFilter");
// const token = ``

//主要畫面資料陣列
let data;
let cartList;
let productData;

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
      productData = data.products;
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
  //如果有資料就顯示刪除全部購物車按鈕
  if (str == "") {
    domDeleteCartAll.classList.remove("show");
  } else if (str !== "") {
    domDeleteCartAll.classList.add("show");
  }
  console.log(domDeleteCartAll.classList);
  domCartList.innerHTML = str;
}
// 監聽刪除全部購物車
domDeleteCartAll.addEventListener("click", function () {
  deleteCartAll();
});
//刪除全部購物車
function deleteCartAll() {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts`
    )
    .then(function (response) {
      console.log(response.data);
      getCart();
    });
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
// let payInfo = {};
const sendPayInfo = document.querySelector(".sendPayInfo");

//監聽送出
sendPayInfo.addEventListener("click", function () {
  checkPayForm();
});

//檢查表單有無填寫
function checkPayForm() {
  let checkOk = false;
  const form = document.querySelector("form#payForm");
  const formInputsList = document.querySelectorAll(
    "#payForm input[type=text],input[type=number],input[type=email],select"
  );
  const constraints = {
    infoName: {
      presence: {
        message: ":必填!",
      },
    },
    infoPhone: {
      presence: {
        message: ":必填!",
      },
    },
    infoEmail: {
      presence: {
        message: ":必填!",
      },
    },
    infoAddress: {
      presence: {
        message: ":必填!",
      },
    },
    infoPayWay: {
      presence: {
        message: ":必填!",
      },
    },
  };
  formInputsList.forEach((item) => {
    // console.log(item);
    item.nextElementSibling.textContent = "";
    let errors = validate(form, constraints);
    // console.log(errors);
    //呈現在畫面上
    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        console.log(keys);
        let txt = `${errors[keys]}`;
        let str = txt.split(":");
        console.log(str[1]);
        document.querySelector(`.${keys}`).textContent = str[1];
      });
    } else if (!errors) {
      checkOk = true;
    }
    item.addEventListener("change", function () {
      item.nextElementSibling.textContent = "";
      let errors = validate(form, constraints);
      // console.log(errors);
      //呈現在畫面上
      // console.log(item)
      if (errors) {
        Object.keys(errors).forEach(function (keys) {
          console.log(keys);
          let txt = `${errors[keys]}`;
          let str = txt.split(":");
          console.log(str[1]);
          document.querySelector(`.${keys}`).textContent = str[1];
        });
      } else if (!errors) {
        checkOk = true;
      }
    });
  });
  if (checkOk == true) {
    console.log("資料都填妥了");
    processPayFormData();
  }
}

//產生資料
function processPayFormData() {
  let objOder = {};
  const payForm = document.forms["payForm"]; // 取得 name 屬性為 form 的表單
  // console.log(payForm.elements.infoName.value)
  objOder.infoName = payForm.elements.infoName.value; // 取得 elements 集合中 name 屬性為 name 的值
  objOder.infoPhone = payForm.elements.infoPhone.value;
  objOder.infoEmail = payForm.elements.infoEmail.value;
  objOder.infoAddress = payForm.elements.infoAddress.value;
  objOder.infoPayWay = payForm.elements.infoPayWay.value;
  console.log(objOder);
  createOrder(objOder);
}

function createOrder(objOder) {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/orders`,
      {
        data: {
          user: {
            name: objOder.infoName,
            tel: objOder.infoPhone,
            email: objOder.infoEmail,
            address: objOder.infoAddress,
            payment: objOder.infoPayWay,
          },
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
    });
}
//監聽塞選品項
domProductsFilter.addEventListener("change", function () {
  ProductsFilter();
});
//塞選品項
function ProductsFilter() {
  let category = domProductsFilter.value;
  let str = "";
  let newData = [];
  productData.forEach(function (item) {
    console.log(item);
    if (category == item.category) {
      newData.push(item);
    } else if (category == "全部") {
      newData.push(item);
    }
  });
  cardRender(newData);
}
