// Data storage
let data = {
    income: [],
    expenses: []
};

const USD_TO_ZAR = 18.50;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;
    
    updateOverview();
    updateMonthlyView();
});

// Format currency
function formatCurrency(amount, currency = 'ZAR') {
    const symbol = currency === 'USD' ? '$' : 'R';
    return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Convert currency
function convertToZAR(amount, currency) {
    return currency === 'USD' ? amount * USD_TO_ZAR : amount;
}

// Update overview metrics
function updateOverview() {
    const totalIncome = data.income.reduce((sum, item) => sum + item.amountZAR, 0);
    const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amountZAR, 0);
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('netIncome').textContent = formatCurrency(netIncome);
    document.getElementById('savingsRate').textContent = savingsRate.toFixed(1) + '%';

    document.getElementById('incomeChange').textContent = `${data.income.length} entries`;
    document.getElementById('expenseChange').textContent = `${data.expenses.length} entries`;

    // Update net income styling
    const netElement = document.getElementById('netIncome');
    if (netIncome >= 0) {
        netElement.style.color = 'var(--success)';
    } else {
        netElement.style.color = 'var(--danger)';
    }
}

// Add income
function addIncome() {
    const description = document.getElementById('incomeDescription').value.trim();
    const date = document.getElementById('incomeDate').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const currency = document.getElementById('incomeCurrency').value;

    if (!description || !date || isNaN(amount) || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }

    const income = {
        id: Date.now(),
        description,
        date,
        amount,
        currency,
        amountZAR: convertToZAR(amount, currency)
    };

    data.income.push(income);
    
    // Clear form
    document.getElementById('incomeDescription').value = '';
    document.getElementById('incomeAmount').value = '';
    
    updateOverview();
    updateIncomeList();
    updateAnalytics();
}

// Add expense
function addExpense() {
    const description = document.getElementById('expenseDescription').value.trim();
    const category = document.getElementById('expenseCategory').value.trim();
    const type = document.getElementById('expenseType').value;
    const notes = document.getElementById('expenseNotes').value.trim();
    const date = document.getElementById('expenseDate').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const currency = document.getElementById('expenseCurrency').value;

    if (!description || !category || !date || isNaN(amount) || amount <= 0) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    const expense = {
        id: Date.now(),
        description,
        category,
        type,
        notes,
        date,
        amount,
        currency,
        amountZAR: convertToZAR(amount, currency)
    };

    data.expenses.push(expense);
    
    // Clear form
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseNotes').value = '';
    document.getElementById('expenseType').value = 'Once-off';
    
    updateOverview();
    updateExpensesList();
    updateAnalytics();
    updateExpenseTable();
}

// Delete income
function deleteIncome(id) {
    if (confirm('Delete this income entry?')) {
        data.income = data.income.filter(item => item.id !== id);
        updateOverview();
        updateIncomeList();
        updateAnalytics();
    }
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Delete this expense entry?')) {
        data.expenses = data.expenses.filter(item => item.id !== id);
        updateOverview();
        updateExpensesList();
        updateAnalytics();
    }
}

