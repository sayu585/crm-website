const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let recommendations = [];
let tempTargets = [{ id: 1, value: "" }]; // Default Target 1
let reactions = {};
let sessionUser = null; // In-memory session management
let rememberMe = false; // Tracks "Keep Me Signed In" state

// Handle login button click
document.getElementById('submitLogin').addEventListener('click', function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    rememberMe = document.getElementById("rememberMe").checked; // Check if "Keep Me Signed In" is selected

    if (users[username] && users[username].password === password) {
        sessionUser = { username, role: users[username].role }; // Store user in memory
        showDashboard(sessionUser.role);
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

// Automatically log in if "Keep Me Signed In" is active
if (rememberMe && sessionUser) {
    showDashboard(sessionUser.role);
}

function showDashboard(role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;

    if (role === "Admin" || role === "Analyst") {
        document.getElementById("adminPanel").style.display = "block";
        initializeTargets(); // Initialize Target 1 by default
    } else {
        document.getElementById("adminPanel").style.display = "none";
    }
}

// Initialize default targets
function initializeTargets() {
    const targetsContainer = document.getElementById("targetsContainer");
    targetsContainer.innerHTML = ""; // Clear previous targets
    tempTargets.forEach(target => {
        const targetField = document.createElement("input");
        targetField.type = "number";
        targetField.placeholder = `Target ${target.id}`;
        targetField.className = "target-field";
        targetField.value = target.value; // Retain value if reloaded
        targetField.oninput = (e) => target.value = e.target.value; // Update value on input
        targetsContainer.appendChild(targetField);
    });
}

// Add a new target dynamically
function addTarget() {
    const newTargetId = tempTargets.length + 1;
    tempTargets.push({ id: newTargetId, value: "" });
    initializeTargets();
}

// Add a recommendation
function addRecommendation() {
    const title = document.getElementById("recTitle").value.trim();
    const buyPrice = document.getElementById("buyPrice").value.trim();
    const stopLoss = document.getElementById("stopLoss").value.trim();
    const targets = tempTargets.map(target => target.value.trim()).filter(Boolean);

    if (!title || !buyPrice || !stopLoss || targets.length === 0) {
        alert("Please fill in all fields, including price fields and at least one target.");
        return;
    }

    recommendations.push({ title, buyPrice, stopLoss, targets });
    tempTargets = [{ id: 1, value: "" }]; // Reset to default Target 1
    initializeTargets();
    clearInputs();
    loadRecommendations(sessionUser.role); // Reload recommendations
}

// Clear input fields
function clearInputs() {
    document.getElementById("recTitle").value = "";
    document.getElementById("buyPrice").value = "";
    document.getElementById("stopLoss").value = "";
}

// Load recommendations dynamically
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

// Toggle reaction (Like/Dislike)
function toggleReaction(index, reactionType) {
    reactions[index] = reactions[index] === reactionType ? null : reactionType;
    loadRecommendations("Client");
}

// Settings Button Toggle
document.getElementById('settingsButton').addEventListener('click', function () {
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});

// Logout Button
document.getElementById('logoutButton').addEventListener('click', function () {
    sessionUser = null;
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
});
