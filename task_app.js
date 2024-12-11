// グローバル変数の宣言
const ul = document.getElementById("ul");
const input = document.getElementById("input");
const form = document.getElementById("form");


// リストアイテムの作成
function createTaskElement(task){
    const li = document.createElement("li");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.classList.add("me-2")
    li.appendChild(checkbox);
    
    li.appendChild(document.createTextNode(task)); //テキストの追加
    li.classList.add("list-group-item","d-flex", "align-items-center");
    
    return {li, checkbox};
}

// ローカルストレージにデータを保存
function save_data(){
    const datas = document.querySelectorAll("li");
    let tasks = [];
    datas.forEach(data =>{
        tasks.push(data.innerText);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// inputに入力された内容をリストに追加して表示
function display_task(task){
    const {li, checkbox} = createTaskElement(task ? task :input.value);
    ul.appendChild(li);
    if(!task) input.value = "";

    achieved(checkbox, li);
    edit(li);
    save_data();
}


// 左クリックでタスクの削除
function achieved(box, li){
    box.addEventListener("change", function(){
        if(box.checked){deleteTaskAfterDelay(li);}
    });
}


function deleteTaskAfterDelay(li){
    const DELETE_TIME = 700;
    setTimeout(function(){
        li.remove();
        save_data();
    }, DELETE_TIME);
} 


// 右クリックでタスクの編集
function edit(li){
    li.addEventListener("contextmenu", function(e){
        e.preventDefault();

        const target = e.target; //右クリックした要素を取得

        if(target.tagName === "LI"){
            const input = document.createElement("input");
            input.value = target.textContent;

            // リスト項目を置き換え
            target.parentNode.replaceChild(input, target);

            input.addEventListener("blur", function(e){
                e.preventDefault();
                if(!input.dataset.preventBlur){
                updateTask(input);
                }
            });
            input.addEventListener("keydown", function(e){
                if(e.key === "Enter"){
                e.preventDefault();
                input.dataset.preventBlur = true;
                updateTask(input);
                }
            });
        }     
    });
}


//編集後のタスクを更新
function updateTask(input){
    const {li, checkbox} =  createTaskElement(input.value);
    input.parentNode.replaceChild(li, input);

    // 新しい<li>にイベントリスナーを付与
    achieved(checkbox, li);
    edit(li);
    save_data();
}


// enterkey入力で、インプットの内容を表示
form.addEventListener("submit", function(e) {
    e.preventDefault();
    display_task();
});


// リロード時にデータが残っていたら表示させる
const tasks = JSON.parse(localStorage.getItem("tasks"));

if (tasks){
    tasks.forEach(task =>{
        display_task(task);
    });
}


