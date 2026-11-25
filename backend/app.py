
from flask import Flask, request, jsonify
from datetime import datetime, date
from flask_cors import CORS

from database import get_db_connection

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return "Welcome to CareConnect!"


@app.route("/doctors")
def doctors():
    return "Available doctors are displayed here."


# Book appointment
@app.route("/book-appointment", methods=["POST"])
def book_appointment():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    doctor = data.get("doctor")
    date = data.get("date")

    # Validate details
    if not all([name, email, doctor, date]):
        return jsonify({
            "message": "Please provide all details."
        }), 400
    
    try:
        appointment_date = datetime.strptime(
            date, "%Y-%m-%d"
        ).date()

        if appointment_date < datetime.today().date():
            return jsonify({
                "message": "Please select a future date."
            }), 400

    except ValueError:
        return jsonify({
            "message": "Invalid appointment date."
        }), 400
    # Connect to database
    connection = get_db_connection()

    # Insert appointment
    connection.execute(
        """
        INSERT INTO appointments
        (patient_name, email, doctor, appointment_date)
        VALUES (?, ?, ?, ?)
        """,
        (name, email, doctor, date)
    )

    # Save changes
    connection.commit()

    # Close connection
    connection.close()

    print("Appointment saved successfully!")

    return jsonify({
        "message": "Your appointment has been booked successfully!"
    }), 200


# View appointments
@app.route("/my-appointments", methods=["GET"])
def my_appointments():

    connection = get_db_connection()

    appointments = connection.execute(
        "SELECT * FROM appointments ORDER BY id DESC"
    ).fetchall()

    connection.close()

    result = []

    for appointment in appointments:

        result.append({
            "id": appointment["id"],
            "name": appointment["patient_name"],
            "email": appointment["email"],
            "doctor": appointment["doctor"],
            "date": appointment["appointment_date"]
        })

    return jsonify(result)

# Cancel appointment
@app.route("/cancel-appointment/<int:appointment_id>", methods=["DELETE"])
def cancel_appointment(appointment_id):

    connection = get_db_connection()

    # Check whether appointment exists
    appointment = connection.execute(
        "SELECT * FROM appointments WHERE id = ?",
        (appointment_id,)
    ).fetchone()

    if appointment is None:

        connection.close()

        return jsonify({
            "message": "Appointment not found."
        }), 404

    # Delete appointment
    connection.execute(
        "DELETE FROM appointments WHERE id = ?",
        (appointment_id,)
    )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Appointment cancelled successfully!"
    }), 200



if __name__ == "__main__":
    app.run(debug=True)
