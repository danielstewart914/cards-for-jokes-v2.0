var centerThemeCard = $('#center-theme');
var userCardEl = $('#user-card');
var computerCardEl = $('#computer-card');
var hilariousEl = $('#hilarious')
var jokeModal = $( '#jokeModal' );
var jokeBoxEl = $( '#jokeBox' );
var loseTieEl = $( '#lose-tie' );
var score = 0;

const saveHighScore = () => {

  const highScores = JSON.parse( localStorage.getItem( 'scoreBoard' ) ) || [];

  const currentScore = {
    name: userName,
    score: score
  }

  highScores.push( currentScore );

  highScores.sort( ( a, b ) => b.score - a.score );

  if ( highScores.length > 10 ) highScores.pop(); 

  localStorage.setItem( 'scoreBoard', JSON.stringify( highScores ) );

}

/* Determine the winner based on the card value of user and computer */

function determineWinner(user_val, comp_val, remaining) {

  // Value assigned for non number value cards
  var cards_value = {
    'KING' : 13,
    'QUEEN' : 12,
    'JACK' : 11,
    'ACE' : 0
  };
  
  if (cards_value[user_val] !== undefined){
    user_val = cards_value[user_val];
  }
  
  if (cards_value[comp_val] !== undefined){
    comp_val = cards_value[comp_val];
  }
  
  user_val = parseInt(user_val);
  comp_val = parseInt(comp_val);
  
  // Compare the card values
  if(user_val == comp_val){
    loseTieEl.html( 'It\'s a tie!<br>Click the deck to draw another card' );
    endGame(remaining);
  } else if(user_val > comp_val ) {
    loseTieEl.text( 'Click the deck to draw a card' );
    // Opens the joke modal
    jokeBoxEl.html('');
    jokeModal.modal( 'open' );
    score +=user_val;
    getJoke().then( function(data) {
      if (data.type = 'single' && data.joke) {

        jokeBoxEl.html( data.joke );

        // save joke as object with type 1 and unique id
        currentJoke = { type: 1, id: data.id, joke: data.joke };

      } else {

        jokeBoxEl.html( `<p>${data.setup}</p><p>${data.delivery}</p>` );

        // save joke as object with type 2 and unique id
        currentJoke = { type: 2, id: data.id, setup: data.setup, delivery: data.delivery };
      }
      // To prevent previous initializations of the same button
      hilariousEl.off("click").on('click', function(event) {
        event.preventDefault();
        saveJoke();
      });
    }).then(function() {
      endGame(remaining);
    });
  } else {
    loseTieEl.html( 'Computer Wins!<br>Click your deck to try again' );
    endGame(remaining);
  }
}

// When the center deck is clicked, two cards are drawn and winner is determined
centerThemeCard.on('click', function(event) {
  event.preventDefault();
  drawCard(2).then(function(data) {
    userCardEl.css('background-image', 'url('+ data.cards[0].image+')');
    computerCardEl.css('background-image', 'url('+ data.cards[1].image+')');
  
    // Determine who is the winner
    determineWinner(data.cards[0].value,data.cards[1].value, data.remaining);
  });
});

function endGame(remaining) {

  if (remaining == 0){
    saveHighScore();

    $( '.game-play' ).addClass( 'hidden' );
    loseTieEl.addClass( 'hidden' );

    // To display game over
    var gameEndDiv = $('#game-end');
    gameEndDiv.attr('class', 'game-over')
    var newDiv = $('<div>');
    var newPara = $('<p>');
    newPara.attr('class', 'label center-align')
    newPara.text('Game Over');
    newDiv.append(newPara);

    // To display the score
    var scorePara = $('<p>');
    scorePara.attr('class', 'label center-align')
    scorePara.text('Your score is: ' +score);
    newDiv.append(scorePara);

    // To view the high scores page
    var gameEndMessage = $('<p>').text("Visit the High Scores page to view your score!");
    gameEndMessage.attr("class", "label center-align")
    newDiv.append(gameEndMessage);

    // To play the game again
    var restartButton = $('<button>');
    restartButton.attr('class', 'restart-btn waves-effect waves-light btn brown darken-4 white-text');
    restartButton.text('Restart Game');
    restartButton.on('click', function(event) {
      event.preventDefault();
      location.reload();
    });
    newDiv.append(restartButton);

    gameEndDiv.append(newDiv);

  }
}


