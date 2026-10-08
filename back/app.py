import signal
import sys

from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/games")
def games():
    return jsonify([
        {
            "id": 1,
            "name": "Minecraft"
        },
        {
            "id": 2,
            "name": "Zelda"
        }
    ])

# Arrêt gracieux du serveur Flask sinon il y a un code d'arrêt 137
def shutdown_handler(signum, frame):
    print("Arrêt du serveur back...")
    sys.exit(0)


signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)