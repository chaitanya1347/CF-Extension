document.addEventListener('DOMContentLoaded',function(){

    var buttonElement = document.getElementById("button-save");
    var buttonElementClearAll = document.getElementById("button-clear");
    var apiKeyText = "API-KEY-Text";
    var secretKey = "Secret-Text";
    var apiKeyTextvalue = document.getElementById(apiKeyText);
    var secretKeyValue  = document.getElementById(secretKey);
    var keysToRemove = ['apiKeyText', 'secretKey'];



    buttonElement.addEventListener("click", function storeCredentials() {
        var username = document.getElementById(apiKeyText).value;
        var password = document.getElementById(secretKey).value;
        var errorMessage = document.getElementById('errorMessage');

        // Simple validation (might want to add more robust validation)
        if ((username.trim() === '' || password.trim() === '')) {
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Please enter both username and password.';
            return;
        }

        // Store the credentials in chrome.storage.local
        chrome.storage.local.set({ apiKeyText : username, secretKey : password },()=>{
            errorMessage.textContent = 'Credentials Saved Successfully';
            errorMessage.style.color = 'green';
        });
    });
    

    // Remove the specified keys from local storage
    buttonElementClearAll.addEventListener('click', ()=>{
        apiKeyTextvalue.value = "";
        secretKeyValue.value = "";
        chrome.storage.local.remove(keysToRemove);
    });


    chrome.storage.local.get(['apiKeyText','secretKey'],function(result){
        if(result.apiKeyText!==undefined && result.secretKey!==undefined){
            document.getElementById(apiKeyText).value = result.apiKeyText;
            document.getElementById(secretKey).value = result.secretKey;
        }
    });
    
})