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
// SIGN UP FOR NEWS LETTER
// Function to show the popup

// Check if the popup-overlay element exists before running the functions related to the popup

const popupOverlay = document.getElementById('popup-overlay');
if (popupOverlay) {
    // Function to show the popup
    function showPopup() {
        popupOverlay.style.display = 'flex';
    }

    // Function to close the popup
    function closePopup() {
        popupOverlay.style.display = 'none';
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
}

// Check if the popup-overlay element exists before running the hovering images code
if (popupOverlay) {
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
}

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
// ******************** ADD TO CART *********************************

// Try to load the cart from localStorage when the script loads or is refreshed
var cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCartSidebar(forceOpen) {
  var sidebar = document.getElementById('cartSidebar');
  // Update the cart display whenever the cart is toggled
  updateCartDisplay(); // This will refresh the cart items from localStorage

  // If forceOpen is true, ensure the sidebar is open; otherwise, toggle normally
  if (forceOpen === true && !sidebar.classList.contains('open')) {
    sidebar.classList.add('open');
  } else if (forceOpen !== true) {
    sidebar.classList.toggle('open');
  }
}


function addToCart(name, price, imageSrc) {
  var existingProduct = cart.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1, image: imageSrc });
  }

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the cart display without toggling the sidebar
  updateCartDisplay();
  // Force the sidebar to open without toggling
  toggleCartSidebar(true); // Pass true to force the sidebar to stay open
}

function updateCartDisplay() {
  var cartItemsContainer = document.getElementById('cartItemsContainer');
  var totalPrice = 0;
  cartItemsContainer.innerHTML = ''; // Clear the container

  cart.forEach(function(item, index) {
    totalPrice += item.price * item.quantity;
    var cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>$${item.price} x <span id="quantity_${index}">${item.quantity}</span></p>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQuantity(${index}, -1)">-</button>
        <span class="cart-item-quantity">${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemDiv);
  });

  // Update the total price
  var totalPriceElement = document.getElementById('totalPrice');
  totalPriceElement.textContent = 'Total Price: $' + totalPrice.toFixed(2);
}

function changeQuantity(index, delta) {
  var item = cart[index];
  if (!item) {
    return;
  }

  item.quantity += delta;

  // Remove item from cart if quantity is 0
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  updateCartDisplay();
}

