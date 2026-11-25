
const parameters = new URLSearchParams(window.location.search);

const selectedDoctor = parameters.get("doctor");

document.getElementById("doctor").value =
    selectedDoctor || "";


const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("patientName").value;

    const email = document.getElementById("email").value;

    const doctor = document.getElementById("doctor").value;

    const date = document.getElementById("date").value;

    const message = document.getElementById("message");

    try {

        // Send information to Flask
        const response = await fetch(
            "http://127.0.0.1:5000/book-appointment",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    doctor: doctor,
                    date: date
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = result.message;

        form.reset();

        document.getElementById("doctor").value =
            selectedDoctor || "";

    } catch (error) {

        message.textContent =
            "Error: " + error.message;

    }

});
