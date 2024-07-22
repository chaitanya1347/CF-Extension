function getHandles() {
  chrome.storage.local.get('userHandles', function (result) {
    console.log()
      if (result.userHandles) {
        init(result.userHandles);
      } else {
        init([]);
      }
  });
}

function init(handles){

    // ****** Generating the correct api endpoint **********

    let baseURL = "https://codeforces.com/api/";

    // ****** Generating the HTML for table **********
    let friendsTableDiv = document.createElement("div");
    friendsTableDiv.className = "roundbox sidebox top-contributed borderTopRound ";

    let tableCaptionDiv = friendsTableDiv.appendChild(document.createElement("div"));
    tableCaptionDiv.className = "caption titled";
    tableCaptionDiv.innerHTML = "Friends' Submissions";

    let tableDiv = friendsTableDiv.appendChild(document.createElement("table"));
    tableDiv.className = "rtable ";

    let tableBody = tableDiv.appendChild(document.createElement("tbody"));
    tableBody.innerHTML = `
    <tr>
        <th class = "left ">User</th>
        <th>Problem</th>
        <th class="" style="width:5em;">Verdict</th>
        <th class="" style="width:5em;">Verdict</th>
    </tr>
    `;

    // let handles = getHandles();
    console.log(handles);
    const submissionsCount = 5;
    let handleCount = 0;
    handles.forEach(handle => {
      statusUrl = baseURL + `user.status?handle=${handle}&from=1&count=${submissionsCount}`;
      console.log(statusUrl);
      fetch(statusUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(responseJSON => {
          for(let i=0; i<submissionsCount; i++){
            let tableRowElement = document.createElement("tr");
              if(i%2){
                  tableRowElement.innerHTML = `
                      <td class = "left dark">${handle}</td>
                      <td class = " dark">${responseJSON.result[i].problem.name}</td>
                      <td class = " dark">PASS</td>
                      <td class = " dark">PASS</td>
                  `;
              }
              else {
                  tableRowElement.innerHTML = `
                  <td class = "left ">${handle}</td>
                  <td class = " ">${responseJSON.result[i].problem.name}</td>
                  <td class = " ">PASS</td>
                  <td class = " ">PASS</td>
                  `;
              }
              tableBody.appendChild(tableRowElement);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
        handleCount++;
    });
    
    let el1 = document.querySelector("#sidebar > div:nth-child(1)");

    el1.insertAdjacentElement('afterend', friendsTableDiv);
}

getHandles();