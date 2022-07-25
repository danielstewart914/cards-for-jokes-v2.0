// elements used on all pages
const documentRootEl = $( ':root' );
const deckOfCardApiRootUrl = 'https://deckofcardsapi.com/api/deck';
const bottomCardRowEl = $( '#bottomCardRow' );
let deckId = JSON.parse( localStorage.getItem( 'deck_id' ) ) || {};

// user settings
let userName = localStorage.getItem( 'user_name' );
let themeIndex =  localStorage.getItem( 'deck_theme' );

// deck theme image urls
const themes = [ 
  'https://deckofcardsapi.com/static/img/back.png', 
  './assets/images/batman-deck-theme.jpg', 
  './assets/images/awkward-turtle-deck-theme.jpg', 
  './assets/images/mountain-deck-theme.jpg',
  './assets/images/humming-bird-deck-theme.jpg', 
  './assets/images/mountain-deck-theme-2.jpg',
  './assets/images/jokercard.jpeg'
];

// index.html elements
const highCardGameEl = $( '#highCardGame' );
const userModal = $( '#user-modal' );
const playGameElButton = $( '#play-game' );
const welcomeDisplayEl = $( '#welcome-display' );
const saveUserSettingsButtonEl = $( '#save-user-settings' );
const changeUSerSettingsButtonEl = $( '#change-user-settings' );
const userNameDisplayEl = $( '#user-name' );
const usernameEntryEl = $( '#username-entry' );
const nameEntryErrorEl = $( '#name-entry-error' );
const themeDisplayEl = $( '#theme-display' );

//  joke variables
const jokeAPIUrl ='https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&amount=1';
const myJokes = JSON.parse( localStorage.getItem( 'jokes' ) ) || [];
let currentJoke;

// save jokes to local storage
const saveJoke = () => {

  // if joke is already saved return out of function
  const jokeIndex = myJokes.findIndex( jokes => jokes.id === currentJoke.id );
  if ( jokeIndex >= 0 ) return;

  // push current joke to joke array and save to local storage
  myJokes.push( currentJoke );
  localStorage.setItem( 'jokes', JSON.stringify( myJokes ) );

}

// save high score
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

// returns true if time stamp is older than two weeks
const isTimeStampOlderThanTwoWeeks = ( timeStamp, now ) => {
  
  // get the difference between timestamp and now
  const difference = now.diff( luxon.DateTime.fromISO( timeStamp ) );

  // if the timestamp is older than two weeks return true
  if( difference.as( 'weeks' ) > 2 ) return true;

  return false;

}

// initialize data
const initialize = () => {

  // if there is a user name show welcome element
  if ( userName ) {

    welcomeDisplayEl.removeClass( 'invisible' );
    userNameDisplayEl.text( userName );

  }

  if ( themeIndex !== null ) {

    // if there is a theme selected add highlight to selected theme card
    userModal.children().children().children( 'img' ).eq( themeIndex ).addClass( 'selected-theme' );
    changeTheme();

  }

  // if deckId is old format or older than two weeks get new deck_id
  if ( !deckId.id || isTimeStampOlderThanTwoWeeks( deckId.timeStamp , luxon.DateTime.now() ) ) {

    getNewDeck( 1 )
    .then ( ( data ) => {

      const newId = data.deck_id;
      const timeStamp = luxon.DateTime.now();

      deckId = {
        id: newId,
        timeStamp: timeStamp

      }

      localStorage.setItem( 'deck_id', JSON.stringify( deckId ) );

      renderBottomRow();

      } );

      } else {

      renderBottomRow();

      }

}

// change card theme
const changeTheme = () => {

  // change theme display
  themeDisplayEl.attr( 'src',  themes[ themeIndex ] );

  // change all card back images to selected theme
  $( '.playing-card-back > img' ).attr( 'src', themes[ themeIndex ] );

  if ( themeIndex > 0 ) {
    documentRootEl.css( '--cardThemeUrl', `url( '../.${ themes[ themeIndex ] }' )` );
    documentRootEl.css( '--theme-border', '1px solid black' )
  }

  else documentRootEl.css( '--cardThemeUrl', `url( '${ themes[ themeIndex ] }' )` );

}

