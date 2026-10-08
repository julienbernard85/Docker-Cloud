async function loadGame() {
    const params = new URLSearchParams(window.location.search);

    const gameId = params.get("id");

    if (!gameId) {
        return;
    }

    try {
        const response = await fetch(`/api/games/${gameId}`);

        if (!response.ok) {
            throw new Error("Jeu introuvable");
        }

        const game = await response.json();

        document.title = game.name;

        const container = document.getElementById("game-detail");

        container.innerHTML = `
            <img
                src="/images/${game.image}"
                alt="${game.name}"
                class="game-detail-image"
            >

            <div class="game-detail-content">
                <h1>${game.name}</h1>

                <p>${game.description}</p>
            </div>
        `;

    } catch (error) {
        console.error(error);
    }
}

loadGame();