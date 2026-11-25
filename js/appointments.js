
const appointmentList =
    document.getElementById("appointmentList");

const message =
    document.getElementById("appointmentMessage");


// Get appointments from Flask
async function loadAppointments() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/my-appointments"
        );

        if (!response.ok) {
            throw new Error("Unable to load appointments");
        }

        const appointments = await response.json();

        appointmentList.innerHTML = "";

        if (appointments.length === 0) {

            appointmentList.textContent =
                "No appointments found.";

            return;
        }

        appointments.forEach(function(appointment) {

            const card = document.createElement("div");

            card.className = "appointment-card";

            const heading = document.createElement("h3");
            heading.textContent = "Appointment #" + appointment.id;

            const patient = document.createElement("p");
            patient.textContent = "Patient: " + appointment.name;

            const email = document.createElement("p");
            email.textContent = "Email: " + appointment.email;

            const doctor = document.createElement("p");
            doctor.textContent = "Doctor: " + appointment.doctor;

            const date = document.createElement("p");
            date.textContent = "Date: " + appointment.date;

            const cancelButton = document.createElement("button");

            cancelButton.textContent = "Cancel Appointment";
            cancelButton.className = "cancel-button";

            cancelButton.addEventListener("click", function() {
                cancelAppointment(appointment.id);
            });

            card.appendChild(heading);
            card.appendChild(patient);
            card.appendChild(email);
            card.appendChild(doctor);
            card.appendChild(date);
            card.appendChild(cancelButton);

            appointmentList.appendChild(card);

        });

    } catch (error) {

        appointmentList.textContent =
            "Error loading appointments: " + error.message;

    }

}


// Cancel an appointment
async function cancelAppointment(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/cancel-appointment/" + id,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = result.message;

        loadAppointments();

    } catch (error) {

        message.textContent = error.message;

    }

}


// Load appointments when page opens
loadAppointments();
