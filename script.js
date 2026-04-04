let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function startApp() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    updateUI();
}

function addTransaction() {

    let desc = document.getElementById("desc").value.trim();
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;

    if (desc === "" || amount === "") {
        alert("Enter details");
        return;
    }

    amount = parseInt(amount);

    if (isNaN(amount)) {
        alert("Enter valid amount");
        return;
    }

    if (type === "expense") {
        amount = -amount;
    }

    transactions.push({ desc, amount });

    saveData();
    updateUI();

    // Clear inputs
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
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
            ${t.desc} : Rs.${Math.abs(t.amount)}
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

// 🔥 FINAL WORKING PDF FUNCTION (NO ERROR VERSION)
function downloadPDF() {

    if (!window.jspdf) {
        alert("PDF library not loaded. Check CDN.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Smart Budget Report", 20, 15);

    let y = 30;

    let income = 0;
    let expense = 0;

    doc.setFontSize(12);

    transactions.forEach((t) => {

        let text = (t.amount > 0 ? "Income: " : "Expense: ") +
                   t.desc + " Rs." + Math.abs(t.amount);

        doc.text(text, 20, y);
        y += 10;

        if (t.amount > 0) {
            income += t.amount;
        } else {
            expense += Math.abs(t.amount);
        }
    });

    y += 10;

    doc.text("Total Income: Rs. " + income, 20, y);
    y += 10;

    doc.text("Total Expense: Rs. " + expense, 20, y);
    y += 10;

    doc.text("Balance: Rs. " + (income - expense), 20, y);

    doc.save("Budget_Report.pdf");
}
