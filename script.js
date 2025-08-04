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