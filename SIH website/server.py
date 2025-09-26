# Import the Flask library and jsonify to send JSON data
# Import the random library to simulate changing sensor data
from flask import Flask, jsonify
import random

# --- (This part is the same as before) ---
# Create an instance of the Flask application
# The 'static_folder' tells Flask where to find files like index.html, styles.css, etc.
app = Flask(__name__, static_folder='.', static_url_path='')


# --- NEW SECTION: Simulating Data from ESP32-CAM ---
def get_data_from_esp32():
    """
    This function simulates fetching data from an ESP32-CAM over Wi-Fi.
    
    IN A REAL PROJECT:
    This is where you would put the code to make a network request to your ESP32-CAM's IP address.
    For example:
    
    import requests
    ESP32_IP = "192.168.1.10"  # <-- PUT YOUR ESP32-CAM's IP ADDRESS HERE
    try:
        response = requests.get(f"http://{ESP32_IP}/data")
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        # Handle errors if the ESP32 is not reachable
        print(f"Could not connect to ESP32-CAM: {e}")
        return {"error": "ESP32-CAM not reachable"}
    """
    
    # For now, we generate random data to simulate a live feed.
    simulated_data = {
        "status": "ACTIVE",
        "pesticideSaved": round(random.uniform(65, 75), 1),
        "infectionRate": round(random.uniform(8, 15), 1),
        "chartData": [random.randint(5, 8), random.randint(6, 9), random.randint(5, 10), random.randint(8, 12), random.randint(10, 14), random.randint(9, 13), random.randint(11, 15)]
    }
    return simulated_data


# --- NEW SECTION: Creating the API Endpoint ---
@app.route('/api/data')
def get_dashboard_data():
    """
    This is the API endpoint that our frontend website will call.
    It gets the data from our ESP32 simulator and sends it as a JSON response.
    """
    data = get_data_from_esp32()
    return jsonify(data)


# --- (This part is the same as before) ---
# This defines the main route that serves our website
@app.route('/')
def index():
    return app.send_static_file('index.html')

# This is the main entry point to run the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)