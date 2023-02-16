const kwick_url = 'http://greenvelvet.alwaysdata.net/kwick/api/';

const username = localStorage.getItem('name');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('user-id');

// protect private page

if (token === null || userId === null || username === null) {
	window.location.href = './index.html';
}

// ==== Send message ====

document.getElementById('send').addEventListener('click', function (e) {
	e.preventDefault();

	const input = document.getElementById('in');
	sendMessage(input.value);

	input.value = '';
});

function sendMessage(message) {
	message = encodeURI(message);

	fetch(kwick_url + `say/${token}/${userId}/${message}`)
		.then((rep) => rep.json())
		.then((response) => {
			console.log(response);

			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}
		});
}

// ==== Log out ====

document.getElementById('button-logout').addEventListener('click', function (e) {
	e.preventDefault();

	fetch(kwick_url + `logout/${token}/${userId}`)
		.then((rep) => rep.json())
		.then((response) => {
			console.log(response);

			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}

			localStorage.clear();
			window.location.href = './index.html';
		});
});

// === Manage messages

let last_timestamp = 0;

function updateMessageList() {
	fetch(kwick_url + `talk/list/${token}/${last_timestamp}`)
		.then((rep) => rep.json())
		.then((response) => {
			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}

			const messageList = response.result.talk;
			//console.log(response.result.last_timestamp);
			if (messageList.length > 0) {
				last_timestamp = response.result.last_timestamp;
			}

			let result = '';

			for (let j = 0; j < messageList.length; j++) {
				const myMessage = username == messageList[j].user_name;

				const justification = myMessage ? 'message-right' : 'message-left';
				const name = myMessage ? '' : messageList[j].user_name;

				const color = myMessage ? 'bg-primary' : 'bg-light';

				const txtColor = myMessage ? 'text-white' : 'text-muted';

				result += `<div class="${justification} w-50 mb-3">
        ${name}
        <div class="ml-3">
          <div class="${color} rounded py-2 px-3 mb-2">
            <p class="mb-0 ${txtColor}">${messageList[j].content}</p>
          </div>
          <p class="small text-muted">${timestampToDate(messageList[j].timestamp)}</p>
        </div>
      </div>`;
			}

			document.getElementById('message-list').innerHTML += result;

			const div = document.getElementsByClassName('chat-box')[0];
			div.scrollTop = div.scrollHeight;
		});
}

updateMessageList();

setInterval(updateMessageList, 3000);

// ==== Manage user list ====

function updateUserList() {
	fetch(kwick_url + `user/logged/${token}`)
		.then((rep) => rep.json())
		.then((response) => {
			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}

			const userList = response.result.user;
			let result = '';

			for (let j = 0; j < userList.length; j++) {
				result += `<a href="#" class="list-group-item list-group-item-action list-group-item-light rounded-0">
      <div >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-circle text-muted" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
        <div class="ml-4">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <h6 class="mb-0"></h6>
            <small>${userList[j]}</small>
          </div>
          <p class="mb-0">online</p>
        </div>
      </div>
    </a>`;
			}

			document.getElementById('user-list').innerHTML = result;
		});
}

updateUserList();

setInterval(updateUserList, 5000);

// Snackbar message

function showSnackbar(message) {
	// Get the snackbar DIV
	var x = document.getElementById('snackbar');
	x.innerText = message;
	x.className = 'show';

	// After 3 seconds, remove the show class from DIV
	setTimeout(function () {
		x.className = x.className.replace('show', '');
	}, 3000);
}

function timestampToDate(ts) {
	const date = new Date(ts * 1000);

	return (
		date.getDate() +
		'/' +
		(date.getMonth() + 1) +
		'/' +
		date.getFullYear() +
		' ' +
		date.getHours() +
		':' +
		date.getMinutes() +
		':' +
		date.getSeconds()
	);
}
