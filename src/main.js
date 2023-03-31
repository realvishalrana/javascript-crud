

// import SubMain from "./subMain.js";
// export default class Main {
//   constructor() {
//     new SubMain();
//   }
// }
// window.onload = function () {
//   new Main();
// };
const table = document.querySelector("#form-table tbody")
const tableArea = document.getElementById("table-area")
const form = document.getElementById("form1");
let updateIndex;
let updateAble = false;

// to set the max value of date to current date preventing future dates
 const date = new Date()
 document.getElementById("dob").max = date.toISOString().slice(0,10);


function getInputValues(elem){
  return document.getElementById(elem).value;
}
function getInputOptionValues(elem){
  const values = Array.from(document.getElementsByClassName(elem))
  const arr = [];

  values.forEach((v)=>{
    if(v.checked){
      arr.push(v.value)
    }
  })
  return arr.toString();
}


form.addEventListener("submit",storeData);
window.addEventListener("load",addData);
form.addEventListener("reset",() => {updateAble = false;})

// function to show Table
function addData(){

  table.innerHTML = '';
  let formArray;

  if(!localStorage.getItem("formData")){
    tableArea.style.display = "none"
    return;
  }else{
    tableArea.style.display = ""
    formArray = JSON.parse(localStorage.getItem("formData"))
  }


  formArray.forEach((value,index) => {
    const tr = document.createElement('tr');
    for(const x of Object.values(value)){
      const td = document.createElement('td');
      const textNode = document.createTextNode(x);
      td.appendChild(textNode);
      tr.appendChild(td);
    }
    const btnArr = ["Delete","Edit"];
      for(const x of btnArr){
        const button = document.createElement('button');
        button.setAttribute("class",x)
        button.setAttribute("index",index)
        const textNode = document.createTextNode(x);
        button.appendChild(textNode);

        if(button.getAttribute("class") === 'Delete'){
          button.addEventListener('click',deleteData)
        }else{
          button.addEventListener("click",editData)
        }
        const td = document.createElement('td');
        td.appendChild(button);
        tr.appendChild(td)
      }
      table.appendChild(tr);
  })
}

//function to store Data
function storeData(event){

  event.preventDefault();

  let formArray;

  localStorage.getItem("formData") ? formArray = JSON.parse(localStorage.getItem("formData")) : formArray = []

  const formObj = {
    Name:getInputValues("name"),
    Gender:getInputOptionValues("gender"),
    DOB:getInputValues("dob"),
    Email:getInputValues("email"),
    Phone:getInputValues("phone"),
    Hobbies:getInputOptionValues("hobbies")
  }

  if(updateAble){
    let arrObj;
    if(!localStorage.getItem("formData")){
      return
    }else{
      arrObj = JSON.parse(localStorage.getItem("formData"))
    }
    arrObj[updateIndex] = formObj;
    localStorage.setItem("formData",JSON.stringify(arrObj))
    addData();

    form.reset();
    return;
  }
  else{
    formArray.push(formObj);
    localStorage.setItem("formData",JSON.stringify(formArray))
    addData();
    form.reset();
  }

}

//function to delete data
function deleteData(event){
  const index = event.target.getAttribute("index");
  let formArray;

  localStorage.getItem("formData") ? formArray = JSON.parse(localStorage.getItem("formData")) :formArray = []

  formArray.splice(index,1)
  localStorage.setItem('formData',JSON.stringify(formArray));
  if(!formArray.length){
    localStorage.removeItem('formData');
  }
  updateAble = false
  addData();
}
//update data
function editData(event){
  const index = event.target.getAttribute("index");
  let formArray;
  localStorage.getItem("formData") ? formArray = JSON.parse(localStorage.getItem("formData")) : formArray = []

  const keys = Object.keys(formArray[index]);
  const values = Object.values(formArray[index]);

  keys.forEach((data,id) => {
     if(data === "Gender"){
      form.elements[values[id].toLowerCase()].checked = true;
    }else if(data === "Hobbies"){
      const array = values[id].split(',');
      array.forEach((v) => {
        form.elements[v.toLowerCase()].checked = true;
      })
    }
    else{
      form.elements[data.toLowerCase()].value = values[id]
    }
  })
  updateAble = true;
  updateIndex = index
}
