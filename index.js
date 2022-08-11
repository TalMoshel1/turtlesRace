import { data } from './data.js';

function getTurtle(turtle, config) {
  const img = document.createElement('img');
  img.src = turtle.icon;
  img.width = config.iconWidth;
  img.style.position = 'relative';
  return img;
}

function createTracks(data, state, config) { //startGame קורא לזה
  const tracks = data.map((turtle, i) => {
    const track = document.createElement('div');
    track.style.position = 'relative'
    track.style.backgroundColor = turtle.color;
    track.classList.add(`a${i}`)
    track.append(getTurtle(turtle, config));
    return track;
  });
  document.querySelector('#tracks').append(...tracks);
}

function updateTracks(data) { // drawFrame קורא לזה
  const tracks = Array.from(document.querySelectorAll('#tracks > div'));
  tracks.forEach((track, i) => {
    const turtle = data[i];
    console.log(turtle.position)
    track.querySelector('img').style.left = `${turtle.position}px`;
  });
}

function getLeadTurtle(data) { // drawFrame קורא לזה
  return data.reduce((lead, curr) => {
    if (curr.position > lead.position) {
      return curr;
    }
    return lead;
  }, data[0]);
}

function drawFrame(data, state, config) { // startGame קורא לזה
  const limit = config.limit - config.iconWidth;
  const leadTurtle = getLeadTurtle(data);
  // if my position and the next step is finishing
  if (leadTurtle.position + leadTurtle.speed >= limit) {
    const index = data.indexOf(leadTurtle)
    shakeWinner(index)
    updateWinner(leadTurtle);
    return;
  }

  // you cant win!!!
  for (let turtle of data) {
    turtle.position += turtle.speed; // 999
  }
  updateTracks(data);
  updateClock(state)
  state.timerId = setTimeout(() => drawFrame(data, state, config), 1000 / 60 );
}

function updateClock(state) { // drawFrame קורא לזה
    const time = (Date.now() - state.startTime / 1000)
    document.querySelector('#clock').textContent = `${time}`
}

function resetPosition(data, pos) { // startGame קורא לזה
  for (let turtle of data) {
    turtle.position = pos;
  }
}



function shakeWinner(i, offset = '10px', coin = true) {
  const leadContainer = document.querySelector(`.a${i}`)
  leadContainer.querySelector('img').style.top = offset
  const id = setTimeout(() => {

    if (coin) {
      leadContainer.querySelector('img').style.top = offset
      coin = false
      offset = '-10px'
    } else {
      leadContainer.querySelector('img').style.top = offset
      coin = true
      offset = '10px'
    }
    shakeWinner(i, offset, coin)
},100)

document.querySelector('#restart').addEventListener('click', ()=>{
  clearTimeout(id) // why it is not working // עדיף לשים את זה בסטייט
  leadContainer.querySelector('img').style.top = '0px'
  restart()
  
})

}


function updateWinner(turtle) { //drawFrame קורא לזה
  const winnerEl = document.querySelector('#winner');
  winnerEl.textContent = ` ${turtle.name}!`;
  winnerEl.style.color = turtle.color;
}

function startGame(data, state, config) {
    state.startTime = Date.now()
    createTracks(data, state, config)
    resetPosition(data, 0)
    drawFrame(data, state, config)
}

const config = {
  limit: document.querySelector('#tracks').offsetWidth,
  iconWidth: 100,
  winnerShake: true,
  offsetShake: '10px'

};

const state = {
  timerId: null,
  gameTime: 0,
  winner: null
};


    document.querySelector('#reset').addEventListener('click', () => {
      resetPosition(data, 0);

    });



function restart(){
    clearTimeout(state.timerId);
    state.startTime = Date.now()
    resetPosition(data, 0);
    updateTracks(data);
    drawFrame(data, state, config);

}


startGame(data, state, config)





