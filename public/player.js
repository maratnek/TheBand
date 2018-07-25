import {UpDownId} from './main.js';
import {store, storage, storageRef, updateTour, tourList} from "./fb_password.js";
import {getStorageRealUrl} from "./fb_password.js";

$(document).ready(()=>{

  let sost = 'pause';
  let currentTrack = 0;
  let currentAlb = 0;

  let player = $('#audioPlayer').get(0);

  let currentAlbum = {};

  let playlist = [];
  // let playlist = [
  //   "music/westworld/2018 - Runaway/01. Runaway.mp3",
  //   "music/westworld/2018 - Seven Nation Army/01. Seven Nation Army.mp3",
  //   "music/westworld/2018 - Akane No Mai/02. Paint It Black.mp3",
  //   "music/westworld/2016 - Westworld/01. Main Title Theme - Westworld.mp3",
  // ];


  async function changeTrack(ev) {
    let id = ev.currentTarget.id;
    console.log(id);
    if (id == 'nextTrack')
    currentTrack = UpDownId('up',currentTrack, currentAlbum.tracksData.length);
    else if(id == 'prevTrack')
    currentTrack = UpDownId('down',currentTrack, currentAlbum.tracksData.length);
    console.log('Current track', currentTrack);

    await playerUpdate();
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

  // Track position
  $('.track').on('click',function(ev) {

    // console.log(ev.currentTarget.clientWidth);
    // console.log('click',ev);
    // console.log('screen',ev.screenX);
    // console.log('client',ev.clientX);
    // console.log('offset',ev.offsetX);
    // console.log(ev.screenX - ev.clientX);
    // console.log(ev.pageX);
    let place = Math.floor(ev.offsetX / ev.currentTarget.clientWidth * 100);
    console.log('% - ',  place);
    positionChange(place);

    if (player)
      player.currentTime = player.duration * place / 100;

  });
  // $('.track').on('mousedown', ev => console.log('mousedown',ev));
  // $('.track').on('mouseup', ev => console.log('mouseup',ev));
  // $('.track').on('mouseover', ev => console.log('mouseover',ev));
  // $('.track').on('mouseout', ev => console.log('mouseout',ev));
  // $('.track').on('mousemove', ev => console.log('mousemove',ev));

  async function downloadTrack(path){
    let url = await getStorageRealUrl(path);
    for (let pair of playlist) {
        if (pair.path == path)
        {
          console.log('find this path', pair.path);
          player.src = pair.objAudio;
          return;
        }
    }
    console.log('not found this path', path, sost);
    if (url && url.length)
    {
      await fetch(url)
      .then((response) => {
        console.log(response);
        if (response.ok)
        return response.blob();
      })
      .then((file) => {
        console.log(file);
        let objUrl = URL.createObjectURL(file);
        console.log(objUrl);
        player.src = objUrl;
        // save
        playlist.push({
          path: path,
          objAudio: objUrl
        })
        //console.log(player.src);
      });
    }
    // return url;
  }



  let albums = {};

  getJSON('music-map/map');

  async function getJSON(path){

    console.log(path);
    let url = await getStorageRealUrl(path);
    console.log(url);
    if (!(url && url.length))
      return;
    console.log(url);

    fetch(url)
    .then(function(response) {
      if (response.ok)
        return response.json();
      else
        return [];
    })
    .then(function(myJson) {
      console.log(myJson);
      albums = myJson;

      if (albums && albums.length){
        let htmlAlbums = "";
        albums.forEach((alb,index) => {
          if (alb.name) {
            htmlAlbums += `
            <div class="name"><h4>${alb.name}</h4></div>
            <div class="circle"></div>
            <div class="year">2016</div>
            <div class="listen">
            <button id="${index}">Listen</button>
            </div>
            <div class="buy">
            <button id="${index}">Buy</button>
            </div>`;
          }
        });

        currentAlbum = albums[currentAlb];
        playlistCreate(currentAlbum);
        playerUpdate();
        $('#discography .list').html(htmlAlbums);
        $('#discography .listen button').click((ev)=>{
          changePlaylist(ev.currentTarget.id);
        });
      }else{
        $('#discography .list').html("Not albums");
      }

    });
  }

  async function changePlaylist(albumId) {
    // playPause('stop');
    currentAlbum = albums[albumId];
    playlistCreate(currentAlbum);
    currentTrack = 0;
    await playerUpdate();
    console.log('play');
    playPause('play');
  }

  async function playerUpdate() {
    $('.song h4').html(currentAlbum.name);
    $('.song h5').html(currentAlbum.tracksData[currentTrack].name);
    console.log(currentAlbum);
    // player.src = currentAlbum.webkitRelativePath;
    console.log(currentTrack, currentAlbum.tracksData[currentTrack]);
    let path = currentAlbum.tracksData[currentTrack].webkitRelativePath;
    await downloadTrack(path);
    // player.src = await downloadTrack(path);
  }

  function playlistCreate(alb) {
    if (alb && alb['tracksData'] && alb['tracksData'].length){
      let htmlTracks = "";
      //playlist = [];
      alb['tracksData'].forEach( (mus,index) => {
        //playlist.push(mus.webkitRelativePath);
        // console.log(mus);
        htmlTracks += `
        <li>
        <div class="triangle"></div>
        <div class="num">${index}.</div>
        <h5>${mus.name}</h5>
        <div class="point">......................</div>
        <div class="long">3:20</div>
        </li>
        `;
      });
      $('#playerList h4').html(alb.name);
      $('#playerList ul').html(htmlTracks);
    }else{
      $('#playerList').html("Not tracks");
    }
  }

});
