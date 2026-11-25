
import sqlite3


# Connect to the database
def get_db_connection():

    connection = sqlite3.connect("careconnect.db")

    connection.row_factory = sqlite3.Row

    return connection


# Create appointments table
def create_table():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS appointments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            patient_name TEXT NOT NULL,

            email TEXT NOT NULL,

            doctor TEXT NOT NULL,

            appointment_date TEXT NOT NULL

        )
    """)

    connection.commit()

    connection.close()


# Run table creation
create_table()
