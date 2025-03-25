const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let recommendations = [];

function toggleSettings() {
    const menu = document.getElementById("settingsMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function logout() {
    location.reload();
}

function showDashboard(username, role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`;

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
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

function addTarget() {
    let targetContainer = document.getElementById("targets");
    let targetCount = targetContainer.getElementsByClassName("targetPrice").length + 1;
    
    let input = document.createElement("input");
    input.type = "number";
    input.className = "targetPrice";
    input.placeholder = `Target ${targetCount}`;
    input.required = true;
    
    targetContainer.appendChild(input);
}

function addRecommendation() {
    const title = document.getElementById("recTitle").value.trim();
    const buyPrice = document.getElementById("buyPrice").value.trim();
    const stopLoss = document.getElementById("stopLoss").value.trim();
    
    const targetInputs = Array.from(document.getElementsByClassName("targetPrice"));
    const targetPrices = targetInputs.map((input, index) => ({
        name: `Target ${index + 1}`,
        price: input.value.trim()
    }));

    if (!title || !buyPrice || !stopLoss || targetPrices.some(target => !target.price)) {
        alert("All fields are required.");
        return;
    }

    const loggedInUser = document.getElementById("welcomeMessage").textContent.split(",")[1]?.trim();
    if (!loggedInUser) return;

    const recommendation = {
        id: Date.now(),
        title,
        buyPrice,
        stopLoss,
        targetPrices,
        createdBy: loggedInUser
    };

    recommendations.push(recommendation);
    loadRecommendations(loggedInUser, users[loggedInUser]?.role);
}

function loadRecommendations(username, role) {
    const recList = document.getElementById("recList");
    recList.innerHTML = "";

    recommendations.forEach((rec) => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("recommendation");

        let targetsHtml = rec.targetPrices.map(target => `<p>${target.name}: ${target.price}</p>`).join("");

        recDiv.innerHTML = `
            <h3>${rec.title}</h3>
            <p>Buy Price: ${rec.buyPrice}</p>
            <p>Stop Loss: ${rec.stopLoss}</p>
            ${targetsHtml}
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
    
    rec.targetPrices.forEach((target, index) => {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "targetPrice";
        input.placeholder = `Target ${index + 1}`;
        input.value = target.price;
        input.required = true;
        targetsContainer.appendChild(input);
    });

    deleteRecommendation(id);
}

function deleteRecommendation(id) {
    let recIndex = recommendations.findIndex(r => r.id === id);
    if (recIndex === -1) return;

    const loggedInUser = document.getElementById("welcomeMessage").textContent.split(",")[1]?.trim();
    if (!loggedInUser) return;

    if (users[loggedInUser].role === "Admin" || (users[loggedInUser].role === "Analyst" && recommendations[recIndex].createdBy === loggedInUser)) {
        recommendations.splice(recIndex, 1);
        loadRecommendations(loggedInUser, users[loggedInUser].role);
    } else {
        alert("You do not have permission to delete this recommendation.");
    }
}
