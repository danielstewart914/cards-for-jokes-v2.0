// highs scores loaded from local storage

let highScores = JSON.parse(localStorage.getItem( 'scoreBoard' ) );

// high scores display element <tbody> on html page
const highScoresEl = $( '#highScores' );

// render high scores to screen
const renderScores = ( scores ) => {

  // document fragment for rendered high scores
  const highScoreFrag = $( document.createDocumentFragment() );

  // append high score table rows for each high score
  scores.forEach( highScore  => highScoreFrag.append( `<tr><td>${ highScore.name }</td><td>${ highScore.score }</td></tr>` ) );
  
  // return fragment
  return highScoreFrag;
}

  // clear scores when clear scores button is clicked
$( '#clear-scores' ).on( 'click', () => {

  // clear high scores
  highScores = [];
  
  // rerender high scores
  highScoresEl.html( renderScores( highScores ) );
  
  // clear local storage
  localStorage.removeItem( 'scoreBoard' );

} );

// render highs cores on page load
highScoresEl.html( renderScores( highScores ) );