const jokeContainerEl = $('#joke-container');

/*
Render jokes from local storage in a grid layout
*/
const renderJokes = () => {

    // Create a row in the grid layout to display jokes
    const jokesFrag = $( document.createDocumentFragment() );
    const rowEl = $('<div>');
    rowEl.attr('class','row');
    jokesFrag.append(rowEl);

    for (let iter = 0; iter < myJokes.length; iter++) {

        // Create a column in a grid for each joke
        const columnEl = $('<div>');
        columnEl.attr('class','col s12 m6 l4');
        rowEl.append(columnEl);

        // Card element from materialize
        const cardEl = $('<div>');
        cardEl.attr('class', 'card');
        columnEl.append(cardEl);

        const cardImageEl = $('<div>');
        cardImageEl.attr('class' , 'card-image');
        cardEl.append(cardImageEl);

        // Add image to the card which when clicked opens the joke
        const imageEl = $('<img>');
        imageEl.attr ('class', 'activator');
        imageEl.attr ('src' , './assets/images/binary.jpeg');
        cardImageEl.append(imageEl);

        // Add content to the card
        const cardContentEl = $('<div>');
        cardContentEl.attr('class' , 'card-content');
        cardEl.append(cardContentEl);

        const spanEl = $('<span>');
        spanEl.attr('class' , 'card-title grey-text text-darken-4');
        cardContentEl.append(spanEl)

        const iconEl = $('<i>');
        iconEl.attr('class' , 'material-icons right');
        iconEl.text('more_vert');
        spanEl.append(iconEl);

        // To reveal the contents of the joke
        const cardRevealEl = $('<div>');
        cardRevealEl.attr('class' , 'card-reveal');
        cardEl.append(cardRevealEl);

        const spanRevealEl = $('<span>');
        spanRevealEl.attr('class' , 'card-title grey-text text-darken-4');
        cardRevealEl.append(spanRevealEl)

        const iconRevealEl = $('<i>');
        iconRevealEl.attr('class' , 'material-icons right');
        iconRevealEl.text('close');
        spanRevealEl.append(iconRevealEl);

        const jokeContentEl = $('<p>');
        if ( myJokes[iter].type === 1 ) jokeContentEl.text(myJokes[iter].joke);
        if ( myJokes[iter].type === 2 ) jokeContentEl.html( `<p>${ myJokes[iter].setup }</p><p>${ myJokes[iter].delivery }</p>` );
        
        // delete joke elements
        const deleteEl = $( '<div>' ).addClass( 'delete-joke' ).data( 'index', iter );
        const deleteIconEl = $( '<i>' ).addClass( 'material-icons right' ).text( 'cancel' ).data( 'index', iter );
        
        deleteEl.append( 'Delete ', deleteIconEl );
        jokeContentEl.append( deleteEl );

        cardRevealEl.append(jokeContentEl);
    }

    return jokesFrag;

}

jokeContainerEl.on( 'click', '.delete-joke', ( event ) => {

    // get target
    const target = $( event.target );

    // splice out index of clicked joke
    myJokes.splice( target.data( 'index' ), 1 );

    // save to local storage
    localStorage.setItem( 'jokes', JSON.stringify( myJokes ) );

    // rerender jokes
    jokeContainerEl.html( renderJokes() );

} );

 jokeContainerEl.html( renderJokes() );