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
        alert("PDF library not loaded!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
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

    // ✅ INCOME TABLE
    doc.autoTable({
        startY: 20,
        head: [["Income Description", "Amount"]],
        body: incomeData,
        theme: "grid",
        headStyles: { fillColor: [52, 120, 170] }
    });

    // ✅ EXPENSE TABLE
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Expense Description", "Amount"]],
        body: expenseData,
        theme: "grid",
        headStyles: { fillColor: [52, 120, 170] }
    });

    let y = doc.lastAutoTable.finalY + 15;

    // ✅ TOTALS (clean spacing — no bug)
    doc.setFontSize(14);

    doc.text("Total Income: " + income, 14, y);
    y += 10;

    doc.text("Total Expense: " + expense, 14, y);
    y += 10;

    doc.text("Balance: " + (income - expense), 14, y);

    doc.save("Smart_Budget_Report.pdf");
}
