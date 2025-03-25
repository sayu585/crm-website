function addTarget() {
    let targetContainer = document.getElementById("targets");
    let targetCount = targetContainer.getElementsByClassName("targetPrice").length + 1;
    
    let input = document.createElement("input");
    input.type = "number";
    input.className = "targetPrice";
    input.placeholder = `Target ${targetCount}`;
    input.required = true;
    input.setAttribute("data-index", targetCount);
    
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
        input.setAttribute("data-index", index + 1);
        targetsContainer.appendChild(input);
    });

    deleteRecommendation(id);
}
``
