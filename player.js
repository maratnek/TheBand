$(document).ready(()=>{
  let player = $('#audioPlayer');
  console.log('player', player);
  $('.control').on('click',(ev)=>{
    let btnName = ev.target.className;
    if (btnName === 'play')
    {
      let time = 200;
      $('.control .play').hide(time);
      $('.control .pause').show(time);
    } else {
      $('.control .play').show(time);
      $('.control .pause').hide(time);
    }
    console.log(this);
  });
});
