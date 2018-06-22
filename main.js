$(document).ready(function(){
  // Add smooth scrolling to all links
  $("header nav a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  let idM = 0;
  let urlsId = [
    'https://source.unsplash.com/JTa5MN7ObbM/1600x900',//vocalist
    'https://source.unsplash.com/7IGBfd3FDtQ/1600x900',//guitar
    'https://source.unsplash.com/NDGzkMIasJQ/1600x900',//bass
    'https://source.unsplash.com/l_fdrk2OyJY/1600x900',//drums
    'https://source.unsplash.com/Ufyx8i35-A0/1600x900',//electronics
  ];

  $('.arrow').on('click', (ev)=>{
    // console.log('click', ev);
    let id = ev.currentTarget.id;
    if (id === 'next')
    {
      console.log('next');
      console.log(idM);
      if (idM < urlsId.length - 1)
        ++idM;
      else
        idM = 0;

      $('figure .img').css("background-image",`url(${urlsId[idM]})`);

       $('.list-name .active').removeClass('active');
       $('.list-name .name').eq(idM).addClass('active');
       $('.list-name .circle').eq(idM).addClass('active');
       $('.list-name .instrument').eq(idM).addClass('active');
       console.log($('.list-name .name.active').text());
       let pair = $('.list-name .name.active').text().split(' ');
       console.log(pair[0], pair[1]);
       $('.fullname .first').text(pair[0]);
       $('.fullname .last').text(pair[1]);

       // $('figure .img').removeClass('img').addClass('img');

      $('#about figure.musician-img').animate({
        transform: 'translateX(100px)'
      }, 1000, ()=>{
        console.log('#about figure animate');
      })
    }
    else if (id === 'prev')
    {
      console.log('prev');
    }
    else {
      console.log('Not known id');
    }
  })
});
