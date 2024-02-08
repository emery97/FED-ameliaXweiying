document.addEventListener("DOMContentLoaded", function () {
    // Check if the element with id 'newsletter-email' exists
    if (document.getElementById("newsletter-email")) {
        const APIKEY = "65b334a346893806b17bde81"; // Replace with your actual API key
        let apiUrl = "https://fedpairassgn-14ba.restdb.io/rest/customer-newsletter-popup"; // Replace with your actual URL
    
        // Add event listener to the submit button
        document.getElementById("newsletter-submit").addEventListener("click", function (e) {
            e.preventDefault();
    
            // Get the value of the email input field
            let userEmail = document.getElementById("newsletter-email").value;
    
            // Create JSON data object
            let jsondata = {
                "newsletter-email": userEmail,
            };
    
            // Define fetch settings
            let settings = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(jsondata)
            };
    
            // Fetch request to API
            fetch(apiUrl, settings)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    alert("Sign up success!");
                    document.getElementById("email-form").reset();
                    // Call the closePopup function to close the popup
                    closePopup();
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("There was an error signing up of newsletter.");
                });
        });
    }
  });
  