
const adminList = document.getElementById("adminAppointmentList");

async function loadAdminAppointments() {
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/my-appointments"
        );

        const appointments = await response.json();

        adminList.innerHTML = "";

        if (appointments.length === 0) {
            adminList.textContent = "No appointments available.";
            return;
        }

        appointments.forEach((appointment) => {
            const card = document.createElement("div");
            card.className = "appointment-card";

            const name = document.createElement("h3");
            name.textContent = appointment.name;

            const email = document.createElement("p");
            email.textContent = "Email: " + appointment.email;

            const doctor = document.createElement("p");
            doctor.textContent = "Doctor: " + appointment.doctor;

            const date = document.createElement("p");
            date.textContent = "Date: " + appointment.date;

            card.append(name, email, doctor, date);
            adminList.appendChild(card);
        });

    } catch (error) {
        adminList.textContent = "Unable to load appointments.";
        console.error(error);
    }
}

loadAdminAppointments();
