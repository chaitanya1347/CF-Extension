async function init(handles) {
  // ****** Generating the correct api endpoint **********
  const baseURL = "https://codeforces.com/api/";

  // ****** Generating the HTML for table **********
  const friendsTableDiv = document.createElement("div");
  friendsTableDiv.className = "roundbox sidebox top-contributed borderTopRound ";

  const tableCaptionDiv = friendsTableDiv.appendChild(document.createElement("div"));
  tableCaptionDiv.className = "caption titled";
  tableCaptionDiv.innerHTML = "Friends' Submissions";

  const tableDiv = friendsTableDiv.appendChild(document.createElement("table"));
  tableDiv.className = "rtable ";

  const tableBody = tableDiv.appendChild(document.createElement("tbody"));
  tableBody.innerHTML = `
      <tr>
          <th class="left">User</th>
          <th>Problem</th>
          <th class="" style="width:5em;">Time</th>
      </tr>
  `;

  const verdictMap = new Map([
      ['OK', '✅'],  // Green check mark
      ['WRONG_ANSWER', '❌'],  // Red cross mark
      ['TIME_LIMIT_EXCEEDED', '⌛'],  // Hourglass
      ['MEMORY_LIMIT_EXCEEDED', '💡'],  // Light bulb
      ['DEFAULT', '⚠️']  // Warning sign
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

  const oneday = 60 * 60 * 24 * 1000; // milliseconds
  const submissionsCount = 6;
  let handleCount = 0;

  for (let handle of handles) {
      try {
          // Fetch user info
          const infoUrl = `${baseURL}user.info?handles=${handle}`;
          const infoResponse = await fetch(infoUrl);
          if (!infoResponse.ok) {
              throw new Error('Network response was not ok');
          }
          const infoBody = await infoResponse.json();
          const rating = infoBody.result[0].rank;

          // Fetch user submissions
          const statusUrl = `${baseURL}user.status?handle=${handle}&from=1&count=${submissionsCount}`;
          const statusResponse = await fetch(statusUrl);
          if (!statusResponse.ok) {
              throw new Error('Network response was not ok');
          }
          const responseBody = await statusResponse.json();

          // Process submissions
          for (let i = 0; i < submissionsCount; i++) {
              const submissionTime = responseBody.result[i].creationTimeSeconds * 1000;
              if ((new Date().getTime()) - responseBody.result[i].creationTimeSeconds * 1000 < oneday) {
                  handleCount++;

                    const dateObj = new Date(submissionTime);
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const formattedTime = `${monthNames[dateObj.getMonth()]}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.toLocaleTimeString()}<sup title="timezone offset" style="font-size:8px;"> UTC${(dateObj.getTimezoneOffset() / -60).toFixed(1)}</sup>`;

                  const tableRowElement = document.createElement("tr");
                  const isOdd = handleCount % 2 !== 0;
                
                  tableRowElement.innerHTML = `
                      <td class="left ${isOdd ? 'dark' : ''}">
                          <a class="${ratingMap.get(rating)}" href="/profile/${handle}">${handle}</a>
                      </td>
                      <td class="${isOdd ? 'dark' : ''}">
                          <a href="/problemset/problem/${responseBody.result[i].problem.contestId}/${responseBody.result[i].problem.index}">
                              <div style="display: flex; align-items: center;">
                                  <span style="flex-grow: 1;">${responseBody.result[i].problem.name}</span>
                                  <span>${getEmoji(responseBody.result[i].verdict)}</span>
                              </div>
                          </a>
                      </td>
                        <td class="status-small ${isOdd ? 'dark' : ''}">
                                ${formattedTime}
                        </td>
                  `;
                  tableBody.appendChild(tableRowElement);
              }
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }

  const el1 = document.querySelector("#sidebar > div:nth-child(1)");
  el1.insertAdjacentElement('afterend', friendsTableDiv);
}

async function getHandles() {
  try {
      const result = await new Promise((resolve, reject) => {
          chrome.storage.local.get('userHandles', (result) => {
              if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError.message);
              } else {
                  resolve(result.userHandles);
              }
          });
      });

      if (result) {
          await init(result);
      } else {
          init([]);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

getHandles();
