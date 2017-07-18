function generateWinningNumber() {
	return Math.round(Math.random()*100 + 0.5);
}

function shuffle(arr) {
	var length = arr.length;
	var r;
	var t;

	for (var i = 0; i < length; i++) {
		r = Math.floor(Math.random() * (length - i)) + i - 1;
		t = arr[i];
		arr[i] = arr[r];
		arr[r] = t;
	}

	return arr;
}

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

function newGame() {
	return new Game;
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
	return (this.playersGuess < this.winningNumber);
};

Game.prototype.playersGuessSubmission = function(guess) {
	var result;
	this.playersGuess = guess;
	if(this.checkGuess() == "You have already guessed that number.") {
		result = "You have already guessed that number.";
	} else {
		//must check before guess is added to pastGuesses to avoid 
		//false positives on "You have already guessed that number"
		result = this.checkGuess(); 
		this.pastGuesses.push(this.playersGuess);
	}
	return result;
};

Game.prototype.checkGuess = function() {
	if(isNaN(this.playersGuess) || this.playersGuess < 1 || this.playersGuess > 100){
		throw "That is an invalid guess.";
	} else if (this.pastGuesses.indexOf(this.playersGuess) != -1){
		return "You have already guessed that number."
	} else if (this.playersGuess === this.winningNumber){
		return "You Win!"
	} else if (this.pastGuesses.length >= 4){ //current guess is the fifth and hasn't yet been added to pastGuesses
		return "You Lose."
	} else if (this.difference() < 10){
		return "You\'re burning up!"
	} else if (this.difference() < 25){
		return "You\'re lukewarm."
	} else if (this.difference() < 50){
		return "You\'re a bit chilly."
	} else{
		return "You\'re ice cold!"
	}
}

Game.prototype.provideHint = function() {
	return shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
}

$(document).ready(function() {
	game = new Game();
	$('#submit_guess').click(function(event) {
		event.preventDefault();
		enterGuess();
	})
	$('#submit_guess').keypress(function(event) {
		if(event.keyCode == 13){
			event.preventDefault();
			enterGuess();
		}
	})

	$('#reset').click(function(event) {
		game = new Game;
		$('#guesses ul li').each(function(index){
			$(this).text("_");
		});
		$('#title').text('Play the Guessing Game!');
		$('#subtitle').text("Guess a number between 1 and 100.");
		$('#submit_guess').prop('disabled', false);
		$('#hint').prop('disabled', false);
	})

	$('#hint').click(function(event) {
		var hintStr = game.provideHint().join(", ");
		$('#subtitle').text(`Hint: It's one one of these numbers: ${hintStr}`);
	})

	function enterGuess() {
		var guess = $('#guess_input').val();
		var checkResult = game.playersGuessSubmission(parseInt(guess, 10));
		$('#guess_input').val('');

		if (checkResult === 'You have already guessed that number.'){
			$('#subtitle').text(checkResult);
		} else if(checkResult === "You Win!" || checkResult === "You Lose."){
			$('#title').text(checkResult);
			$('#subtitle').text("Click 'Reset' (or reload page) to play again.");
			$('#submit_guess').prop('disabled', true);
			$('#hint').prop('disabled', true);
		} else {
			var direction = game.isLower ? "Too low: " : "Too high: ";
			$('#subtitle').text(direction + checkResult);
		}

		$('#guesses ul li').each(function(index){
			$(this).text(game.pastGuesses[index]);
		});
	}
})