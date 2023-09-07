var mainSong;
var questionIndex = 0;

const questions = [
	{
		"question": "How many children do you have in your household?",
		"options": ["1 Boy", "1 Girl", "None", "Multiple"],
		"answer": 0
	},
	{
		"question": "Which of the following political parties are illegal?",
		"options": ["The Democracy Party of China", "Union of Chinese Nationalists", "Zhi Xian Party", "All of the above"],
		"answer": 3
	},
	{
		"question": "Do you consent to have your town used as a nuclear testing site?",
		"options": ["Yes", "No"],
		"answer": 0
	}
]

function startTest() {
	unloadScreen("title");
	loadScreen("question");

	mainSong = new Audio('assets/chineseRap.ogg');
	mainSong.loop = true;
	mainSong.play();

	loadRandomScenery();
	runQuestion();
}

function runQuestion() {
	if (questionIndex < questions.length) {
		var question = questions[questionIndex];
		var questionEl = document.getElementById("questionText");
		questionEl.innerText = (questionIndex + 1) + ". " + question.question;
		for (let answer = 0; answer < 4; answer++) {
			if (question.options[answer]) {
				loadButton("answer" + answer);
				document.getElementById("answer" + answer).innerText = question.options[answer];
			} else {
				unloadScreen("answer" + answer);
			}
			
		}
	}
}

function loadButton(name) {
	document.getElementById(name).style.display = "default";
}
function loadScreen(name) {
	document.getElementById(name).style.display = "inherit";
}
function unloadScreen(name) {
	document.getElementById(name).style.display = "none";
}
function disableButtons() {
	for (var i = 0; i < 4; i++) {
		document.getElementById("answer" + i).disabled = true;
	}
}
function enableButtons() {
	for (var i = 0; i < 4; i++) {
		document.getElementById("answer" + i).disabled = false;
	}
}
function loadRandomImage(lol) {
	document.getElementById(lol).src = "assets/rndImg" + (Math.floor(Math.random()*6)+1) + ".jpg";
}
function loadRandomScenery() {
	document.getElementById("question").style.backgroundImage = "url('assets/rndSce" + (Math.floor(Math.random()*6)+1) + ".jpg')";
}
function ordinal(n) { // definitely not copied from stackoverflow, nope
    var s = ["th", "st", "nd", "rd"];
    var v = n%100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
}

function submit(num) {
	var question = questions[questionIndex];
	if (num == question.answer) {
		var imageNode = document.createElement("img");
		imageNode.className = "buddy";
		imageNode.src = "assets/checkMark.png";
		document.getElementById("answer" + num).after(imageNode);

		disableButtons();
		var audio = new Audio('assets/correctSound.ogg');
		audio.play();

		questionIndex += 1;

		setTimeout(function() {
			unloadScreen("question");
			document.getElementsByClassName("buddy")[0].remove()
			enableButtons();
			loadRandomImage("midQuestion");
			loadScreen("congrats");
			var audio = new Audio('assets/crowdCheer.mp3');
			audio.play()
			setTimeout(function() {
				unloadScreen("congrats")
				if (questionIndex >= questions.length) {
					endQuiz(true);
				} else {
					audio.pause();
					runQuestion();
					loadRandomScenery();
					loadScreen("question");
				}
			}, 3000);
		}, 3000);
	} else {
		var imageNode = document.createElement("img");
		imageNode.className = "buddy";
		imageNode.src = "assets/crossMark.png";
		document.getElementById("answer" + num).after(imageNode);

		disableButtons();
		mainSong.pause();
		var audio = new Audio('assets/wrongBuzzer.ogg');
		audio.play();

		setTimeout(function() {
			unloadScreen("question");
			document.getElementsByClassName("buddy")[0].remove()
			enableButtons();
			loadRandomImage("midQuestion2");
			loadScreen("oops");
			var audio = new Audio('assets/gameOver.ogg');
			audio.play()
			setTimeout(function() {
				unloadScreen("oops")
				endQuiz(false);
			}, 2000);
		}, 3000);
	}
}

function endQuiz(result) {
	if (result === true) {
		mainSong.pause();
		loadRandomImage("goodEnd");
		loadScreen("goodEnding");
	} else {
		loadRandomImage("badEnd");
		var executionDate = document.getElementById("executionDate");
		var currentDate = new Date();
		currentDate.setTime(currentDate.getTime() + 30*24*60*60*1000); // + 30 days from now
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		var dateString = ordinal(currentDate.getDate()) + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear() + ", 5:00PM"
		executionDate.innerText = dateString.toUpperCase();

		loadScreen("badEnding");
		var audio = new Audio('assets/crowdBoo.ogg');
		audio.play()
	}
}

