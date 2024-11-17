const expenseForm = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense-input");
const expenseAmount = document.getElementById("expense-amount");
const amountInput = document.getElementById("amount-input");
const categoryInput = document.getElementById("category-input");
const transactionList = document.getElementById("transaction-history");
const totalExpense = document.getElementById("total-expense");
const totalIncome = document.getElementById("total-income");
const balance = document.getElementById("balance");

// Add Expense
function addExpense() {
  const description = expenseInput.value.trim();
  const amount = parseFloat(expenseAmount.value.trim());
  console.log("🚀 ~ addExpense ~ amount:", amount);
  const category = categoryInput.value;

  if (description === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid expense description and amount.");
    return;
  }

  addTransaction(description, amount, category, "Expense");
  updateSummary();
  clearInput();
}

// Add Income
function addIncome() {
  const description = document
    .getElementById("income-description")
    .value.trim();
  const amount = parseFloat(amountInput.value.trim());

  if (description === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid income description and amount.");
    return;
  }

  addTransaction(description, amount, "Income", "Income");
  showNotification("Transaction added successfully!");
  updateSummary();
  clearInput();
}

// Add Transaction
function addTransaction(description, amount, category, type) {
  const transaction = {
    description: description,
    amount: amount,
    category: category,
    type: type,
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  const transactionRow = document.createElement("tr");

  transactionRow.innerHTML = `
    <td>${description}</td>
    <td>${category}</td>
    <td>${amount.toFixed(2)}</td>
    <td>${type}</td>
    <td><button class="delete-button">Delete</button></td>
  `;

  // Add delete functionality
  transactionRow
    .querySelector(".delete-button")
    .addEventListener("click", () => {
      transactionRow.remove();
      removeTransaction(transaction);
      updateSummary();
    });

  transactionList.appendChild(transactionRow);
}

// Update Summary
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  const transactions = transactionList.querySelectorAll("tr");
  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.children[2].textContent);
    const type = transaction.children[3].textContent;

    if (type === "Income") {
      totalIncomes += amount;
    } else {
      totalExpenses += amount;
    }
  });

  totalExpense.textContent = totalExpenses.toFixed(2);
  totalIncome.textContent = totalIncomes.toFixed(2);
  balance.textContent = (totalIncomes - totalExpenses).toFixed(2);

  const currentBalance = totalIncomes - totalExpenses;
  balance.textContent = currentBalance.toFixed(2);

  //Apply positive/negative class
  if (currentBalance >= 0) {
    balance.classList.remove("negative");
    balance.classList.add("positive");
  } else {
    balance.classList.remove("positive");
    balance.classList.add("negative");
  }
}

// Clear Input Fields
function clearInput() {
  expenseInput.value = "";
  amountInput.value = "";
  categoryInput.value = "groceries";
  document.getElementById("income-description").value = "";
}

// Clear All Transactions
function clearAll() {
  transactionList.innerHTML = "";
  updateSummary();
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");

  setTimeout(function () {
    notification.classList.add("hidden");
  }, 2000);
}

function removeTransaction(transactionRemove) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions = transactions.filter(function (transaction) {
    return !(
      transaction.description === transactionRemove.description &&
      transaction.amount === transactionRemove.amount &&
      transaction.category === transactionRemove.category
    );
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions.forEach(function (transacion) {
    addTransaction(
      transacion.description,
      transacion.amount,
      transacion.category,
      transacion.type
    );
  });

  updateSummary();
}

window.addEventListener("load", loadTransactions);

window.addEventListener("load", function () {
  expenseInput.focus();
});
