// Data storage
let data = {
    income: [],
    expenses: [],
    planning: {
        taxAmount: 0,
        taxCurrency: 'ZAR',
        savingsAmount: 0,
        savingsCurrency: 'ZAR'
    }
};

const USD_TO_ZAR = 18.50;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (savedTheme === 'light') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    }
    
    // Rest of the initialization code
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;
    
    updateOverview();
    updateMonthlyView();
});

[Previous 800+ lines of unchanged functions remain exactly the same]

// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (newTheme === 'light') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
    
    // Update charts if they exist
    if (document.getElementById('analyticsTab').classList.contains('active')) {
        updateAnalytics();
    }
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
            expenses: [],
            planning: {
                taxAmount: 0,
                taxCurrency: 'ZAR',
                savingsAmount: 0,
                savingsCurrency: 'ZAR'
            }
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