// Update income list
function updateIncomeList() {
    const incomeList = document.getElementById('incomeList');

    if (data.income.length === 0) {
        incomeList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💰</div>
                <p>No income entries yet. Add your first income to get started!</p>
            </div>
        `;
        return;
    }

    const sortedIncome = [...data.income].sort((a, b) => new Date(b.date) - new Date(a.date));

    incomeList.innerHTML = sortedIncome.map(income => {
        const displayAmount = income.currency === 'USD' 
            ? `<div class="amount-primary">${formatCurrency(income.amountZAR)}</div>
               <div class="amount-secondary">${formatCurrency(income.amount, 'USD')}</div>`
            : `<div class="amount-primary">${formatCurrency(income.amount)}</div>`;

        return `
            <div class="entry-item">
                <div class="entry-info">
                    <div class="entry-icon" style="background: #10b98120; color: #10b981;">
                        💰
                    </div>
                    <div class="entry-details">
                        <div class="entry-name">${income.description}</div>
                        <div class="entry-meta">${new Date(income.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="entry-amount">
                    ${displayAmount}
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteIncome(${income.id})">Delete</button>
            </div>
        `;
    }).join('');
}

// Update expenses list
function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');

    if (data.expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💸</div>
                <p>No expense entries yet. Add your first expense to start tracking!</p>
            </div>
        `;
        return;
    }

    const sortedExpenses = [...data.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    expensesList.innerHTML = sortedExpenses.map(expense => {
        const displayAmount = expense.currency === 'USD' 
            ? `<div class="amount-primary">${formatCurrency(expense.amountZAR)}</div>
               <div class="amount-secondary">${formatCurrency(expense.amount, 'USD')}</div>`
            : `<div class="amount-primary">${formatCurrency(expense.amount)}</div>`;

        return `
            <div class="entry-item">
                <div class="entry-info">
                    <div class="entry-icon" style="background: #ef444420; color: #ef4444;">
                        💸
                    </div>
                    <div class="entry-details">
                        <div class="entry-name">${expense.description}</div>
                        <div class="entry-meta">${expense.category} • ${new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="entry-amount">
                    ${displayAmount}
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
    }).join('');
}

// Update analytics with charts
function updateAnalytics() {
    updateCategoryBreakdown();
    updateIncomeBreakdown();
    updateExpenseChart();
    updateIncomeChart();
}

// Update category breakdown
function updateCategoryBreakdown() {
    const categoryBreakdown = document.getElementById('categoryBreakdown');
    
    if (data.expenses.length === 0) {
        categoryBreakdown.innerHTML = '<div class="empty-state"><p>Add expenses to see breakdown</p></div>';
        return;
    }

    // Group expenses by category
    const categoryTotals = {};
    data.expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amountZAR;
    });

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount], index) => ({
            category,
            amount,
            percentage: (amount / totalExpenses * 100).toFixed(1),
            color: colors[index % colors.length]
        }));

    categoryBreakdown.innerHTML = sortedCategories.map(item => `
        <div class="category-item">
            <div class="category-info">
                <div class="category-dot" style="background: ${item.color}"></div>
                <span>${item.category}</span>
            </div>
            <div>
                <span class="category-amount">${formatCurrency(item.amount)}</span>
                <span class="category-percentage">${item.percentage}%</span>
            </div>
        </div>
    `).join('');
}

// Update income breakdown
function updateIncomeBreakdown() {
    const incomeBreakdown = document.getElementById('incomeBreakdown');
    
    if (data.income.length === 0) {
        incomeBreakdown.innerHTML = '<div class="empty-state"><p>Add income to see breakdown</p></div>';
        return;
    }

    // Group income by description
    const incomeSources = {};
    data.income.forEach(income => {
        if (!incomeSources[income.description]) {
            incomeSources[income.description] = {
                total: 0,
                count: 0
            };
        }
        incomeSources[income.description].total += income.amountZAR;
        incomeSources[income.description].count++;
    });

    const totalIncome = Object.values(incomeSources).reduce((sum, source) => sum + source.total, 0);
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

    const sortedSources = Object.entries(incomeSources)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([source, data], index) => ({
            source,
            total: data.total,
            count: data.count,
            percentage: (data.total / totalIncome * 100).toFixed(1),
            color: colors[index % colors.length]
        }));

    incomeBreakdown.innerHTML = sortedSources.map(item => `
        <div class="category-item">
            <div class="category-info">
                <div class="category-dot" style="background: ${item.color}"></div>
                <span>${item.source}</span>
            </div>
            <div>
                <span class="category-amount">${formatCurrency(item.total)}</span>
                <span class="category-percentage">${item.percentage}%</span>
            </div>
        </div>
    `).join('');
}

// Update table with expense details
function updateExpenseTable() {
    const tableBody = document.querySelector('#expenseTable tbody');
    tableBody.innerHTML = '';

    if (data.expenses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888; padding:2rem;">No expenses recorded yet.</td></tr>`;
        return;
    }

    data.expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td><span class="badge badge-category">${expense.category}</span></td>
            <td><span class="badge badge-type badge-type-${expense.type.replace(/[^a-zA-Z]/g, '').toLowerCase()}">${expense.type}</span></td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${expense.currency}</td>
            <td>${expense.notes ? `<span class="notes">${expense.notes}</span>` : ''}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update monthly overview with more details
function updateMonthlyOverview() {
    const monthlyOverview = document.getElementById('monthlyOverview');
    const monthlyData = {};

    // Process expenses
    data.expenses.forEach(expense => {
        const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) {
            monthlyData[month] = {
                expenses: 0,
                income: 0,
                categories: {},
                topExpense: { amount: 0, description: '' },
                topIncome: { amount: 0, description: '' }
            };
        }
        monthlyData[month].expenses += expense.amountZAR;
        
        // Track categories
        if (!monthlyData[month].categories[expense.category]) {
            monthlyData[month].categories[expense.category] = 0;
        }
        monthlyData[month].categories[expense.category] += expense.amountZAR;

        // Track top expense
        if (expense.amountZAR > monthlyData[month].topExpense.amount) {
            monthlyData[month].topExpense = {
                amount: expense.amountZAR,
                description: expense.description
            };
        }
    });

    // Process income
    data.income.forEach(income => {
        const month = new Date(income.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) {
            monthlyData[month] = {
                expenses: 0,
                income: 0,
                categories: {},
                topExpense: { amount: 0, description: '' },
                topIncome: { amount: 0, description: '' }
            };
        }
        monthlyData[month].income += income.amountZAR;

        // Track top income
        if (income.amountZAR > monthlyData[month].topIncome.amount) {
            monthlyData[month].topIncome = {
                amount: income.amountZAR,
                description: income.description
            };
        }
    });

    // Sort months in reverse chronological order
    const sortedMonths = Object.entries(monthlyData)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]));

    let html = '';
    sortedMonths.forEach(([month, data]) => {
        const savings = data.income - data.expenses;
        const savingsRate = data.income > 0 ? (savings / data.income * 100) : 0;
        
        html += `
            <div class="month-card">
                <h4>${month}</h4>
                <div class="month-stats">
                    <div class="stat">
                        <span class="label">Income:</span>
                        <span class="value income">${formatCurrency(data.income)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Expenses:</span>
                        <span class="value expense">${formatCurrency(data.expenses)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Savings:</span>
                        <span class="value ${savings >= 0 ? 'income' : 'expense'}">${formatCurrency(savings)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Savings Rate:</span>
                        <span class="value">${savingsRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="month-details">
                    <div class="detail">
                        <span class="label">Top Expense:</span>
                        <span class="value">${data.topExpense.description} (${formatCurrency(data.topExpense.amount)})</span>
                    </div>
                    <div class="detail">
                        <span class="label">Top Income:</span>
                        <span class="value">${data.topIncome.description} (${formatCurrency(data.topIncome.amount)})</span>
                    </div>
                </div>
                <div class="category-breakdown">
                    <h5>Category Breakdown</h5>
                    ${Object.entries(data.categories)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => `
                            <div class="category-item">
                                <span class="category-name">${category}</span>
                                <span class="category-amount">${formatCurrency(amount)}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    });

    monthlyOverview.innerHTML = html || '<div class="empty-state"><p>No data available</p></div>';
}

// Update expense chart
function updateExpenseChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Group expenses by category
    const categoryData = {};
    data.expenses.forEach(expense => {
        if (!categoryData[expense.category]) {
            categoryData[expense.category] = 0;
        }
        categoryData[expense.category] += expense.amountZAR;
    });

    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}

