import {UpDownId} from './main.js';
import {store, storage, storageRef, updateTour, tourList} from "./fb_password.js";

$(document).ready(()=>{

  let sost = 'pause';
  let currentTrack = 0;
  let currentAlb = 0;

  let player = $('#audioPlayer').get(0);
  console.log('player', player);

  let currentAlbum = {};

  let playlist = [
    "music/westworld/2018 - Runaway/01. Runaway.mp3",
    "music/westworld/2018 - Seven Nation Army/01. Seven Nation Army.mp3",
    "music/westworld/2018 - Akane No Mai/02. Paint It Black.mp3",
    "music/westworld/2016 - Westworld/01. Main Title Theme - Westworld.mp3",
  ];


  console.log($('#discography .listen button'));

  function changeTrack(ev) {
    let id = ev.currentTarget.id;
    console.log(id);
    if (id == 'nextTrack')
    currentTrack = UpDownId('up',currentTrack, playlist.length);
    else if(id == 'prevTrack')
    currentTrack = UpDownId('down',currentTrack, playlist.length);
    console.log('Current track', currentTrack);

    playerUpdate();
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

    console.log(ev.currentTarget.clientWidth);
    console.log('click',ev);
    console.log('screen',ev.screenX);
    console.log('client',ev.clientX);
    console.log('offset',ev.offsetX);
    console.log(ev.screenX - ev.clientX);
    console.log(ev.pageX);
    let place = Math.floor(ev.offsetX / ev.currentTarget.clientWidth * 100);
    console.log('% - ',  place);
    positionChange(place);

    if (player)
    {
      player.currentTime = player.duration * place / 100;
      // positionChange(player.currentTime/player.duration*100);
    }

  });
  // $('.track').on('mousedown', ev => console.log('mousedown',ev));
  // $('.track').on('mouseup', ev => console.log('mouseup',ev));
  // $('.track').on('mouseover', ev => console.log('mouseover',ev));
  // $('.track').on('mouseout', ev => console.log('mouseout',ev));
  // $('.track').on('mousemove', ev => console.log('mousemove',ev));

  let albums = {};

  var starsRef = storageRef.child('music-map').child('map');

  // Get the download URL
  starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
    console.log(url);
    getJSON(url);

    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'json';
    // xhr.onload = function(event) {
    //   var json = xhr.response;
    //   console.log(json);
    // };
    // xhr.open('GET', url);
    // xhr.send();

  }).catch(function(error) {

    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object_not_found':
      // File doesn't exist
      break;

      case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

      case 'storage/canceled':
      // User canceled the upload
      break;

      case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
    }
  });

  function getJSON(json){
    console.log(json)
    let request = new Request(json);
    fetch(request, {
      // method: 'GET',
      // mode: 'cors',
      // headers: {
        // "Content-Type": "application/json; charset=utf-8",
        // "Access-Control-Allow-Origin": "",
        // "Origin":"",
      // }
    })
    .then(function(response) {
      console.log(response);
      if (response.ok)
        return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      albums = myJson;
      // console.log(myJson["musician list"]);
      let path = 'music/westworld';

      if (myJson["dirs"] && myJson["dirs"].length){
        let htmlAlbums = "";
        myJson.dirs.forEach((alb,index) => {
          if (alb.albumName) {
            htmlAlbums += `
            <div class="name"><h4>${alb.albumName}</h4></div>
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

        currentAlbum = myJson.dirs[currentAlb];
        playlistCreate(currentAlbum);
        $('#discography .list').html(htmlAlbums);
        $('#discography .listen button').click((ev)=>{
          console.log(ev.currentTarget.id);
          changePlaylist(ev.currentTarget.id);
        });
      }else{
        $('#discography .list').html("Not albums");
      }

    });
  }

  function changePlaylist(albumId) {
    currentAlbum = albums.dirs[albumId];
    playlistCreate(currentAlbum);
    currentTrack = 0;
    playerUpdate();
    playPause('play');

  }

  function playerUpdate() {
    console.log(currentAlbum);
    player.src = currentAlbum.path + '/' + currentAlbum['track list'][currentTrack];
    $('.song h4').html(currentAlbum.albumName);
    $('.song h5').html(currentAlbum['track list'][currentTrack]);
  }

  function playlistCreate(alb) {
    if (alb && alb['track list'] && alb['track list'].length){
      let htmlTracks = "";
      playlist = [];
      alb['track list'].forEach( (mus,index) => {
        playlist.push(alb.path + '/' + mus);
        console.log(mus);
        htmlTracks += `
        <li>
        <div class="triangle"></div>
        <div class="num">${index}.</div>
        <h5>${mus}</h5>
        <div class="point">......................</div>
        <div class="long">3:20</div>
        </li>
        `;
      });
      console.log(alb.albumName);
      $('#playerList h4').html(alb.albumName);
      $('#playerList ul').html(htmlTracks);
    }else{
      $('#playerList').html("Not tracks");
    }
  }

});
