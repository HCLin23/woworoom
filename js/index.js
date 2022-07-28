// 1. 取得訂單列表
// 2. 渲染初始畫面
// 3. 篩選功能製作 

//購物車功能
// 1.點擊加入購物車, 下方我的購物車會渲染
    // 計算總金額
    // 千分位使用
// 2.調整產品數量功能, 金額連動
// 3. 刪除單品項功能
// 4. 刪除全品項功能

//送出訂單功能
    //資料驗證
    //送出後表單reset, 購物車清空
    //篩選下拉變回全部, 產品列表全部顯示


const api_path = "poia887";
const url = "https://livejs-api.hexschool.io/api/livejs/v1/customer";
let data;
let str = '';
let str2 = '';
let cartListData;

//--------API----------
// 取得產品列表
function getProductData(){
  axios.get(`${url}/${api_path}/products`).
    then(function (response) {
        data = response.data.products;
        renderProductList(data);
        console.log(response);
    })
    .catch(function(error){
      console.log(error)
    })
}

// 加入購物車
function addCartItem(productId,num) {
  axios.post(`${url}/${api_path}/carts`, {
    data: {
      "productId": productId,
      "quantity": num
    }
  }).
    then(function (response) {
      console.log(response.data);
      addCartSuccessInfo();
      getCartList();
    })

}

// 取得購物車列表
function getCartList() {
  axios.get(`${url}/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      cartListData = response.data;
      renderCartList(cartListData);
    })
}

//修改購物車產品數量
function adjustCartNum(cartId,num) {
  axios.patch(`${url}/${api_path}/carts`,
  {
    "data": {
      "id": cartId,
      "quantity": parseInt(num) //string to number
    }
  })
  .then(function (response) {
      console.log(response.data);
      getCartList();
    })
}


// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`${url}/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      getCartList();
    })
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios.delete(`${url}/${api_path}/carts/${cartId}`).
    then(function (response) {
      console.log(response.data);
      getCartList();
    })
}

