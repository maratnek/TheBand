$(document).ready(()=>{

  // root change
  function positionChange(trackPosition) {
    // let trackPosition = 50;
    $(':root').css('--track-position', `${trackPosition}%`);
  }

  var player = $('#audioPlayer').get(0);
  console.log('player', player);

  function positionUpdate(player) {
    let interv = setInterval(function () {
      if (player && player.currentTime && player.duration)
      {
        console.log(player.currentTime, player.duration);
        positionChange(player.currentTime/player.duration*100);
      }
    }, 10);
  }
  positionUpdate(player);

  $('.control').on('click',(ev)=>{
    let btnName = ev.target.className;
    let time = 200;
    if (btnName === 'play')
    {
    player.play();
      $('.control .play').hide(time);
      $('.control .pause').show(time);
    } else {
    player.pause();
      $('.control .play').show(time);
      $('.control .pause').hide(time);
    }
    console.log(this);
  });
});
