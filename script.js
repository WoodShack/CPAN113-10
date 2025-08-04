//Variables
let fetchBtn = document.getElementById("fetch-btn");
let xhrBtn = document.getElementById("xhr-btn");
let dataDiv = document.getElementById("data");
let errorDiv = document.getElementById("error");

//Event listeners
fetchBtn.addEventListener("click", function() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => {
            if (!response.ok) {
                showError("Network response was not ok");
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateDataDiv(data);
        })
        .catch(error => showError('Error fetching data'));
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
                showError('Error fetching data: '+xhr.statusText);
            }
        }
    };
    xhr.send();
});

//Functions
function showError(errorMessage){
    errorDiv.innerHTML = errorMessage;
}

function populateDataDiv(object){
    dataDiv.innerHTML = "";
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            dataDiv.innerHTML += `<p><strong>${key}:</strong> ${object[key]}</p>`;
        }
    }
}