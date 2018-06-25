import {UpDownId} from './main.js';

$(document).ready(()=>{

  let sost = 'pause';
  let currentTrack = 0;

  let player = $('#audioPlayer').get(0);
  console.log('player', player);


  let playlist = [
      "./music/westworld/2018 - Runaway/01. Runaway.mp3",
      "./music/westworld/2018 - Seven Nation Army/01. Seven Nation Army.mp3",
      "./music/westworld/2018 - Akane No Mai/02. Paint It Black.mp3",
      "./music/westworld/2016 - Westworld/01. Main Title Theme - Westworld.mp3",
  ];

  function changeTrack(ev) {
    // let btnName = ev.currentTarget.className;
    let id = ev.currentTarget.id;
    console.log(id);
    if (id == 'nextTrack')
      currentTrack = UpDownId('up',currentTrack, playlist.length);
    else if(id == 'prevTrack')
      currentTrack = UpDownId('down',currentTrack, playlist.length);
    console.log('Current track', currentTrack);

    player.src = playlist[currentTrack];
    playPause(sost);
  }

  $('#nextTrack').on('click', (ev) => changeTrack(ev));
  $('#prevTrack').on('click', (ev) => changeTrack(ev));

  // root change
  function positionChange(trackPosition) {
    $(':root').css('--track-position', `${trackPosition}%`);
  }


  function positionUpdate(player) {
    let interv = setInterval(function () {
      if (player && player.currentTime && player.duration)
      {
        positionChange(player.currentTime/player.duration*100);
      }
    }, 500);
    return interv;
  }
  positionUpdate(player);


  function playPause(sostPlayOrPause) {
    sost = sostPlayOrPause;
    let timeAnimate = 200;
    let updateInterval;

    if (sost === 'play')
    {
    player.play();
      $('.control .play').hide(timeAnimate);
      $('.control .pause').show(timeAnimate);
      updateInterval = positionUpdate(player);
    } else {
    player.pause();
      $('.control .play').show(timeAnimate);
      $('.control .pause').hide(timeAnimate);
      if (updateInterval)
        clearInterval(updateInterval);
    }
  };

  $('.control').on('click',ev => playPause(ev.target.className));

  // Mouse events

  $('#audioPlayer').on('click', (ev) => changeTrack(ev));

});
