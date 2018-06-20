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

  $('.arrow').on('click', (ev)=>{
    // console.log('click', ev);
    let id = ev.currentTarget.id;
    if (id === 'next')
    {
      console.log('next');
      $('.musicians::before').css("background-image","url('https://source.unsplash.com/7IGBfd3FDtQ/1600x900')");
      // $('.musicians').css("background-image","url('https://source.unsplash.com/7IGBfd3FDtQ/1600x900')");
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