// Update income chart
function updateIncomeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    
    // Group income by month
    const monthlyData = {};
    data.income.forEach(income => {
        const month = new Date(income.date).toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += income.amountZAR;
    });

    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Income',
                data: values,
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Monthly Income Overview'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Calendar and Month View Functions
let currentDate = new Date();

function updateMonthlyView() {
    const selectedMonth = document.getElementById('monthSelect').value;
    if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        currentDate = new Date(year, month - 1);
    }
    updateCalendar();
    updateMonthSummary();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
    updateMonthSummary();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
    updateMonthSummary();
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month/year display
    document.getElementById('currentMonthYear').textContent = 
        currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Update month selector
    updateMonthSelector();
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Create calendar grid
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add empty cells for days before first of month
    for (let i = 0; i < startingDay; i++) {
        calendarGrid.appendChild(createEmptyDay());
    }
    
    // Add days of month
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dayElement = createDayElement(date);
        calendarGrid.appendChild(dayElement);
    }
}

function createEmptyDay() {
    const div = document.createElement('div');
    div.className = 'calendar-day empty';
    return div;
}

function createDayElement(date) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    
    // Check if it's today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        div.classList.add('today');
    }
    
    // Add day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = date.getDate();
    div.appendChild(dayNumber);
    
    // Add expenses for this day
    const expenses = getExpensesForDate(date);
    if (expenses.length > 0) {
        div.classList.add('has-expenses');
        const expensesDiv = document.createElement('div');
        expensesDiv.className = 'calendar-expenses';
        expenses.forEach(expense => {
            const expenseDiv = document.createElement('div');
            expenseDiv.className = 'calendar-expense';
            expenseDiv.textContent = `${expense.description}: ${formatCurrency(expense.amount)}`;
            expensesDiv.appendChild(expenseDiv);
        });
        div.appendChild(expensesDiv);
    }
    
    return div;
}

function getExpensesForDate(date) {
    return data.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === date.toDateString();
    });
}

