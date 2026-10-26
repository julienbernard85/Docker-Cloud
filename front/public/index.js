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


            const imageWrapper = document.createElement("div");

            imageWrapper.classList.add("game-image-wrapper");


            const image = document.createElement("img");

            image.src = `/images/${game.image}`;

            image.alt = game.name;


            /*
             * Le GIF est totalement optionnel.
             */
            if (game.gif) {

                const staticImage = image.src;


                image.addEventListener("mouseenter", () => {

                    image.src = `/images/${game.gif}`;
                });


                image.addEventListener("mouseleave", () => {

                    image.src = staticImage;
                });


                image.addEventListener("error", () => {

                    image.src = staticImage;
                });
            }


            imageWrapper.appendChild(image);


            const title = document.createElement("h2");

            title.textContent = game.name;


            card.appendChild(imageWrapper);

            card.appendChild(title);


            gamesContainer.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        document.getElementById("games").innerHTML = `
            <p class="error-message">
                Impossible de charger la bibliothèque.
            </p>
        `;
    }
}


loadGames();