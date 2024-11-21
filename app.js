let userAccount;
let isAdmin = false;
let coins = 0;
let autoClickerActive = false;
let clickMultiplier = 1;
let autoClickerInterval = null;

// Store items with prices
const click2xPrice = 2000;
const autoClickerPrice = 5000;
const click90xPrice = 20000;
const megaClickPrice = 50000; // New item
const instantUpgradePrice = 100000; // New item

// Available social media accounts for exchange (admin can add these with a price)
let socialMediaAccounts = {
    "facebook_account": 5000,  // 5000 coins to exchange for a Facebook account
    "twitter_account": 4000,   // 4000 coins to exchange for a Twitter account
    "instagram_account": 6000  // 6000 coins to exchange for an Instagram account
};

// Store account information for users (which social media accounts they've claimed)
let userSocialAccounts = {};

// Select DOM elements
const loginSection = document.getElementById("login-section");
const profileSection = document.getElementById("profile-section");
const gameSection = document.getElementById("game-section");
const storeSection = document.getElementById("store-section");
const profileUsername = document.getElementById("profile-username");
const profileBalance = document.getElementById("profile-balance");
const coinsEarned = document.getElementById("coins-earned");
const clickBtn = document.getElementById("click-btn");
const autoClickerStatus = document.getElementById("auto-clicker-status");
const storeItems = document.getElementById("store-items");
const accountMessage = document.getElementById("account-message");
const socialUsernameInput = document.getElementById("social-username");
const socialPasswordInput = document.getElementById("social-password");

// Event Listeners for Buttons
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("disconnect-wallet").addEventListener("click", logout);
document.getElementById("view-store").addEventListener("click", showStore);
document.getElementById("start-clicker-game").addEventListener("click", startClickerGame);
document.getElementById("back-to-profile").addEventListener("click", showProfile);
document.getElementById("back-to-profile-from-store").addEventListener("click", showProfile);
document.getElementById("claim-account").addEventListener("click", claimAccount);
document.getElementById("add-social-account").addEventListener("click", addSocialAccount);

// Login function
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (password === "Cocomelon" && username === "kyzin") {
        isAdmin = true;
        initializeUser(username);
        showProfile();
    } else if (username && password === "kyzin") {
        isAdmin = false;
        initializeUser(username);
        showProfile();
    } else {
        document.getElementById("login-error").textContent = "Invalid username or password.";
    }
}

// Initialize user on login
function initializeUser(username) {
    profileUsername.textContent = `Username: ${username}`;
    coins = isAdmin ? Infinity : 1000; // Admin has infinite coins
    profileBalance.textContent = `Balance: ${coins} Coins`;
    coinsEarned.textContent = `Coins: ${coins}`;
    userAccount = username;  // Store the logged-in user's username
}

// Logout function
function logout() {
    loginSection.style.display = "block";
    profileSection.style.display = "none";
    gameSection.style.display = "none";
    storeSection.style.display = "none";
}

// Show profile page
function showProfile() {
    loginSection.style.display = "none";
    profileSection.style.display = "block";
    gameSection.style.display = "none";
    storeSection.style.display = "none";
}

// Start the clicker game
function startClickerGame() {
    profileSection.style.display = "none";
    gameSection.style.display = "block";
    storeSection.style.display = "none";

    clickBtn.addEventListener("click", () => {
        coins += clickMultiplier;
        coinsEarned.textContent = `Coins: ${coins}`;
    });

    if (autoClickerActive) {
        clearInterval(autoClickerInterval); // Clear any existing auto-clicker
    }
}

// Show the store where players can exchange coins for social media accounts
function showStore() {
    profileSection.style.display = "none";
    gameSection.style.display = "none";
    storeSection.style.display = "block";

    loadStoreItems();
}

// Load store items (accounts available for exchange)
function loadStoreItems() {
    storeItems.innerHTML = ""; // Clear previous items

    for (let account in socialMediaAccounts) {
        const price = socialMediaAccounts[account];
        const accountDiv = document.createElement("div");
        accountDiv.className = "store-item";
        accountDiv.innerHTML = `<b>${account}</b><br>Price: ${price} Coins`;
        accountDiv.addEventListener("click", () => exchangeForAccount(account, price));
        storeItems.appendChild(accountDiv);
    }

    // Add special items for purchase
    addSpecialItemsToStore();
}

// Add special items like 2x click, auto-clicker, etc.
function addSpecialItemsToStore() {
    const specialItems = [
        { name: "2x Click Multiplier", price: click2xPrice },
        { name: "Auto Clicker", price: autoClickerPrice },
        { name: "90x Click Multiplier", price: click90xPrice },
        { name: "Mega Click", price: megaClickPrice },
        { name: "Instant Upgrade", price: instantUpgradePrice }
    ];

    specialItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "store-item";
        itemDiv.innerHTML = `<b>${item.name}</b><br>Price: ${item.price} Coins`;
        itemDiv.addEventListener("click", () => buySpecialItem(item));
        storeItems.appendChild(itemDiv);
    });
}

// Buy special item from the store
function buySpecialItem(item) {
    if (coins >= item.price) {
        coins -= item.price;
        profileBalance.textContent = `Balance: ${coins} Coins`;
        alert(`You bought ${item.name} for ${item.price} coins!`);

        // Apply item effect
        if (item.name === "2x Click Multiplier") {
            clickMultiplier = 2;
        } else if (item.name === "Auto Clicker") {
            startAutoClicker();
        } else if (item.name === "90x Click Multiplier") {
            clickMultiplier = 90;
        } else if (item.name === "Mega Click") {
            coins += 1000; // Mega click gives 1000 coins
            coinsEarned.textContent = `Coins: ${coins}`;
        } else if (item.name === "Instant Upgrade") {
            alert("Your account has been instantly upgraded!");
        }
    } else {
        alert("You don't have enough coins!");
    }
}

// Add a social media account for exchange (Admin only)
function addSocialAccount() {
    if (!isAdmin) return;

    const platform = socialUsernameInput.value;
    const price = parseInt(socialPasswordInput.value);

    if (platform && price) {
        socialMediaAccounts[platform] = price;
        alert(`${platform} added with price ${price} coins.`);
        showStore(); // Reload store
    } else {
        alert("Please provide both platform name and price.");
    }
}

// Exchange coins for social media account
function exchangeForAccount(account, price) {
    if (coins >= price) {
        coins -= price;
        profileBalance.textContent = `Balance: ${coins} Coins`;

        // Add the account to the user's profile
        if (!userSocialAccounts[userAccount]) {
            userSocialAccounts[userAccount] = [];
        }
        userSocialAccounts[userAccount].push(account);
        alert(`Successfully exchanged ${price} coins for a ${account}!`);
    } else {
        alert("Not enough coins to exchange for this account.");
    }
}

// Claim a social media account (Player selects which account to claim)
function claimAccount() {
    const selectedAccount = document.getElementById("account-selector").value;

    if (userSocialAccounts[userAccount] && userSocialAccounts[userAccount].includes(selectedAccount)) {
        alert(`You have successfully claimed the ${selectedAccount}!`);
    } else {
        alert(`You do not have this account. Please exchange coins to get it.`);
    }
}

// Start auto-clicker when purchased
function startAutoClicker() {
    autoClickerActive = true;
    autoClickerInterval = setInterval(() => {
        coins += clickMultiplier;
        coinsEarned.textContent = `Coins: ${coins}`;
    },
