//Variables
const ERROR_TYPES = {
  FETCH_ERROR: "FETCH_ERROR",
  FETCH_RESPONSE: "FETCH_RESPONSE",
  XHR_STATE: "XHR_STATE",
  XHR_STATUS: "XHR_STATUS",
  INVALID_INPUT: "INVALID_INPUT"
};

let fetchBtn = document.getElementById("fetch-btn");
let xhrBtn = document.getElementById("xhr-btn");
let postsBtn = document.getElementById("posts-btn");
let dataDiv = document.getElementById("data");
let errorDiv = document.getElementById("error");
let form = document.getElementById("form");

//Event listeners
fetchBtn.addEventListener("click", function() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => {
            if (!response.ok) {
                showError(ERROR_TYPES.FETCH_RESPONSE,"Network response was not ok");
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateDataDiv(data);
        })
        .catch(error => showError(ERROR_TYPES.FETCH_ERROR,'Error fetching data'));
});

xhrBtn.addEventListener("click", function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                populateDataDiv(data);
            } else {
                showError(ERROR_TYPES.XHR_STATUS,'Error fetching data: '+xhr.statusText);
            }
        } else {
            showError(ERROR_TYPES.XHR_STATE,'XHR state error');
        }
    };
    xhr.send();
});

postsBtn.addEventListener("click", function() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            if (!response.ok) {
                showError(ERROR_TYPES.FETCH_RESPONSE,"Network response was not ok");
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dataDiv.innerHTML = "";
            for (const key in data) {
                populateDataDiv(data[key],false);
            }
        })
        .catch(error => showError(ERROR_TYPES.FETCH_ERROR,'Error fetching data'));
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const type = formData.get("type");
    const id = formData.get("id");
    const title = formData.get("title");
    const body = formData.get("body");

    if(title.trim() === "") {
        showError(ERROR_TYPES.INVALID_INPUT,'Title is empty');
        return;
    }

    if(body.trim() === "") {
        showError(ERROR_TYPES.INVALID_INPUT,'Body is empty');
        return;
    }
    
    if(type === "POST"){
        sendPost(title,body);
    } else if(type === "PUT"){
        sendPut(id,title,body);
    }
});

//Functions
function showError(errorType, errorMessage){
    window.scrollTo(0, 0);
    let border = "";
    switch (errorType) {
        case ERROR_TYPES.FETCH_ERROR:
            border = "2px solid red";
            break;
        case ERROR_TYPES.FETCH_RESPONSE:
            border = "2px solid orange";
            break;
        case ERROR_TYPES.XHR_STATE:
            border = "2px solid purple";
            break;
        case ERROR_TYPES.XHR_STATUS:
            border = "2px solid blue";
            break;
        case ERROR_TYPES.INVALID_INPUT:
            border = "2px solid yellow";
            break;
        default:
            console.log("Invalid error type:");
    }

    errorDiv.style.border = border;
    errorDiv.innerHTML = "Error: "+errorMessage;
}

function clearError(){
    errorDiv.style.border = "";
    errorDiv.innerHTML = "";
}

function populateDataDiv(object, clear = true){
    clearError();

    if(clear){
        dataDiv.innerHTML = "";
    }

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            dataDiv.innerHTML += `<p><strong>${key}:</strong> ${object[key]}</p>`;
        }
    }
}

function sendPost(title,body){
    fetch('https://jsonplaceholder.typicode.com/posts',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            body: body
        })
    })
    .then(response => {
        if (!response.ok) {
            showError(ERROR_TYPES.FETCH_RESPONSE,"Network response was not ok");
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        populateDataDiv(data);
    })
    .catch(error => showError(ERROR_TYPES.FETCH_ERROR,'Error fetching data'));
}

function sendPut(id,title,body){
    const url = "https://jsonplaceholder.typicode.com/posts/"+id;
    const xhr = new XMLHttpRequest();
    const data = {
        userId: 1,
        id: id,
        title: title,
        body: body
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                populateDataDiv(data);
            } else {
                showError(ERROR_TYPES.XHR_STATUS,'Error fetching data');
            }
        } else {
            showError(ERROR_TYPES.XHR_STATE,'XHR state error')
        }
    };

    xhr.send(JSON.stringify(data));
}