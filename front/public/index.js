async function loadGames() {
    try {
        const response = await fetch("/api/games");

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des jeux");
        }

        const games = await response.json();

        const gamesContainer = document.getElementById("games");

        games.forEach(game => {
            const card = document.createElement("a");

            card.classList.add("game-card");

            card.href = `/game.html?id=${game.id}`;

            card.innerHTML = `
                <img
                    src="/images/${game.image}"
                    alt="${game.name}"
                >

                <h2>${game.name}</h2>
            `;

            gamesContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
    }
}

loadGames();