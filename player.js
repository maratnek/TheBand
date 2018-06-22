$(document).ready(()=>{

  let sost = 'pause';
  let currentTrack = 0;

  let player = $('#audioPlayer').get(0);
  console.log('player', player);
  function UpDownId(upDown, id, max) {
    console.log(upDown, id, max);
      if (upDown === "up"){
        if (id < max - 1)
          ++id;
        else
          id = 0;
      } else if (upDown === "down") {
        if (id > 0)
          --id;
        else
          id = max - 1;
      }
      return id;
    }

  let playlist = [
      "./music/westworld/2018 - Runaway/01. Runaway.mp3",
      "./music/westworld/2018 - Seven Nation Army/01. Seven Nation Army.mp3",
      "./music/westworld/2018 - Akane No Mai/02. Paint It Black.mp3",
      "./music/westworld/2016 - Westworld/01. Main Title Theme - Westworld.mp3",
  ];

  function changeTrack(ev) {
    let btnName = ev.currentTarget.className;
    console.log(btnName);
    if (btnName === 'next')
      currentTrack = UpDownId('up',currentTrack, playlist.length);
    else (btnName === 'prev')
      currentTrack = UpDownId('down',currentTrack, playlist.length);

    player.src = playlist[currentTrack];
    playPause(sost);
  }

  $('.player .next').on('click', ev => changeTrack(ev));
  $('.player .prev').on('click', ev => changeTrack(ev));

  // root change
  function positionChange(trackPosition) {
    // let trackPosition = 50;
    $(':root').css('--track-position', `${trackPosition}%`);
  }


  function positionUpdate(player) {
    let interv = setInterval(function () {
      if (player && player.currentTime && player.duration)
      {
        // console.log(player.currentTime, player.duration);
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

});
