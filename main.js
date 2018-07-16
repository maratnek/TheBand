export function UpDownId(upDown, id, max) {
  console.log(upDown, id, max);
  if (upDown == "up") {
    if (id < max - 1) {
      ++id;
    } else {
      id = 0;
    }
  } else if (upDown == "down") {
    if (id > 0) {
      --id;
    } else {
      id = max - 1;
    }
  }
  return id;
};


import {updateTour, tourList, ticketList} from './fb_password.js';

$(document).ready(function(){

// download tours
updateTour('tabloList', tourList);
updateTour('ticketList', ticketList);

  // Add smooth scrolling to all links
  $("nav a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      // Store hash
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });

  let idM = 2;
  let urlsId = [
    'https://source.unsplash.com/JTa5MN7ObbM/1600x900',//vocalist
    'https://source.unsplash.com/7IGBfd3FDtQ/1600x900',//guitar
    'https://source.unsplash.com/NDGzkMIasJQ/1600x900',//bass
    'https://source.unsplash.com/l_fdrk2OyJY/1600x900',//drums
    'https://source.unsplash.com/Ufyx8i35-A0/1600x900',//electronics
  ];

  function changeMusician(ev) {
    let id = ev.currentTarget.id;
    console.log(id);
    if (id === 'next')
    {
      console.log('next');
      // console.log(idM);
      idM = UpDownId("up", idM, urlsId.length);

      $('figure .img').css("background-image",`url(${urlsId[idM]})`);
      $('.list-name .active').removeClass('active');
      $('.list-name .name').eq(idM).addClass('active');
      $('.list-name .circle').eq(idM).addClass('active');
      $('.list-name .instrument').eq(idM).addClass('active');
      // console.log($('.list-name .name.active').text());
      let pair = $('.list-name .name.active').text().split(' ');
      // console.log(pair[0], pair[1]);
      $('.fullname .first').text(pair[0]);
      $('.fullname .last').text(pair[1]);
    }
    else if (id === 'prev')
    {
      console.log('prev');
      idM = UpDownId("down", idM, urlsId.length);

      $('figure .img').css("background-image",`url(${urlsId[idM]})`);
      $('.list-name .active').removeClass('active');
      $('.list-name .name').eq(idM).addClass('active');
      $('.list-name .circle').eq(idM).addClass('active');
      $('.list-name .instrument').eq(idM).addClass('active');
      // console.log($('.list-name .name.active').text());
      let pair = $('.list-name .name.active').text().split(' ');
      // console.log(pair[0], pair[1]);
      $('.fullname .first').text(pair[0]);
      $('.fullname .last').text(pair[1]);
    }
    else {
      console.log('Not known id');
    }
  };

  $('#next').on('click', ev => changeMusician(ev));
  $('#prev').on('click', ev => changeMusician(ev));
  $('nav li').on('click',function(ev) {
      console.log('click', ev);
      console.log($(this));
      $('nav li.active').removeClass('active');
      // ev.currentTarget.addClass('active');
      // $(this).each((li)=>{
        // console.log($(this));
        // $(this).addClass('active');
      // });

  });


});
