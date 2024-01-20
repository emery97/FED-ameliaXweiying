//Home page slide show 
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}



//Home page hovering images
document.addEventListener("DOMContentLoaded", function() {
    var productImages = document.querySelectorAll('.product-image');
  
    productImages.forEach(function(img) {
      // Preload hover images to reduce flickering on hover
      const hoverImageSrc = img.getAttribute('data-hover');
      const hoverImage = new Image();
      hoverImage.src = hoverImageSrc;
  
      var originalSrc = img.src;
  
      img.addEventListener('mouseenter', function() {
        img.src = hoverImageSrc;
      });
  
      img.addEventListener('mouseleave', function() {
        img.src = originalSrc;
      });
    });
  });
  
  //Footer press app and qr code shows
  function toggleQRCode(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor element aka webste brining you up to main page bc of the # href
  
    var qrCode = document.getElementById("qrCode");
    qrCode.style.display = (qrCode.style.display === "none") ? "block" : "none";
  }
  
  