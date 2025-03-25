const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let sessionUser = null;

document.getElementById('submitLogin').addEventListener('click', function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (users[username] && users[username].password === password) {
        sessionUser = { username, role: users[username].role };
        showDashboard(sessionUser.role);
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

function showDashboard(role) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;

    if (role === "Admin" || role === "Analyst") {
        document.getElementById("adminPanel").style.display = "block";
    } else {
        document.getElementById("adminPanel").style.display = "none";
    }
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
