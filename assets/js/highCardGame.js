// joke modal elements
const saveJokeButtonEl = $('#save-joke')
const jokeModal = $( '#jokeModal' );
const jokeDisplayEl = $( '#jokeDisplay' );

// general elements
const deckEl = $( '#deck' );
const winLoseTie = $( '#win-lose-tie' );

// player card elements
const playerNameEl = $( '#player-name' );
const playerScoreEl = $( '#player-score' );
const playerCard = $( '#player-card' );
const playerDrawnImage = $( '#player-drawn-image' );
const playerDiscardPile = $( '#player-discard-pile' );
const playerDiscardedImage = $( '#player-discarded-image' );

// computer card elements
const computerScoreEl = $( '#computer-score' );
const computerCard = $( '#computer-card' );
const computerDrawnImage = $( '#computer-drawn-image' );
const computerDiscardPile = $( '#computer-discard-pile' );
const computerDiscardImage = $( '#computer-discarded-image' );

// game over elements
const playAgainButtonEl = $( '#play-again' );
const homeButtonEl = $( '#home' );

// general game variables
let canClickDeck = true;
let cardsRemaining;

// player data
let playerCardImageURL;
let playerCardValue;
let playerScore = 0;

// computer data
let computerCardImageURL;
let computerCardValue;
let computerScore = 0;

// add player name to the game screen
playerNameEl.prepend( userName );

// return card value
const getCardValue = value => {


  if ( isNaN( value ) ) {

    switch ( value ) {

      case 'KING': return 13;
      break;
      case 'QUEEN': return 12;
      break;
      case 'JACK': return 11;
      break;
      case 'ACE': return 1;

    }
  
  }

  return parseInt( value );

}

// determine the winner of the round
const determineWinner = async () => {

  // if player wins
  if ( playerCardValue > computerCardValue ) {
          
    // update winLoseTie element and add card value player to score
    winLoseTie.text( 'You Won this Round!' );
    playerScore += playerCardValue;

    // clear previous joke and open modal
    jokeDisplayEl.text( '' );
    jokeModal.modal( 'open' );

    // get a new joke
    const data = await getJoke()
      
        // save joke as object with type 1 and unique id
      if (data.type = 'single' && data.joke) {

        jokeDisplayEl.html( data.joke );
        currentJoke = { type: 1, id: data.id, joke: data.joke };

        // save joke as object with type 2 and unique id
      } else {

        jokeDisplayEl.html( `<p>${data.setup}</p><p>${data.delivery}</p>` );
        currentJoke = { type: 2, id: data.id, setup: data.setup, delivery: data.delivery };
      }
  }

  // if player loses
  if ( playerCardValue < computerCardValue ) {
      
    // update winLoseTie element and add card value to computer score
    winLoseTie.text( 'The Computer Won this Round!' );
    computerScore += computerCardValue;
  }

  // if the round is a tie update winLoseTie element
  if ( playerCardValue === computerCardValue ) winLoseTie.text( 'This Round is a Tie!' );

  // update player and computer score elements
  computerScoreEl.text( computerScore );
  playerScoreEl.text( playerScore );

}

// game over function
const gameOver = () => {

  // display Game Over in the WinLoseTie element
  winLoseTie.text( 'Game Over!' );

  // display game over element
  $( '.game-over' ).removeClass( 'hidden' );

  // if player wins final score
  if ( playerScore > computerScore ) {
    
    // save high score
    saveHighScore();

    // add notifications to the winLoseTie element
    winLoseTie.append( '<br>You Won the Game! - High Score Saved.' );

  }

}

// when the deck is clicked
deckEl.on( 'click', async () => {

  // check if deck click has been disabled
  if( !canClickDeck ) return;
  
  // hide winLoseTie element
  winLoseTie.addClass( 'invisible' );

  // draw a card
  const data = await drawCard( 1 )

    // disable deck clicking during card animations so that it can't be spam clicked
    canClickDeck = false;

    // calculate player discard position
    const playerCoordinates = getDiscardDifference( playerDiscardPile.position(), deckEl.position() );

    // set css variables for player flip direction and card translation
    documentRootEl.css( '--player-flip-direction', flipDirection( playerCoordinates.left ) );
    documentRootEl.css( '--card-translationX', `${ playerCoordinates.left }px` );
    documentRootEl.css( '--card-translationY', `${ playerCoordinates.top }px` );

    // set player card image and value
    playerCardImageURL = data.cards[0].image;
    playerCardValue = getCardValue( data.cards[0].value );
    
    // set the player card image and start flip animation
    playerDrawnImage.attr( 'src', playerCardImageURL );
    playerCard.addClass( 'player-flip' );

} );

// when player card animation ends
playerCard.on( 'animationend', async () => {

  // set player discarded image, reveal it and remove flip animation
  playerDiscardedImage.attr( 'src', playerCardImageURL );
  playerDiscardedImage.removeClass( 'hidden' );
  playerCard.removeClass( 'player-flip' );

  // move computer card element to the top z-index
  computerCard.removeClass( 'push-back' );

  // draw a card
  const data = await drawCard( 1 )
    // calculate computer discard position
    const computerCoordinates = getDiscardDifference( computerDiscardPile.position(), deckEl.position() );

    // set css variables for computer flip direction and card translation
    documentRootEl.css( '--computer-flip-direction', flipDirection( computerCoordinates.left ) );
    documentRootEl.css( '--card-translationX', `${ computerCoordinates.left }px` );
    documentRootEl.css( '--card-translationY', `${ computerCoordinates.top }px` );
    
    // set computer card image and value
    computerCardImageURL = data.cards[0].image;
    computerCardValue = getCardValue( data.cards[0].value );

    // set the computer card image and start flip animation
    computerDrawnImage.attr( 'src', computerCardImageURL );
    computerCard.addClass( 'computer-flip' );

    // set cards remaining in deck
    cardsRemaining = data.remaining;
} );

// when computer card animation ends
computerCard.on( 'animationend', () => {

  // set computer discarded image, reveal it and remove flip animation
  computerDiscardImage.attr( 'src', computerCardImageURL );
  computerDiscardImage.removeClass( 'hidden' );

  // move computer card element to the bottom of the z-index and remove flip animation
  computerCard.addClass( 'push-back' );
  computerCard.removeClass( 'computer-flip' );

  // determine winner and reveal winLoseTie element
  determineWinner();
  winLoseTie.removeClass( 'invisible' );

  // if less than 2 cards remain in deck end the game
  if ( cardsRemaining < 2 ) gameOver();

  // else re-enable deck clicking
  else canClickDeck = true;

} );

// when save joke button is clicked 
saveJokeButtonEl.on( 'click', () => {

  // save joke
  saveJoke();
  
} );

// if home button is clicked send to homepage
homeButtonEl.on( 'click', () => location.href = 'index.html' );

// if play again button is clicked reload page
playAgainButtonEl.on( 'click', () => location.reload() );