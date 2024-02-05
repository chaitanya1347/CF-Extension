document.addEventListener('DOMContentLoaded', function () {
    var buttonElement = document.getElementById("button-save");
    var buttonElementClearAll = document.getElementById("button-clear");
    var apiKeyText = "API-KEY-Text";
    var secretKey = "Secret-Text";

    buttonElement.addEventListener("click", function storeCredentials() {
        var username = document.getElementById(apiKeyText).value;
        var password = document.getElementById(secretKey).value;
        var errorMessage = document.getElementById('errorMessage');

        // Simple validation (you might want to add more robust validation)
        if ((username.trim() === '' || password.trim() === '')) {
            errorMessage.textContent = 'Please enter both username and password.';
            return;
        }

        // Store the credentials in chrome.storage.local
        chrome.storage.local.set({ apiKeyText : username, secretKey : password }).then(() => {
            // console.log('Credentials stored in local storage:', { apiKeyText: username, secretKey: password });
            console.log("set");
            errorMessage.textContent = 'Credentials';
            errorMessage.style.color = 'green';
        });
    });


    chrome.storage.local.get([apiKeyText]).then((result)=>{
        if(apiKeyText in result){
            console.log('test') 
            document.getElementById(apiKeyText).value = result[apiKeyText];
        }
    });

    chrome.storage.local.get([secretKey]).then((result)=>{
        if(secretKey in result){
            document.getElementById(secretKey).value = result[secretKey];
        }
    });

    buttonElementClearAll.addEventListener("click",function ClearCredentials(){
        document.getElementById(apiKeyText).value = '';
        document.getElementById(secretKey).value = '';
        console.log("YES WE ARE HEREE");
    })
})
