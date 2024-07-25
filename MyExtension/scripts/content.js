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
        <th class="" style="width:5em;">Time</th>
    </tr>
    `;
    const verdictMap = new Map([
      ['OK', '✅'],
      ['WRONG_ANSWER', '❌'],
      ['TIME_LIMIT_EXCEEDED', '⏱️'],
      ['MEMORY_LIMIT_EXCEEDED', '💾'],
      ['DEFAULT', '⚠️']
    ]);

    const getEmoji = (verdict) => verdictMap.get(verdict) ?? verdictMap.get('DEFAULT');


    const ratingMap = new Map([
      ['newbie', 'rated-user user-gray'],
      ['pupil', 'rated-user user-green'],
      ['specialist', 'rated-user user-cyan'],
      ['expert', 'rated-user user-blue'],
      ['candidate master', 'rated-user user-violet'],
      ['master', 'rated-user user-orange'],
      ['international grandmaster', 'rated-user user-red'],
      ['legendary grandmaster', 'rated-user user-legendary']
    ]);

    console.log(handles);
    const oneday = 60 * 60 * 24 * 1000; //miliseconds
    const submissionsCount = 5;
    let handleCount = 0;
    handles.forEach(handle => {
      statusUrl = baseURL + `user.status?handle=${handle}&from=1&count=${submissionsCount}`;
      // console.log(statusUrl);
      //Get rating
      let rating;
      infoUrl = baseURL + `user.info?handles=${handle}`;
      // console.log(infoUrl);
      fetch(infoUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(resBody => {
          console.log(resBody);
          rating = resBody.result[0].rank;
        })
        .catch(error => {
          console.error('Error:', error);
        });

      //Get status of submissions
      fetch(statusUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(responseBody => {
          for(let i=0; i<submissionsCount; i++){
            const submissionTime = responseBody.result[i].creationTimeSeconds*1000;
            if(( (new Date().getTime()) - responseBody.result[i].creationTimeSeconds*1000) < oneday){
              handleCount++;

              let tableRowElement = document.createElement("tr");
              if(handleCount%2){
                  tableRowElement.innerHTML = `
                      <td class = "left dark"><a class = "${ratingMap.get(rating)}" href="/profile/${handle}"> ${handle} </a> </td>
                      <td class = " dark" >
                        <a href = "/problemset/problem/${responseBody.result[i].problem.contestId}/${responseBody.result[i].problem.index}">
                          ${responseBody.result[i].problem.name}
                          ${getEmoji(responseBody.result[i].verdict)}
                        </a>
                      </td>
                      <td class = " dark">${new Date(submissionTime).toLocaleTimeString()}</td>
                  `;
              }
              else {
                  tableRowElement.innerHTML = `
                  <td class = "left"><a class = "${ratingMap.get(rating)}" href="/profile/${handle}"> ${handle} </a></td>
                  <td class = " ">
                    <a href = "/problemset/problem/${responseBody.result[i].problem.contestId}/${responseBody.result[i].problem.index}">
                      ${responseBody.result[i].problem.name}
                      ${getEmoji(responseBody.result[i].verdict)}
                    </a>
                  </td>

                  <td class = " ">${(new Date(submissionTime)).toLocaleTimeString()}</td>
                  `;
              }
              tableBody.appendChild(tableRowElement);
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
        
    });
    
    let el1 = document.querySelector("#sidebar > div:nth-child(1)");

    el1.insertAdjacentElement('afterend', friendsTableDiv);
}

getHandles();