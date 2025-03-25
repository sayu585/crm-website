document.addEventListener("DOMContentLoaded", () => {
    const users = {
        "admin": { password: "admin123", role: "Admin" },
        "analyst": { password: "analyst123", role: "Analyst" },
        "client": { password: "client123", role: "Client" }
    };

    let recommendations = [];
    let loggedInUser = null;

    function toggleSettings() {
        const menu = document.getElementById("settingsMenu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    function logout() {
        loggedInUser = null;
        location.reload();
    }

    function showDashboard(user) {
        loggedInUser = user;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("welcomeMessage").textContent = `Welcome ${user.role}!`;

        if (user.role === "Admin" || user.role === "Analyst") {
            document.getElementById("adminPanel").style.display = "block";
        }

        loadRecommendations();
    }

    document.getElementById("submitLogin").addEventListener("click", () => {
        let username = document.getElementById("username").value.trim().toLowerCase();
        let password = document.getElementById("password").value.trim();

        if (users[username] && users[username].password === password) {
            showDashboard({ username, role: users[username].role });
        } else {
            document.getElementById("errorMessage").style.display = "block";
        }
    });

    function addRecommendation() {
        const title = document.getElementById("recTitle").value.trim();
        const buyPrice = document.getElementById("buyPrice").value.trim();
        const stopLoss = document.getElementById("stopLoss").value.trim();
        const targets = Array.from(document.querySelectorAll(".target-input"))
            .map(input => input.value.trim())
            .filter(value => value !== "");

        if (!title || !buyPrice || !stopLoss || targets.length === 0) {
            alert("All fields are required, including at least one target!");
            return;
        }

        const newRec = {
            id: Date.now(),
            title,
            buyPrice,
            stopLoss,
            targets,
            createdBy: loggedInUser.username
        };

        recommendations.push(newRec);
        loadRecommendations();
        document.getElementById("recForm").reset();
        document.getElementById("targetContainer").innerHTML = "";
    }

    function loadRecommendations() {
        const recList = document.getElementById("recList");
        recList.innerHTML = "";

        recommendations.forEach(rec => {
            const recDiv = document.createElement("div");
            recDiv.classList.add("recommendation");
            recDiv.innerHTML = `
                <h3>${rec.title}</h3>
                <p><strong>Buy Price:</strong> ${rec.buyPrice}</p>
                <p><strong>Stop Loss:</strong> ${rec.stopLoss}</p>
                ${rec.targets.map((target, index) => `<p><strong>Target ${index + 1}:</strong> ${target}</p>`).join("")}
            `;

            if (loggedInUser.role === "Admin" || (loggedInUser.role === "Analyst" && loggedInUser.username === rec.createdBy)) {
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("edit-btn");
                editBtn.onclick = () => editRecommendation(rec.id);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("delete-btn");
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
        rec.targets.forEach((target, index) => {
            addTargetField(target, index + 1);
        });

        deleteRecommendation(id);
    }

    function deleteRecommendation(id) {
        recommendations = recommendations.filter(rec => rec.id !== id);
        loadRecommendations();
    }

    function addTargetField(value = "", index = null) {
        const targetContainer = document.getElementById("targetContainer");
        const targetIndex = index || document.querySelectorAll(".target-input").length + 1;

        const div = document.createElement("div");
        div.classList.add("target-field");
        div.innerHTML = `
            <input type="text" class="target-input" placeholder="Target ${targetIndex}" value="${value}">
        `;

        targetContainer.appendChild(div);
    }

    document.getElementById("addTargetBtn").addEventListener("click", () => addTargetField());
    document.getElementById("addRecBtn").addEventListener("click", addRecommendation);
});
