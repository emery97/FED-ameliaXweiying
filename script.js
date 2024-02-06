// HOME PAGE SLIDESHOW
// Check if the index-main-slideshow element exists before running the slideshow
const slideshowContainer = document.getElementById('index-main-slideshow');
if (slideshowContainer) {
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
}


//Home page pop up
// Function to open the popup
//function openPopup() {
 // var popup = document.getElementById("popup");
 // popup.style.display = "block";
 // document.body.classList.add('body-no-scroll'); // Disable scrolling
//}

// Function to close the popup
//function closePopup() {
 // var popup = document.getElementById("popup");
//  popup.style.display = "none";
 // document.body.classList.remove('body-no-scroll'); // Re-enable scrolling
//}

// When the user clicks on <span> (x), close the popup
//var close = document.getElementsByClassName("close")[0];
//close.onclick = function() {
 // closePopup();
//}

//// Open the popup after 3 seconds (3000 milliseconds)
//window.onload = function() {
 // setTimeout(openPopup, 3000);
//}


// SIGN UP FOR NEWS LETTER
// Function to show the popup
function showPopup() {
  document.getElementById('popup-overlay').style.display = 'flex';
}

// Function to close the popup
function closePopup() {
  document.getElementById('popup-overlay').style.display = 'none';
}

// Add event listener for the form submission
document.getElementById('email-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var email = document.getElementById('email-input').value;
  // Validate the email and handle the signup process
  console.log('Email:', email);
  // After handling the signup, close the popup
  closePopup();
});

// Call showPopup to display the popup when needed
showPopup();

//Home page hovering images
document.addEventListener("DOMContentLoaded", function() {
  var productImages = document.querySelectorAll('.product-image');

  productImages.forEach(function(img) {
    // Preload hover images to reduce flickering on hover
    const hoverImageSrc = img.getAttribute('data-hover');
    if (hoverImageSrc) {
      const hoverImage = new Image();
      hoverImage.src = hoverImageSrc;

      var originalSrc = img.src;

      img.addEventListener('mouseenter', function() {
        img.src = hoverImageSrc;
      });

      img.addEventListener('mouseleave', function() {
        img.src = originalSrc;
      });
    }
  });
});

  //Footer press app and qr code shows
  function toggleQRCode(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor element aka webste brining you up to main page bc of the # href
  
    var qrCode = document.getElementById("qrCode");
    qrCode.style.display = (qrCode.style.display === "none") ? "block" : "none";
  }
  

// This function toggles the 'liked' class on the heart icon
function toggleHeart(element) {
  element.classList.toggle('clicked');
}

// This function switches the active class on product images to the next image
function toggleImage(productItem) {
  const images = productItem.querySelectorAll('.image-container img');
  for (let i = 0; i < images.length; i++) {
    if (images[i].classList.contains('active')) {
      images[i].classList.remove('active');
      if (i < images.length - 1) {
        images[i + 1].classList.add('active');
      } else {
        images[0].classList.add('active'); // Loop back to the first image
      }
      break;
    }
  }
}
