let blackjackId = JSON.parse( localStorage.getItem( 'blackjack_id' ) ) || {};

const blackjackInitialize = () => {

    // if there is no blackjackId or older than two weeks get new deck_id
  if ( !blackjackId.id || isTimeStampOlderThanTwoWeeks( deckId.timeStamp , luxon.DateTime.now() ) ) {

    getNewDeck( 6 )
    .then ( ( data ) => {

      const newId = data.deck_id;
      const timeStamp = luxon.DateTime.now();

      blackjackId = {
        id: newId,
        timeStamp: timeStamp

      }

      localStorage.setItem( 'blackjack_id', JSON.stringify( deckId ) );

      } );
  }

}

