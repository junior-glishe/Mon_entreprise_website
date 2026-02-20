// Initialize EmailJS with your Public Key
(function() {
    emailjs.init("sSXY-Zpx58PU2Sbf0"); // replace with your EmailJS public key
})();

// Attach event listener to the form
window.onload = function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // prevent page reload

        // Collect form data
        const templateParams = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            title: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        // Send email using EmailJS
        emailjs.send("service_rcsrq2m", "template_4ltwu6s", templateParams)
        .then(function(response) {
            alert("Email sent successfully!");
            console.log("SUCCESS!", response.status, response.text);
        }, function(error) {
            alert("Failed to send email. Check console for details.");
            console.error("FAILED...", error);
        });
    });
};

