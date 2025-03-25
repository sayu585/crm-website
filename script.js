const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst1": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let recommendations = JSON.parse(localStorage.getItem("recommendations")) || [];

function toggleSettings() {
    const menu = document.getElementById("settingsMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload();
}

function loadLogin() {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) {
        showDashboard(savedUser.username, savedUser.role);
    }
}

function showDashboard(username, role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;

    if (role === "Admin" || role === "Analyst") {
        document.getElementById("adminPanel").style.display = "block";
    }
    
    loadRecommendations(username, role);
}

document.getElementById('submitLogin').addEventListener('click', function() {
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();
    
    if (users[username] && users[username].password === password) {
        showDashboard(username, users[username].role);
        if (document.getElementById("rememberMe").checked) {
            localStorage.setItem("loggedInUser", JSON.stringify({ username, role: users[username].role }));
        }
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

function addTarget() {
    let targetContainer = document.getElementById("targets");
    let input = document.createElement("input");
    input.type = "number";
    input.className = "targetPrice";
    input.placeholder = "Target Price";
    input.required = true;
    targetContainer.appendChild(input);
}

function addRecommendation() {
    const title = document.getElementById("recTitle").value.trim();
    const buyPrice = document.getElementById("buyPrice").value.trim();
    const stopLoss = document.getElementById("stopLoss").value.trim();
    const targetPrices = Array.from(document.getElementsByClassName("targetPrice")).map(input => input.value.trim());

    if (!title || !buyPrice || !stopLoss || targetPrices.some(price => !price)) {
        alert("All fields are required.");
        return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const recommendation = {
        id: Date.now(),
        title,
        buyPrice,
        stopLoss,
        targetPrices,
        createdBy: loggedInUser.username
    };

    recommendations.push(recommendation);
    localStorage.setItem("recommendations", JSON.stringify(recommendations));
    loadRecommendations(loggedInUser.username, loggedInUser.role);
}

function loadRecommendations(username, role) {
    const recList = document.getElementById("recList");
    recList.innerHTML = "";
    
    recommendations.forEach((rec, index) => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("recommendation");
        recDiv.innerHTML = `
            <h3>${rec.title}</h3>
            <p>Buy Price: ${rec.buyPrice}</p>
            <p>Stop Loss: ${rec.stopLoss}</p>
            <p>Targets: ${rec.targetPrices.join(", ")}</p>
        `;

        if (role === "Admin" || (role === "Analyst" && rec.createdBy === username)) {
            recDiv.innerHTML += `
                <button onclick="editRecommendation(${rec.id})">Edit</button>
                <button onclick="deleteRecommendation(${rec.id})">Delete</button>
            `;
        }

        recList.appendChild(recDiv);
    });
}

function editRecommendation(id) {
    const rec = recommendations.find(r => r.id === id);
    if (!rec) return;

    document.getElementById("recTitle").value = rec.title;
    document.getElementById("buyPrice").value = rec.buyPrice;
    document.getElementById("stopLoss").value = rec.stopLoss;

    const targetsContainer = document.getElementById("targets");
    targetsContainer.innerHTML = "";
    rec.targetPrices.forEach(price => {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "targetPrice";
        input.placeholder = "Target Price";
        input.value = price;
        targetsContainer.appendChild(input);
    });

    deleteRecommendation(id);
}

function deleteRecommendation(id) {
    recommendations = recommendations.filter(rec => rec.id !== id);
    localStorage.setItem("recommendations", JSON.stringify(recommendations));

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    loadRecommendations(loggedInUser.username, loggedInUser.role);
}

loadLogin();
