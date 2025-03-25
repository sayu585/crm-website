const users = {
    "admin": { password: "admin123", role: "Admin" },
    "analyst": { password: "analyst123", role: "Analyst" },
    "client": { password: "client123", role: "Client" }
};

let recommendations = [];
let currentUser = null;

function toggleSettings() {
    const menu = document.getElementById("settingsMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function logout() {
    currentUser = null;
    location.reload();
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
        currentUser = { username, role: users[username].role };
        showDashboard(currentUser.role);
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});

function addTargetField() {
    const targetContainer = document.getElementById("targetContainer");
    const targetCount = targetContainer.getElementsByTagName("input").length + 1;
    
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = `Target ${targetCount}`;
    input.className = "target-field";
    targetContainer.appendChild(input);
}

document.getElementById("addTargetBtn").addEventListener("click", addTargetField);

document.getElementById("addRecBtn").addEventListener("click", function() {
    const title = document.getElementById("recTitle").value;
    const buyPrice = document.getElementById("buyPrice").value;
    const stopLoss = document.getElementById("stopLoss").value;
    const targetFields = document.querySelectorAll(".target-field");
    
    if (!title || !buyPrice || !stopLoss) {
        alert("All fields are required!");
        return;
    }
    
    let targets = [];
    targetFields.forEach(field => targets.push(field.value));
    
    let recommendation = {
        id: Date.now(),
        title,
        buyPrice,
        stopLoss,
        targets,
        author: currentUser.username
    };
    
    recommendations.push(recommendation);
    loadRecommendations();
});

function loadRecommendations() {
    const recList = document.getElementById("recList");
    recList.innerHTML = "";
    
    recommendations.forEach(rec => {
        const recDiv = document.createElement("div");
        recDiv.classList.add("recommendation");
        
        recDiv.innerHTML = `
            <h3>${rec.title}</h3>
            <p>Buy Price: ${rec.buyPrice}</p>
            <p>Stop Loss: ${rec.stopLoss}</p>
            ${rec.targets.map((t, i) => `<p>Target ${i + 1}: ${t}</p>`).join("")}
        `;
        
        if (currentUser.role === "Admin" || (currentUser.role === "Analyst" && currentUser.username === rec.author)) {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => editRecommendation(rec.id);
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => deleteRecommendation(rec.id);
            
            recDiv.appendChild(editBtn);
            recDiv.appendChild(deleteBtn);
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
    
    document.getElementById("targetContainer").innerHTML = "";
    rec.targets.forEach((t, i) => {
        const input = document.createElement("input");
        input.type = "number";
        input.value = t;
        input.className = "target-field";
        input.placeholder = `Target ${i + 1}`;
        document.getElementById("targetContainer").appendChild(input);
    });
    
    deleteRecommendation(id);
}

function deleteRecommendation(id) {
    recommendations = recommendations.filter(rec => rec.id !== id);
    loadRecommendations();
}

// Load dashboard if user is already logged in
if (currentUser) {
    showDashboard(currentUser.role);
}
