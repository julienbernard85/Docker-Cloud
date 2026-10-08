import json
import signal
import sys

from flask import Flask, jsonify

app = Flask(__name__)


def load_games():
    with open("data/games.json", "r", encoding="utf-8") as file:
        return json.load(file)


@app.route("/games")
def get_games():
    return jsonify(load_games())


@app.route("/games/<int:game_id>")
def get_game(game_id):
    games = load_games()

    game = next(
        (game for game in games if game["id"] == game_id),
        None
    )

    if game is None:
        return jsonify({"error": "Jeu introuvable"}), 404

    return jsonify(game)


def shutdown_handler(signum, frame):
    print("Arrêt du serveur back...")
    sys.exit(0)


signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)