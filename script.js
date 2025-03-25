// script.js

document.addEventListener("DOMContentLoaded", function () {
    const users = {
        "admin": { password: "admin123", role: "Admin" },
        "analyst": { password: "analyst123", role: "Analyst" },
        "client": { password: "client123", role: "Client" }
    };
    let recommendations = [];
    let currentUser = null;

    function login() {
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("errorMessage");

        if (users[username] && users[username].password === password) {
            currentUser = { username, role: users[username].role };
            document.body.setAttribute("data-role", currentUser.role);
            showDashboard(currentUser.role);
        } else {
            errorMessage.style.display = "block";
        }
    }

    function showDashboard(role) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("welcomeMessage").textContent = `Welcome, ${role}!`;
        if (role === "Admin" || role === "Analyst") {
            document.getElementById("adminPanel").style.display = "block";
        }
        loadRecommendations();
    }

    document.getElementById("submitLogin").addEventListener("click", login);

    document.getElementById("addTargetBtn").addEventListener("click", function () {
        const targetContainer = document.getElementById("targetContainer");
        const targetCount = targetContainer.getElementsByTagName("input").length + 1;

        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = `Target ${targetCount}`;
        input.className = "target-field";
        input.required = true;
        
        targetContainer.appendChild(input);
    });

    document.getElementById("addRecBtn").addEventListener("click", function () {
        const title = document.getElementById("recTitle").value.trim();
        const buyPrice = document.getElementById("buyPrice").value.trim();
        const stopLoss = document.getElementById("stopLoss").value.trim();
        const targetFields = document.querySelectorAll(".target-field");

        if (!title || !buyPrice || !stopLoss || targetFields.length === 0) {
            alert("All fields are required, including at least one target!");
            return;
        }

        let targets = [];
        targetFields.forEach(field => targets.push(field.value.trim()));

        let recommendation = {
            id: Date.now(),
            title,
            buyPrice,
            stopLoss,
            targets,
            addedBy: currentUser.role
        };

        recommendations.push(recommendation);
        loadRecommendations();
    });

    function loadRecommendations() {
        const recList = document.getElementById("recList");
        recList.innerHTML = "";
        recommendations.forEach((rec, index) => {
            const recDiv = document.createElement("div");
            recDiv.classList.add("recommendation");
            recDiv.innerHTML = `
                <h3>${rec.title}</h3>
                <p>Buy Price: ${rec.buyPrice}</p>
                <p>Stop Loss: ${rec.stopLoss}</p>
                <p>Targets: ${rec.targets.join(", ")}</p>
            `;

            if (currentUser.role === "Admin" || (currentUser.role === "Analyst" && rec.addedBy === "Analyst")) {
                const editBtn = document.createElement("button");
                editBtn.innerText = "Edit";
                editBtn.onclick = () => editRecommendation(index);
                recDiv.appendChild(editBtn);

                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Delete";
                deleteBtn.onclick = () => deleteRecommendation(index);
                recDiv.appendChild(deleteBtn);
            }
            
            recList.appendChild(recDiv);
        });
    }

    window.editRecommendation = function (index) {
        let rec = recommendations[index];
        document.getElementById("recTitle").value = rec.title;
        document.getElementById("buyPrice").value = rec.buyPrice;
        document.getElementById("stopLoss").value = rec.stopLoss;
        document.getElementById("targetContainer").innerHTML = "";
        rec.targets.forEach((target, i) => {
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = `Target ${i + 1}`;
            input.className = "target-field";
            input.value = target;
            document.getElementById("targetContainer").appendChild(input);
        });
        recommendations.splice(index, 1);
        loadRecommendations();
    };

    window.deleteRecommendation = function (index) {
        recommendations.splice(index, 1);
        loadRecommendations();
    };
});
