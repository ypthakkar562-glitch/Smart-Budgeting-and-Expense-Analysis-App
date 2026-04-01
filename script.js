let transactions = [];

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

    updateUI();
}

function updateUI() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    let balance = 0;

    transactions.forEach((t) => {
        let li = document.createElement("li");
        li.innerText = t.desc + " : ₹" + t.amount;
        list.appendChild(li);

        balance += t.amount;
    });

    document.getElementById("balance").innerText = balance;

    // AI Advice
    let advice = document.getElementById("advice");

    if (balance < 0) {
        advice.innerText = "⚠️ You are overspending!";
    } else if (balance < 1000) {
        advice.innerText = "💡 Try to save more money.";
    } else {
        advice.innerText = "✅ Good financial condition!";
    }
}
function startApp() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
}