function updateMonthSelector() {
    const monthSelect = document.getElementById('monthSelect');
    const months = new Set();
    
    // Get all months from expenses
    data.expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthYear);
    });
    
    // Add current month if empty
    const currentMonthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    months.add(currentMonthYear);
    
    // Update select options
    monthSelect.innerHTML = Array.from(months)
        .sort()
        .map(monthYear => {
            const [year, month] = monthYear.split('-');
            const date = new Date(year, month - 1);
            const selected = monthYear === currentMonthYear ? 'selected' : '';
            return `<option value="${monthYear}" ${selected}>
                ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </option>`;
        })
        .join('');
}

// Expense Tracking Functions
function filterExpenses() {
    const searchTerm = document.getElementById('searchExpense').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const typeFilter = document.getElementById('filterType').value;
    
    // Update category filter options
    updateCategoryFilter();
    
    // Filter expenses
    const filteredExpenses = data.expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm) ||
                            expense.notes?.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || expense.category === categoryFilter;
        const matchesType = !typeFilter || expense.type === typeFilter;
        return matchesSearch && matchesCategory && matchesType;
    });
    
    // Update table with filtered expenses
    updateExpenseTable(filteredExpenses);
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('filterCategory');
    const categories = new Set(data.expenses.map(expense => expense.category));
    
    // Update options
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        Array.from(categories)
            .sort()
            .map(category => `<option value="${category}">${category}</option>`)
            .join('');
}

function sortExpenses() {
    const sortBy = document.getElementById('sortExpenses').value;
    const [field, direction] = sortBy.split('-');
    
    const sortedExpenses = [...data.expenses].sort((a, b) => {
        let comparison = 0;
        if (field === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        } else if (field === 'amount') {
            comparison = a.amount - b.amount;
        }
        return direction === 'desc' ? -comparison : comparison;
    });
    
    updateExpenseTable(sortedExpenses);
}

// Update expense table to accept filtered/sorted expenses
function updateExpenseTable(expenses = data.expenses) {
    const tableBody = document.querySelector('#expenseTable tbody');
    tableBody.innerHTML = '';

    if (expenses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888; padding:2rem;">No expenses found</td></tr>`;
        return;
    }

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td><span class="badge badge-category">${expense.category}</span></td>
            <td><span class="badge badge-type badge-type-${expense.type.replace(/[^a-zA-Z]/g, '').toLowerCase()}">${expense.type}</span></td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${expense.currency}</td>
            <td>${expense.notes ? `<span class="notes">${expense.notes}</span>` : ''}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update switchTab function
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    
    // Handle specific tab content
    if (tabName === 'income') {
        document.getElementById('incomeTab').classList.add('active');
        updateIncomeList();
    } else if (tabName === 'expenses') {
        document.getElementById('expensesTab').classList.add('active');
        updateExpensesList();
    } else if (tabName === 'analytics') {
        document.getElementById('analyticsTab').classList.add('active');
        updateAnalytics();
    } else if (tabName === 'tracking') {
        document.getElementById('trackingTab').classList.add('active');
        updateCategoryFilter();
        updateExpenseTable();
    } else if (tabName === 'month') {
        document.getElementById('monthTab').classList.add('active');
        updateMonthlyView();
    }
}

// Export to CSV
function exportToCSV() {
    let csv = 'Type,Description,Category,Date,Amount,Currency,Amount (ZAR)\n';
    
    // Add income entries
    data.income.forEach(income => {
        csv += `Income,"${income.description}",,"${income.date}",${income.amount},${income.currency},${income.amountZAR}\n`;
    });
    
    // Add expense entries
    data.expenses.forEach(expense => {
        csv += `Expense,"${expense.description}","${expense.category}","${expense.date}",${expense.amount},${expense.currency},${expense.amountZAR}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'financial-data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Export to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text('JS Labs: Expense Guru Report', 20, 20);

    // Income Section
    doc.setFontSize(14);
    doc.text('Income', 20, 40);
    doc.setFontSize(12);
    data.income.forEach((income, index) => {
        doc.text(`${income.description}: ${formatCurrency(income.amount)}`, 20, 50 + index * 10);
    });

    // Expenses Section
    doc.setFontSize(14);
    doc.text('Expenses', 20, 100);
    doc.setFontSize(12);
    data.expenses.forEach((expense, index) => {
        doc.text(`${expense.description} (${expense.category}): ${formatCurrency(expense.amount)}`, 20, 110 + index * 10);
    });

    // Save the PDF
    doc.save('financial-report.pdf');
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Reset data function
function resetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        data = {
            income: [],
            expenses: []
        };
        localStorage.removeItem('financialData');
        updateOverview();
        updateIncomeList();
        updateExpensesList();
        updateAnalytics();
        updateExpenseTable();
        updateMonthlyOverview();
    }
}