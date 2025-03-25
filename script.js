const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let recommendations = [];
let tempTargets = [];
let reactions = {};
let sessionUser = null; // In-memory session management
let rememberUser = false; // Flag to "keep the user signed in"

document.getElementById('submitLogin').addEventListener('click', function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    if (users[username] && users[username].password === password) {
        sessionUser = { username, role: users[username].role }; // Store user in memory
        rememberUser = rememberMe; // Set flag based on checkbox state
        showDashboard(sessionUser.role);
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

// Automatically log the user back in if "Keep Me Signed In" was selected
function checkRememberedSession() {
    if (rememberUser && sessionUser) {
        showDashboard(sessionUser.role);
    }
}

function showDashboard(role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;
    if (role === "Admin" || role === "Analyst") {
        document.getElementById("adminPanel").style.display = "block";
    } else {
        document.getElementById("adminPanel").style.display = "none";
    }
    loadRecommendations(role);
}

function addTarget() {
    const targetField = document.createElement("input");
    targetField.type = "number";
    targetField.placeholder = `Target ${tempTargets.length + 1}`;
    targetField.className = "target-field";
    document.getElementById("targetsContainer").appendChild(targetField);
    tempTargets.push(targetField);
}

function addRecommendation() {
    const title = document.getElementById("recTitle").value.trim();
    const buyPrice = document.getElementById("buyPrice").value.trim();
    const stopLoss = document.getElementById("stopLoss").value.trim();
    const targets = tempTargets.map(targetField => targetField.value.trim()).filter(Boolean);

    if (title && buyPrice && stopLoss) {
        recommendations.push({ title, buyPrice, stopLoss, targets });
        tempTargets = [];
        document.getElementById("targetsContainer").innerHTML = ""; // Clear targets container
        clearInputs(); // Clear input fields
        loadRecommendations(sessionUser.role); // Reload recommendations
    }
}

function clearInputs() {
    document.getElementById("recTitle").value = "";
    document.getElementById("buyPrice").value = "";
    document.getElementById("stopLoss").value = "";
}

function loadRecommendations(role) {
    const recList = document.getElementById("recList");
    recList.innerHTML = "";
    recommendations.forEach((rec, index) => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("recommendation");
        recDiv.innerHTML = `
            <h3>${rec.title}</h3>
            <p>Buy Price: ₹${rec.buyPrice}</p>
            <p>Stop Loss: ₹${rec.stopLoss}</p>
            ${rec.targets.map((target, i) => `<p>Target ${i + 1}: ₹${target}</p>`).join("")}
        `;
        if (role === "Client") {
            recDiv.innerHTML += `
                <div class="reaction">
                    <button onclick="toggleReaction(${index}, 'like')" class="${reactions[index] === 'like' ? 'liked' : ''}">Like</button>
                    <button onclick="toggleReaction(${index}, 'dislike')" class="${reactions[index] === 'dislike' ? 'disliked' : ''}">Dislike</button>
                </div>
            `;
        }
        recList.appendChild(recDiv);
    });
}

function toggleReaction(index, reactionType) {
    reactions[index] = reactions[index] === reactionType ? null : reactionType;
    loadRecommendations("Client");
}

// Check remembered session on page load
checkRememberedSession();
