let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function startApp() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    updateUI();
}

function addTransaction() {

    let desc = document.getElementById("desc").value;
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;

    if (desc === "" || amount === "") {
        alert("Enter details");
        return;
    }

    amount = parseInt(amount);

    if (type === "expense") {
        amount = -amount;
    }

    transactions.push({ desc, amount });

    saveData();
    updateUI();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {

    let list = document.getElementById("list");
    list.innerHTML = "";

    let balance = 0;

    transactions.forEach((t, index) => {

        let li = document.createElement("li");

        li.innerHTML = `
            ${t.desc} : ₹${Math.abs(t.amount)}
            <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
        `;

        list.appendChild(li);

        balance += t.amount;
    });

    document.getElementById("balance").innerText = balance;

    let advice = document.getElementById("advice");

    if (balance < 0) {
        advice.innerText = "⚠️ You are overspending!\nNote: Try to save more money.";
    } else if (balance < 1000) {
        advice.innerText = "💡 Try to save more money.";
    } else {
        advice.innerText = "✅ Good financial condition!";
    }
}
