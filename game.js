const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const filter = document.getElementById("filter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const exp = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0);

  balance.textContent = `₹${total}`;
  income.textContent = `₹${inc}`;
  expense.textContent = `₹${Math.abs(exp)}`;
}

function renderTransactions(type = "all") {
  list.innerHTML = "";

  transactions
    .filter(t => {
      if (type === "income") return t.amount > 0;
      if (type === "expense") return t.amount < 0;
      return true;
    })
    .forEach(t => {
      const item = document.createElement("li");
      item.classList.add(t.amount > 0 ? "plus" : "minus");

      item.innerHTML = `
        <div>
          <strong>${t.text}</strong>
          <small>(${t.category}) - ${t.date}</small>
        </div>
        <div>
          ${t.amount > 0 ? "+" : "-"}₹${Math.abs(t.amount)}
          <span class="delete-btn" onclick="removeTransaction(${t.id})">✖</span>
        </div>
      `;

      list.appendChild(item);
    });
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function init() {
  renderTransactions(filter.value);
  updateValues();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", addTransaction);
filter.addEventListener("change", () => renderTransactions(filter.value));

init();
