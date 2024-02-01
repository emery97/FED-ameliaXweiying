document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "65b334a346893806b17bde81"; // Replace with your actual API key
    let apiUrl = "https://fedpairassgn-14ba.restdb.io/rest/customer"; // Replace with your actual URL
  
    document.getElementById("contact-submit").addEventListener("click", function (e) {
      e.preventDefault();
  
      let userName = document.getElementById("user-name").value;
      let userEmail = document.getElementById("user-email").value;
      let userPwd = document.getElementById("user-pwd").value;
  
      let jsondata = {
        "user-name": userName,
        "user-email": userEmail,
        "user-pwd": userPwd, // Passwords should be hashed before sending to the server
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
          alert("Log In success!");
          document.getElementById("add-contact-form").reset();
        })
        .catch(error => {
          console.error("Error:", error);
          alert("There was an error logging in the account.");
        });
    });
  });
  
  