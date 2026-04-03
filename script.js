let transactions = [];

function startApp() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
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

    updateUI();
}

function updateUI() {

    let list = document.getElementById("list");
    list.innerHTML = "";

    let balance = 0;

    transactions.forEach((t) => {
        let li = document.createElement("li");
        li.innerText = t.desc + " : ₹" + Math.abs(t.amount);
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

function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Smart Budget Report", 70, 10);

    let incomeData = [];
    let expenseData = [];

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
        if (t.amount > 0) {
            incomeData.push([t.desc, t.amount]);
            income += t.amount;
        } else {
            expenseData.push([t.desc, Math.abs(t.amount)]);
            expense += Math.abs(t.amount);
        }
    });

    doc.text("Income", 14, 20);
    doc.autoTable({
        startY: 25,
        head: [["Description", "Amount"]],
        body: incomeData
    });

    doc.text("Expense", 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [["Description", "Amount"]],
        body: expenseData
    });

    let y = doc.lastAutoTable.finalY + 10;

    doc.text("Total Income: ₹" + income, 14, y);
    doc.text("Total Expense: ₹" + expense, 14, y + 10);
    doc.text("Balance: ₹" + (income - expense), 14, y + 20);

    doc.save("Budget_Report.pdf");
}
