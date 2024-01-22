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

//Home page pop up
// Function to open the popup
function openPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
  document.body.classList.add('body-no-scroll'); // Disable scrolling
}

// Function to close the popup
function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
  document.body.classList.remove('body-no-scroll'); // Re-enable scrolling
}

// When the user clicks on <span> (x), close the popup
var close = document.getElementsByClassName("close")[0];
close.onclick = function() {
  closePopup();
}

// Open the popup after 3 seconds (3000 milliseconds)
window.onload = function() {
  setTimeout(openPopup, 3000);
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
  
  
  //Products display heart shape when hover change color
  function toggleHeart(element) {
    element.classList.toggle('liked');
  }

  //Products image switching upon arrow click
  function nextImage(productItem) {
    const images = productItem.querySelectorAll('.product-image img');
    for (let i = 0; i < images.length; i++) {
      if (images[i].classList.contains('active') && i < images.length - 1) {
        images[i].classList.remove('active');
        images[i + 1].classList.add('active');
        break;
      }
    }
  }
  
  function previousImage(productItem) {
    const images = productItem.querySelectorAll('.product-image img');
    for (let i = images.length - 1; i >= 0; i--) {
      if (images[i].classList.contains('active') && i > 0) {
        images[i].classList.remove('active');
        images[i - 1].classList.add('active');
        break;
      }
    }
  }
  