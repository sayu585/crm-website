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
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload();
}

function loadLogin() {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) {
        showDashboard(savedUser.role);
    }
}

function showDashboard(role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;
    if (role === "Admin" || role === "Analyst") {
        document.getElementById("adminPanel").style.display = "block";
    }
    loadRecommendations();
}

document.getElementById('submitLogin').addEventListener('click', function() {
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();
    if (users[username] && users[username].password === password) {
        showDashboard(users[username].role);
        if (document.getElementById("rememberMe").checked) {
            localStorage.setItem("loggedInUser", JSON.stringify({ username, role: users[username].role }));
        }
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

function addRecommendation() {
    const title = document.getElementById("recTitle").value;
    const details = document.getElementById("recDetails").value;
    if (title && details) {
        recommendations.push({ title, details });
        localStorage.setItem("recommendations", JSON.stringify(recommendations));
        loadRecommendations();
        document.getElementById("recTitle").value = "";
        document.getElementById("recDetails").value = "";
    }
}

function loadRecommendations() {
    const recList = document.getElementById("recList");
    recList.innerHTML = "";
    recommendations = JSON.parse(localStorage.getItem("recommendations")) || [];
    recommendations.forEach((rec, index) => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("recommendation");
        recDiv.innerHTML = `<h3>${rec.title}</h3><p>${rec.details}</p>`;
        recList.appendChild(recDiv);
    });
}

loadLogin();
