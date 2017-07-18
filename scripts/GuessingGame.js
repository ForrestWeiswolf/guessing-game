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
	if(typeof this.playersGuess != 'number' || this.playersGuess < 1 || this.playersGuess > 100){
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

    function enterGuess() {
		var guess = $('#guess_input').val();
    	var checkResult = game.playersGuessSubmission(parseInt(guess, 10));
   		$('#guess_input').val('');
   		if (checkResult === 'You have already guessed that number.'){
	   		$('#subtitle').text(checkResult);
	   	}
	}
})