const highScores = JSON.parse(localStorage.getItem( 'scoreBoard' ) );

const renderScores = () => {
  highScores.forEach( ( { name, score } ) => {

  $( '#highScores' ).append( 
    `<tr>
      <td>${name}</td>
      <td>${score}</td>
    </tr>` );

  } );
}

// clear scores when clear scores button is clicked
$( '#clear-scores' ).on( 'click', () => {

  localStorage.removeItem( 'scoreBoard' );

  location.reload();

} );

renderScores();