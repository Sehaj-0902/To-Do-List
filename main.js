let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let searchInput = document.getElementById("searchInput");

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    formValidation();
});

let formValidation = () => {
    if(textInput.value === "") {
        console.log("failure");
        msg.innerHTML = "Task cannot be blank."
    }
    else {
        console.log("success");
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();

        (() => {
            add.setAttribute("data-bs-dismiss", "");
        })();
    }
};

let dataArray = [{}];

let acceptData = () => {
    dataArray.push({
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value,
    });

    localStorage.setItem("data",JSON.stringify(dataArray));

    console.log(dataArray);
    createTask();
};

let createTask = () => {
    tasks.innerHTML = "";
    if(dataArray.length === 0) {
        tasks.innerHTML = "No tasks added yet.";
    }
    else {
        dataArray.map((i, j) => {
            return (
                tasks.innerHTML += `
                    <div id=${j}>
                        <span class="fw-bold">${i.text}</span>
                        <span class="small text-secondary">${i.date}</span>
                        <p>${i.description}</p>
                        <span class="options">
                            <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                            <i onClick="deleteTask(this)" class="fa-solid fa-trash-can"></i>
                        </span>
                    </div>
                `
            );
        });
    }
    resetForm();
};

let deleteTask = (e) => {
    e.parentElement.parentElement.remove();
    dataArray.splice(e.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(dataArray));
    console.log(dataArray);
    if(dataArray.length === 0) {
        tasks.innerHTML = "No tasks added yet.";
    }
};

let editTask = (e) => {
    let selectedTask = e.parentElement.parentElement;

    textInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    textarea.value = selectedTask.children[2].innerHTML;

    deleteTask(e);
}

let searchTask = () => {
    let searchItem = searchInput.value.toLowerCase();
    let filterData = dataArray.filter(task => {
        let text = task.text.toLowerCase();
        let description = task.description.toLowerCase();
        return text.includes(searchItem) || description.includes(searchItem);
    });

    tasks.innerHTML = "";

    if(filterData.length > 0) {
        filterData.map((i, j) => {
            tasks.innerHTML += `
                <div id=${j}>
                    <span class="fw-bold">${i.text}</span>
                    <span class="small text-secondary">${i.date}</span>
                    <p>${i.description}</p>
                    <span class="options">
                        <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square"></i>
                        <i onClick="deleteTask(this)" class="fa-solid fa-trash-can"></i>
                    </span>
                </div>
            `;
        });
    }
    else {
        tasks.innerHTML = "No tasks found.";
    }
};

document.getElementById("btn").addEventListener("click", searchTask);

let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
};

(() => {
    dataArray = JSON.parse(localStorage.getItem("data"));
    createTask();
})();