// change user name function
const saveUserName = () => {

  // if there is a username store it in username
  if ( usernameEntryEl.val() ) userName = usernameEntryEl.val();

  // if no theme selected change to default theme and store in local storage
  if ( themeIndex === null ) {
    
    themeIndex = 6;
    localStorage.setItem( 'deck_theme', themeIndex );

  }

  // save username in local storage
  localStorage.setItem( 'user_name', userName );

}

// Get Joke from Joke API
const getJoke = async () => {

  const response = await fetch(jokeAPIUrl);

  if (response.ok) return response.json();
  else console.error( 'Error: ' + response.statusText ); 

}


// get new deck
const getNewDeck = async ( deckCount ) => {

  const response = await fetch(`${ deckOfCardApiRootUrl }/new/shuffle/?deck_count=${ deckCount }`);

  if (response.ok) return response.json();
  else console.error( 'Error: ' + response.statusText ); 

}

// shuffle deck
const shuffleDeck = async ( id, onlyRemaining ) => {

  const response = await fetch( `${ deckOfCardApiRootUrl }/${ id }/shuffle/?remaining=${ onlyRemaining }` );

  if ( response.ok ) return response.json();
  else console.error( 'Error: ' + response.statusText );
    
}

// draw card(s) 
const drawCard = async ( numberOfCards ) => {

  const response = await fetch( `${ deckOfCardApiRootUrl }/${ deckId.id }/draw/?count=${ numberOfCards }` );

  if ( response.ok ) return response.json();
  else console.error( 'Error: ' + response.statusText );

}

// render bottom row of cards on main screen
const renderBottomRow = () => {

  // first shuffle deck
  shuffleDeck( deckId.id, false )
  .then ( () => {

  // draw all cards
  drawCard( 52 )
  .then ( ( data ) => {

    const rowFrag = $( document.createDocumentFragment() );

    // render cards to fragment
    data.cards.forEach( card => {

      const cardImageEl = $( '<img>' ).attr( 'src', card.image );
      rowFrag.append( cardImageEl );

    } );

    // set contents of with bottom row element with fragment
    bottomCardRowEl.html( rowFrag );

  } )
  .then( () => { shuffleDeck( deckId.id, false ) } );

} );

}

// returns flip direction animation based on x coordinate of discard pile
const flipDirection = ( x ) => {

  if ( x < 0 ) return 'cardFlipLeft';
  return 'cardFlipRight';

}

// returns translation difference between deck and discard pile
const getDiscardDifference = (deckPosition, discardPosition) => ( { left: deckPosition.left - discardPosition.left, top: deckPosition.top - discardPosition.top } );

// global function calls

// initialize modals on all pages where main.js is loaded
$( document ).ready( () => $( '.modal' ).modal() );

// initialize sidenav
$( document ).ready( () => $( '.sidenav' ).sidenav() );

initialize();

highCardGameEl.on( 'click', ( event ) => {

  event.preventDefault();

  if ( userName ) location.href = 'highCardGame.html';

  else {
    
    playGameElButton.removeClass( 'hidden' );
    saveUserSettingsButtonEl.addClass( 'hidden' );
    userModal.modal( 'open' );

  }

} );

// when you click on an image element in the modal ( themes )
userModal.on( 'click', 'img', ( event ) => {

  // theme that was clicked 
  const themeSelection = $( event.target );

  // everything else
  const otherThemes = userModal.children().children().children( 'img' ).not( themeSelection );

  // add highlight class and remove from others
  themeSelection.addClass( 'selected-theme' );
  otherThemes.removeClass( 'selected-theme' );

  // set theme index to value store in img element
  themeIndex = parseInt( themeSelection.data( 'theme' ) );
  localStorage.setItem( 'deck_theme', themeIndex );

  themeDisplayEl.attr( 'src',  themes[ themeIndex ] );
  changeTheme();

} );

// when play game button is clicked
playGameElButton.on( 'click', () => {

    // if no user name entered
    if ( !usernameEntryEl.val() ) {

      nameEntryErrorEl.text( 'Please enter a name!' );
      
      return;
    
    }

  saveUserName();

  location.href = 'gamepage.html';

} );

// open modal with save button
changeUSerSettingsButtonEl.on( 'click', () => {

  playGameElButton.addClass( 'hidden' );
  saveUserSettingsButtonEl.removeClass( 'hidden' );
  userModal.modal( 'open' );

} );

//  save user settings
saveUserSettingsButtonEl.on( 'click', () => {

  saveUserName();

  userNameDisplayEl.text( userName );

  userModal.modal( 'close' );

} );
