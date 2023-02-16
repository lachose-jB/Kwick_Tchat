const kwick_url = 'http://greenvelvet.alwaysdata.net/kwick/api/';

// ==== Signin ====

document.getElementById('button-login').addEventListener('click', function (e) {
	e.preventDefault();

	// datas
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	// verif fields

	if (username.length < 1 || password.length < 1) {
		showSnackbar('You must feel all the form please');
		return;
	}

	fetch(kwick_url + `login/${username}/${password}`)
		.then((rep) => rep.json())
		.then((response) => {
			console.log(response);

			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}

			// save token & id

			savePersonnalData(username, response.result.token, response.result.id);

			window.location.href = './chat.html';
		})
		.catch(function (error) {
			showSnackbar(error);
		});
});

// ==== Sign up ====

document.getElementById('button-sign-up').addEventListener('click', function (e) {
	e.preventDefault();

	// datas
	const username = document.getElementById('new-username').value;
	const password = document.getElementById('new-password').value;
	const password2 = document.getElementById('new-password2').value;

	// verif fields

	if (username.length < 1 || password.length < 1 || password2.length < 1) {
		showSnackbar('You must feel all the form please');
		return;
	}

	if (password != password2) {
		showSnackbar('Passwords must be the same');
		return;
	}

	fetch(kwick_url + `signup/${username}/${password2}`)
		.then((rep) => rep.json())
		.then((response) => {
			console.log(response);

			// manage api errors
			if (response.result.status == 'failure') {
				showSnackbar(response.result.message);
				return;
			}

			// save token & id

			savePersonnalData(username, response.result.token, response.result.id);

			window.location.href = './chat.html';
		})
		.catch(function (error) {
			showSnackbar(error);
		});
});

// save to localStorage

function savePersonnalData(name, token, id) {
	localStorage.setItem('name', name);
	localStorage.setItem('token', token);
	localStorage.setItem('user-id', id);
}

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
