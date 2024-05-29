import * as util from "./src/Util.js";

const formElement = document.querySelector("#js-form");
const inputElement = document.querySelector("#js-form-input");
const listContainer = document.querySelector("#js-list-container");
const todoLists = document.querySelector("#js-todo-list");
const doneLists = document.querySelector("#js-done-list");
const allItemCountElement = document.querySelector("#js-all-count");
const todoItemCountElement = document.querySelector("#js-todo-count");
const doneItemCountElement = document.querySelector("#js-done-count");

// ダークモード用
const body = document.querySelector("body");
const darkmodeBtn = document.querySelector("#dark-mode-btn");

darkmodeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
})

let todoCount = 0;
let doneCount = 0;

// 追加ボタン押下
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const sanitizedText = util.escapeSpecialChars(inputElement.value.trim());
  if (!sanitizedText) return;

  const listTemplate = document.getElementById("list-template");
  const liContent = listTemplate.content;
  const listClone = document.importNode(liContent, true);
  
  listClone.querySelector(".content").innerText = sanitizedText;
  todoLists.appendChild(listClone);

  todoCount = todoLists.childElementCount;
  doneCount = doneLists.childElementCount;
  
  todoItemCountElement.textContent = `未完了: ${todoCount}`;
  doneItemCountElement.textContent = `完了済: ${doneCount}`;
  allItemCountElement.textContent = `全タスク数: ${todoCount + doneCount}`;
  inputElement.value = "";
});

listContainer.addEventListener("click", (event) => {

  const parentElement = event.target.parentElement;
  // チェックボックス
  if (event.target.classList.contains("checkbox")) {
        if ( event.target.checked ){
          parentElement.className = "done";
          todoLists.removeChild(parentElement);
          doneLists.appendChild(parentElement);
          todoCount = todoLists.childElementCount;
          doneCount = doneLists.childElementCount;
          todoItemCountElement.textContent = `未完了: ${todoCount}`;
          doneItemCountElement.textContent = `完了済: ${doneCount}`;
          allItemCountElement.textContent = `全タスク数: ${todoCount + doneCount}`;
        } else {
          parentElement.className = "todo";
          doneLists.removeChild(parentElement);
          todoLists.appendChild(parentElement);
          todoCount = todoLists.childElementCount;
          doneCount = doneLists.childElementCount;
          todoItemCountElement.textContent = `未完了: ${todoCount}`;
          doneItemCountElement.textContent = `完了済: ${doneCount}`;
          allItemCountElement.textContent = `全タスク数: ${todoCount + doneCount}`;
        }
  }

  // 編集ボタン押下
  if (event.target.classList.contains("updBtn")) {
    const updFormTemplate = document.querySelector("#update-form-template");
    const updFormContent = updFormTemplate.content;
    const updFormClone = document.importNode(updFormContent, true);
    const previousContent = parentElement.querySelector(".content").textContent;
    
    parentElement.querySelector(".checkbox").style.display = "none";
    parentElement.querySelector(".delBtn").style.display = "none";
    parentElement.querySelector(".updBtn").style.display = "none";
    parentElement.style.display = "inline-block";
    updFormClone.querySelector("#js-updateForm-input").value = previousContent;
    parentElement.querySelector(".content").replaceWith(updFormClone);
  }

  // 更新ボタン押下
  if (event.target.classList.contains("finBtn")) {
    const updateInputElement = parentElement.querySelector("#js-updateForm-input");
    const sanitizedUpdateText = util.escapeSpecialChars(updateInputElement.value.trim());

    if(!sanitizedUpdateText) return;

    const spanElement = document.createElement("span");
    spanElement.className = "content";
    spanElement.textContent = sanitizedUpdateText;
    
    event.target.remove();
    updateInputElement.replaceWith(spanElement);

    parentElement.querySelector(".checkbox").style.display = "";
    parentElement.querySelector(".delBtn").style.display = "";
    parentElement.querySelector(".updBtn").style.display = "";
    parentElement.style.display = "";

  }

  // 削除ボタン押下
  if (event.target.classList.contains("delBtn")) {
    let result = confirm("本当によろしいですか");

    if (result) {
      parentElement.remove();

      todoCount = todoLists.childElementCount;
      doneCount = doneLists.childElementCount;
      todoItemCountElement.textContent = `未完了: ${todoCount}`;
      doneItemCountElement.textContent = `完了済: ${doneCount}`;
      allItemCountElement.textContent = `全タスク数: ${todoCount + doneCount}`;

    } else {
      return;
    }
  }
});
