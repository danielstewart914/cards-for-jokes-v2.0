const hilariousEl = $('#hilarious')
const jokeModal = $( '#jokeModal' );
const jokeDisplayEl = $( '#jokeDisplay' );

const deckEl = $( '#deck' );
const playerCard = $( '#player-card' );
const playerDrawnImage = $( '#player-drawn-image' );
const computerDrawnImage = $( '#computer-drawn-image' );
const computerCard = $( '#computer-card' );
const computerDiscardPile = $( '#computer-discard-pile' );
const computerDiscardImage = $( '#computer-discarded-image' );
const playerDiscardPile = $( '#player-discard-pile' );
const playerDiscardedImage = $( '#player-discarded-image' );
const winLoseTie = $( '#win-lose-tie' );
const playerScoreEl = $( '#player-score' );
const computerScoreEl = $( '#computer-score' );
const homeButtonEl = $( '#home' );
const playAgainButtonEl = $( '#play-again' );
const playerNameEl = $( '#player-name' );

let canClickDeck = true;

let playerCardImageURL;
let computerCardImageURL;

let playerCardValue;
let computerCardValue;

let playerScore = 0;
let computerScore = 0;

let cardsRemaining;

playerNameEl.prepend( userName );

const saveHighScore = () => {

  const highScores = JSON.parse( localStorage.getItem( 'scoreBoard' ) ) || [];

  const currentScore = {
    name: userName,
    score: playerScore
  }

  highScores.push( currentScore );

  highScores.sort( ( a, b ) => b.score - a.score );

  if ( highScores.length > 10 ) highScores.pop(); 

  localStorage.setItem( 'scoreBoard', JSON.stringify( highScores ) );

}

const getCardValue = value => {

  let returnValue;
  switch ( value ) {

      case 'KING': returnValue = 13;
      break;
      case 'QUEEN': returnValue = 12;
      break;
      case 'JACK': returnValue = 11;
      break;
      case 'ACE': returnValue = 1;
      break;
      default: returnValue = parseInt( value );
  }

  return returnValue;

}

const flipDirection = ( x ) => {

  if ( x < 0 ) return 'cardFlipLeft';
  return 'cardFlipRight';

}

const getDiscardDifference = (deckPosition, discardPosition) => ( { left: deckPosition.left - discardPosition.left, top: deckPosition.top - discardPosition.top } );

const determineWinner = () => {

  if ( playerCardValue > computerCardValue ) {
          
    winLoseTie.text( 'You Win!' );
    playerScore += playerCardValue;

    jokeDisplayEl.text( '' );

    jokeModal.modal( 'open' );

    getJoke()
    .then( (data) => {

      if (data.type = 'single' && data.joke) {

        jokeDisplayEl.html( data.joke );

        // save joke as object with type 1 and unique id
        currentJoke = { type: 1, id: data.id, joke: data.joke };

      } else {

        jokeDisplayEl.html( `<p>${data.setup}</p><p>${data.delivery}</p>` );

        // save joke as object with type 2 and unique id
        currentJoke = { type: 2, id: data.id, setup: data.setup, delivery: data.delivery };
      }
    } );
  }

  if ( playerCardValue < computerCardValue ) {
      
      winLoseTie.text( 'Computer Wins!' );
      computerScore += computerCardValue;
  }

  if ( playerCardValue === computerCardValue ) winLoseTie.text( 'It\'s a Tie!' );

  winLoseTie.removeClass( 'invisible' );
  computerScoreEl.text( computerScore );
  playerScoreEl.text( playerScore );

}

const gameOver = () => {

  winLoseTie.text( 'Game Over!' );
  $( '.game-over' ).removeClass( 'hidden' );

  if ( playerScore > computerScore ) {
    
    console.log( 'hi' )
    
    saveHighScore();
    winLoseTie.append( '<br>You Won the Game! - High Score Saved.' );

  }

}

deckEl.on( 'click', () => {

  if( !canClickDeck ) return;
  
  winLoseTie.addClass( 'invisible' );

  drawCard( 1 )
  .then ( ( data ) => {

      const playerCoordinates = getDiscardDifference( playerDiscardPile.position(), deckEl.position() );


      documentRootEl.css( '--player-flip-direction', flipDirection( playerCoordinates.left ) );
      documentRootEl.css( '--card-translationX', `${ playerCoordinates.left }px` );
      documentRootEl.css( '--card-translationY', `${ playerCoordinates.top }px` );
      
      canClickDeck = false;

      playerCardImageURL = data.cards[0].image;
      playerCardValue = getCardValue( data.cards[0].value );
      
      playerDrawnImage.attr( 'src', playerCardImageURL );

      playerCard.addClass( 'player-flip' );

  } );

} );

playerCard.on( 'animationend', () => {

  playerDiscardedImage.attr( 'src', playerCardImageURL );
  playerDiscardedImage.removeClass( 'hidden' );

  playerCard.removeClass( 'player-flip' );
  computerCard.removeClass( 'push-back' );

  drawCard( 1 )
  .then ( ( data ) => {

      const computerCoordinates = getDiscardDifference( computerDiscardPile.position(), deckEl.position() );

      documentRootEl.css( '--computer-flip-direction', flipDirection( computerCoordinates.left ) );
      documentRootEl.css( '--card-translationX', `${ computerCoordinates.left }px` );
      documentRootEl.css( '--card-translationY', `${ computerCoordinates.top }px` );
      

      computerCardImageURL = data.cards[0].image;
      computerCardValue = getCardValue( data.cards[0].value );

      computerDrawnImage.attr( 'src', computerCardImageURL );

      cardsRemaining = data.remaining;

      computerCard.addClass( 'computer-flip' );

  } );
} );

computerCard.on( 'animationend', () => {

  computerDiscardImage.attr( 'src', computerCardImageURL );
  computerDiscardImage.removeClass( 'hidden' );
  computerCard.addClass( 'push-back' );
  computerCard.removeClass( 'computer-flip' );

  determineWinner();

  if ( cardsRemaining < 2 ) gameOver();
  else canClickDeck = true;

} );

hilariousEl.on( 'click', () => {

  saveJoke();
  
} );

homeButtonEl.on( 'click', () => location.href = 'index.html' );

playAgainButtonEl.on( 'click', () => location.reload() );