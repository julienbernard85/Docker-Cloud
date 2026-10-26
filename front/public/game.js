const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

const gameImage = document.getElementById("game-image");
const gameTitle = document.getElementById("game-title");
const gameDescription = document.getElementById("game-description");

const platformList = document.getElementById("platform-list");

const storeSection = document.getElementById("store-section");
const storeList = document.getElementById("store-list");

const reviewsGrid = document.getElementById("reviews-grid");
const noReviews = document.getElementById("no-reviews");


function createIcon(classes) {
    const icon = document.createElement("i");

    classes.forEach(className => {
        icon.classList.add(className);
    });

    return icon;
}


function getPlatformIcon(platform) {
    const name = platform.toLowerCase();

    if (name.includes("playstation")) {
        return ["fa-brands", "fa-playstation"];
    }

    if (name.includes("xbox")) {
        return ["fa-brands", "fa-xbox"];
    }

    if (name.includes("pc")) {
        return ["fa-brands", "fa-windows"];
    }

    return ["fa-solid", "fa-gamepad"];
}


function getStoreIcon(type) {
    switch (type) {
        case "steam":
            return ["fa-brands", "fa-steam"];

        case "playstation":
            return ["fa-brands", "fa-playstation"];

        case "xbox":
            return ["fa-brands", "fa-xbox"];

        case "nintendo":
            return ["fa-solid", "fa-gamepad"];

        default:
            return ["fa-solid", "fa-cart-shopping"];
    }
}


function createStars(score, maxScore) {
    const wrapper = document.createElement("div");

    wrapper.classList.add("review-stars");

    const normalizedScore = (score / maxScore) * 5;

    for (let i = 1; i <= 5; i++) {
        let classes;

        if (normalizedScore >= i) {
            classes = ["fa-solid", "fa-star"];
        } else if (normalizedScore >= i - 0.5) {
            classes = ["fa-solid", "fa-star-half-stroke"];
        } else {
            classes = ["fa-regular", "fa-star"];
        }

        wrapper.appendChild(createIcon(classes));
    }

    return wrapper;
}


function displayPlatforms(platforms = []) {
    platformList.replaceChildren();

    platforms.forEach(platform => {
        const badge = document.createElement("span");

        badge.classList.add("platform-badge");

        badge.appendChild(
            createIcon(getPlatformIcon(platform))
        );

        const text = document.createElement("span");
        text.textContent = platform;

        badge.appendChild(text);

        platformList.appendChild(badge);
    });
}


function displayStores(stores = []) {
    storeList.replaceChildren();

    if (stores.length === 0) {
        storeSection.hidden = true;
        return;
    }

    storeSection.hidden = false;

    stores.forEach(store => {
        const link = document.createElement("a");

        link.classList.add("store-button");

        if (store.type) {
            link.classList.add(store.type);
        }

        link.href = store.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.appendChild(
            createIcon(getStoreIcon(store.type))
        );

        const text = document.createElement("span");
        text.textContent = `Voir sur ${store.name}`;

        link.appendChild(text);

        const externalIcon = createIcon([
            "fa-solid",
            "fa-arrow-up-right-from-square"
        ]);

        externalIcon.classList.add("store-arrow");

        link.appendChild(externalIcon);

        storeList.appendChild(link);
    });
}


function displayReviews(reviews = []) {
    reviewsGrid.replaceChildren();

    if (reviews.length === 0) {
        noReviews.hidden = false;
        return;
    }

    noReviews.hidden = true;

    reviews.forEach(review => {
        const card = document.createElement("a");

        card.classList.add("review-card");

        card.href = review.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";


        const top = document.createElement("div");
        top.classList.add("review-top");


        const source = document.createElement("span");
        source.classList.add("review-source");
        source.textContent = review.name;


        const score = document.createElement("span");
        score.classList.add("review-score");
        score.textContent = `${review.score}/${review.maxScore}`;


        top.appendChild(source);
        top.appendChild(score);


        const stars = createStars(
            review.score,
            review.maxScore
        );


        const linkText = document.createElement("span");

        linkText.classList.add("review-link");

        linkText.textContent = "Voir le test ";

        linkText.appendChild(
            createIcon([
                "fa-solid",
                "fa-arrow-up-right-from-square"
            ])
        );


        card.appendChild(top);
        card.appendChild(stars);
        card.appendChild(linkText);

        reviewsGrid.appendChild(card);
    });
}


function displayGame(game) {
    document.title = `${game.name} | Bibliothèque`;

    gameTitle.textContent = game.name;
    gameDescription.textContent = game.description;

    gameImage.src = `/images/${game.image}`;
    gameImage.alt = game.name;

    displayPlatforms(game.platforms);
    displayStores(game.stores);
    displayReviews(game.reviews);
}


async function loadGame() {
    if (!gameId) {
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch(`/api/games/${gameId}`);

        if (!response.ok) {
            throw new Error("Jeu introuvable");
        }

        const game = await response.json();

        displayGame(game);

    } catch (error) {
        console.error(error);

        gameTitle.textContent = "Jeu introuvable";
        gameDescription.textContent =
            "Impossible de charger les informations de ce jeu.";
    }
}


loadGame();