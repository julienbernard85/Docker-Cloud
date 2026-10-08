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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)