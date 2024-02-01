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
  

//FOR API
document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65b334a346893806b17bde81"; // Replace with your actual API key
  const apiUrl = "https://fedpairassgn-14ba.restdb.io/rest/customer"; // Replace with your actual URL

  document.getElementById("contact-submit").addEventListener("click", function (e) {
    e.preventDefault();

    let userName = document.getElementById("user-name").value;
    let userEmail = document.getElementById("user-email").value;
    let userPwd = document.getElementById("user-pwd").value;

    let jsondata = {
      "name": userName,
      "email": userEmail,
      "password": userPwd, // Passwords should be hashed before sending to the server
    };

    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    };

    fetch(apiUrl, settings)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        alert("Account created successfully");
        document.getElementById("add-contact-form").reset();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("There was an error creating the account.");
      });
  });
});

//Press arrow change image for displaying of products
function toggleImage(productIndex) {
  var imageContainers = document.getElementsByClassName('image-container');
  var images = imageContainers[productIndex].getElementsByClassName('product-image');
  
  // Toggle visibility of the images
  for (var i = 0; i < images.length; i++) {
    images[i].classList.toggle('active');
  }
}


// FOR LOGIN PAGE
// Simple example to handle form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Perform your validation and AJAX request to login here
  console.log('Username:', username, 'Password:', password);

  // For now, just a simple alert
  alert('Login form submitted. Check console for details.');
});


//ADD TO CART