// 送出購買訂單
function createOrder(inputs) {
  axios.post(`${url}/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": inputs[0].value,
          "tel": inputs[1].value,
          "email": inputs[2].value,
          "address": inputs[3].value,
          "payment": inputs[4].value
        }
      }
    }
  ).
    then(function (response) {
      console.log(response.data);
      alert('已送出訂單');
      init();
    })
    .catch(function(error){
      console.log(error.response.data);
    })
}

//-----------擷取元素區域------------
const productWrap = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const tbody = document.querySelector('.js-tbody');
const tfoot = document.querySelector('.js-tfoot');
const shoppingCartTable = document.querySelector('.shoppingCart-table');
const orderInfoBtn = document.querySelector('.orderInfo-btn');

//重載時頁面渲染
function init(){
  getProductData();
  getCartList();
  productSelect.value = '全部';
}
init();

//渲染初始產品列
function renderProductList(productsData){
  productsData.forEach(function(item,index){
        str+=`
        <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-addCartBtn="${index}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(item.price)}</p>
        </li>
        `
    })
    productWrap.innerHTML = str;
    str='';
}

//篩選功能
let ary=[];
productSelect.addEventListener('change',function(e){
  e.preventDefault(); 
  data.forEach(function(item){
    if(e.target.value == item.category){
      ary.push(item);
    }else if(e.target.value == '全部'){
      renderProductList(data);
    };
  })
  if(e.target.value !== '全部'){
    renderProductList(ary);
    ary=[];
  }
})

//加入購物車功能
productWrap.addEventListener('click',function(e){
    e.preventDefault(); 
    let newData;
    //重組data
    function select(){
      if(productSelect.value == '全部'){
        newData = data;
      }else{
        //同類別的產品重組陣列
        newData = data.filter(function(item){
          return item.category == productSelect.value;
        }) 
      }
    }
    select();
    console.log(newData);
    
    //加入購物車 api post
    newData.forEach(function(item,index){
        if(e.target.getAttribute('data-addCartBtn') == index){
          addCartItem(item.id,1)
        }
    })
})

//渲染購物車
  //--html增加tbody tfoot
function renderCartList(data){
    data.carts.forEach(function(item,index){
        str+=`
              <tr>
                  <td>
                      <div class="cardItem-title">
                          <img src=${item.product.images} alt="">
                          <p>${item.product.title}</p>
                      </div>
                  </td>
                  <td>NT$${toThousands(item.product.price)}</td>
                  <td><input type="number" min="1" max="10" class="productQtyinput${index}" value="${item.quantity}"></td>
                  <td>NT$${toThousands((item.product.price)*(item.quantity))}</td>
                  <td class="discardBtn">
                      <a href="#" class="material-icons" data-materialIcon="${index}">
                          clear
                      </a>
                  </td>
              </tr>`
        str2=`
              <tr>
                  <td>
                      <a href="#" class="discardAllBtn">刪除所有品項</a>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                      <p>總金額</p>
                  </td>
                  <td>NT$${toThousands(data.finalTotal)}</td>
              </tr>
            `
    })
    tbody.innerHTML = str;
    tfoot.innerHTML = str2;
    str='';
    str2='';
}

//購物車列表的功能
shoppingCartTable.addEventListener('click',function(e){
    e.preventDefault();
    cartListData.carts.forEach(function(item,index){
      //調整購物車數量功能 
      if(e.target.getAttribute('class')== `productQtyinput${index}`){
        let productQtyinput = document.querySelector(`.productQtyinput${index}`);
        adjustCartNum(item.id,productQtyinput.value);
      //刪除購物車單品項
      }else if(e.target.getAttribute('data-materialIcon') == index){
        deleteCartItem(item.id);
      //清除購物車
      }else if(e.target.getAttribute('class') == 'discardAllBtn'){
        deleteAllCartList();
      }else{
        return
      }
    })
})

// 送出購買訂單
orderInfoBtn.addEventListener("click", e => {
  e.preventDefault();
  //如果購物車沒東西不能送出訂單
  if(cartListData.carts.length == 0){
    alert('購物車沒有產品喔～');
    return
  };
  //validate.js 資料驗證
  //選取元素<input><select>裡面有 name 屬性的
  const inputs = document.querySelectorAll("input[name], select[name]");
  console.log(inputs);
  const orderInfoForm = document.querySelector(".orderInfo-form");

  const constraints = {
    "姓名": {
      presence: {
        message: "為必填欄位"
      }
    },
    "電話": {
      presence: {
        message: "為必填欄位"
      },
      format: {
        pattern: /(\d{4}-)\d{6}/,  //0910-888999
        message: "格式不正確！"
      }
    },
    "Email": {
      presence: {
        message: "為必填欄位"
      },
      email: {  //validate.js 規定格式
        message: "格式不正確！" 
      }
    },
    "寄送地址": {
      presence: {
        message: "為必填欄位"
      },
      length: {
        minimum: 9,
        message: "地址長度不足唷～"
      }
    }
  }

  //validate(驗證範圍, 約束條件(固定的單字))
  let inputValidate = validate(orderInfoForm, constraints);
    console.log(inputValidate);
    //如果驗證沒過的話執行
    if (inputValidate) {
    inputs.forEach(item => {
      /*驗證有error的欄位，item.nextElementSibling會留下訊息
      ，驗證沒有error的欄位，item.nextElementSibling=""*/
      item.nextElementSibling.textContent = "";

      Object.keys(inputValidate).forEach(item => {
        //選取特定的p段落顯示錯誤訊息
        document.querySelector(`[data-message="${item}"]`).textContent = inputValidate[item];
      })
    })
  //驗證有過的話執行  
  }else {
    //這段會發生錯誤
    // inputs.forEach(item => { 
    //   console.log(item);
    //   item.nextElementSibling.textContent = "";
    // });
    createOrder(inputs);
    orderInfoForm.reset();  
  }
})


//工具
// 1. 千位數
function toThousands(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//2. sweetalert2
function addCartSuccessInfo(){
  Swal.fire({
    icon: 'success',
    title: '已加入購物車',
  })
}