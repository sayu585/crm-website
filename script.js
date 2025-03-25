document.addEventListener("DOMContentLoaded", function () {
    const users = {
        "admin": { password: "admin123", role: "Admin" },
        "analyst": { password: "analyst123", role: "Analyst" },
        "client": { password: "client123", role: "Client" }
    };

    let recommendations = [];
    let currentUser = null;

    function showDashboard(role) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("welcomeMessage").textContent = `Welcome ${role}!`;
        if (role === "Admin" || role === "Analyst") {
            document.getElementById("adminPanel").style.display = "block";
        }
        loadRecommendations();
    }

    document.getElementById('submitLogin').addEventListener('click', function () {
        let username = document.getElementById("username").value.trim().toLowerCase();
        let password = document.getElementById("password").value.trim();
        if (users[username] && users[username].password === password) {
            currentUser = { username, role: users[username].role };
            showDashboard(currentUser.role);
        } else {
            document.getElementById("errorMessage").style.display = "block";
        }
    });

    document.getElementById("addTargetBtn").addEventListener("click", function () {
        const targetsContainer = document.getElementById("targetsContainer");
        const targetCount = targetsContainer.children.length + 1;
        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = `Target ${targetCount}`;
        input.required = true;
        targetsContainer.appendChild(input);
    });

    document.getElementById("addRecommendationBtn").addEventListener("click", function () {
        const title = document.getElementById("recTitle").value;
        const buyPrice = document.getElementById("buyPrice").value;
        const stopLoss = document.getElementById("stopLoss").value;
        const targetInputs = document.querySelectorAll("#targetsContainer input");
        const targets = Array.from(targetInputs).map(input => input.value);

        if (title && buyPrice && stopLoss && targets.every(t => t)) {
            const newRec = { id: Date.now(), title, buyPrice, stopLoss, targets, createdBy: currentUser.username };
            recommendations.push(newRec);
            loadRecommendations();
        }
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
                ${rec.targets.map((t, i) => `<p>Target ${i + 1}: ${t}</p>`).join('')}
            `;
            if (currentUser.role === "Admin" || (currentUser.role === "Analyst" && currentUser.username === rec.createdBy)) {
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
        if (rec) {
            document.getElementById("recTitle").value = rec.title;
            document.getElementById("buyPrice").value = rec.buyPrice;
            document.getElementById("stopLoss").value = rec.stopLoss;
            
            const targetsContainer = document.getElementById("targetsContainer");
            targetsContainer.innerHTML = "";
            rec.targets.forEach((target, index) => {
                const input = document.createElement("input");
                input.type = "number";
                input.value = target;
                input.placeholder = `Target ${index + 1}`;
                input.required = true;
                targetsContainer.appendChild(input);
            });
            
            document.getElementById("addRecommendationBtn").textContent = "Update Recommendation";
            document.getElementById("addRecommendationBtn").onclick = function () {
                updateRecommendation(id);
            };
        }
    }

    function updateRecommendation(id) {
        const rec = recommendations.find(r => r.id === id);
        if (rec) {
            rec.title = document.getElementById("recTitle").value;
            rec.buyPrice = document.getElementById("buyPrice").value;
            rec.stopLoss = document.getElementById("stopLoss").value;
            rec.targets = Array.from(document.querySelectorAll("#targetsContainer input")).map(input => input.value);
            loadRecommendations();
            document.getElementById("addRecommendationBtn").textContent = "Add Recommendation";
            document.getElementById("addRecommendationBtn").onclick = function () {
                addRecommendation();
            };
        }
    }

    function deleteRecommendation(id) {
        recommendations = recommendations.filter(r => r.id !== id);
        loadRecommendations();
    }
});
