// Church Financial System - Main Application
class ChurchFinanceSystem {
    constructor() {
        this.members = JSON.parse(localStorage.getItem('churchMembers') || '[]');
        this.tithes = JSON.parse(localStorage.getItem('churchTithes') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('churchExpenses') || '[]');
        this.budgets = JSON.parse(localStorage.getItem('churchBudgets') || '{}');
        this.settings = JSON.parse(localStorage.getItem('churchSettings') || JSON.stringify({
            churchName: 'Your Church Name',
            churchAddress: '',
            churchPhone: '',
            churchEmail: '',
            churchLogo: null
        }));

        this.currentSection = 'dashboard';
        this.apiBase = 'http://localhost:3001/api';
        this.useServer = false; // Start with localStorage mode
        this.init();
    }

    async init() {
        this.setupEventListeners();

        // Try to connect to server, fall back to localStorage if not available
        try {
            await this.testServerConnection();
            this.useServer = true;
            await this.loadAllData();
        } catch (error) {
            console.log('Server not available, using localStorage mode');
            this.useServer = false;
            this.loadLocalData();
        }

        this.updateNavigation();
        this.updateChurchDisplay();
    }

    // Server Connection Test
    async testServerConnection() {
        try {
            await fetch(`${this.apiBase}/dashboard`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return true;
        } catch (error) {
            throw new Error('Server not available');
        }
    }

    // Load local data when server is not available
    loadLocalData() {
        this.members = JSON.parse(localStorage.getItem('churchMembers') || '[]');
        this.tithes = JSON.parse(localStorage.getItem('churchTithes') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('churchExpenses') || '[]');
        this.budgets = JSON.parse(localStorage.getItem('churchBudgets') || '{}');
        this.settings = JSON.parse(localStorage.getItem('churchSettings') || JSON.stringify(this.settings));

        this.loadDashboard();
        this.loadMembers();
        this.loadTithes();
        this.loadExpenses();
        this.loadSettings();

        this.showAlert('Running in offline mode - data stored locally', 'info');
    }

    // API Helper Methods
    async apiRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            this.showAlert('Connection to server failed. Please check if the server is running.', 'error');
            throw error;
        }
    }

    async loadAllData() {
        try {
            const [members, tithes, expenses, budgets, settings, dashboard] = await Promise.all([
                this.apiRequest('/members'),
                this.apiRequest('/tithes'),
                this.apiRequest('/expenses'),
                this.apiRequest('/budgets'),
                this.apiRequest('/settings'),
                this.apiRequest('/dashboard')
            ]);

            this.members = members;
            this.tithes = tithes;
            this.expenses = expenses;
            this.budgets = budgets;
            this.settings = settings;
            this.dashboardData = dashboard;

            this.loadDashboard();
            this.loadMembers();
            this.loadTithes();
            this.loadExpenses();
            this.loadSettings();

        } catch (error) {
            console.error('Failed to load data:', error);
            this.showAlert('Failed to load data from server', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                console.log('Navigating to section:', section);
                this.switchSection(section);
            });
        });

        // Menu toggle for mobile
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('show');
        });

        // Member management
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            console.log('Add Member button found, attaching event listener');
            addMemberBtn.addEventListener('click', () => {
                console.log('Add Member button clicked');
                this.showMemberModal();
            });
        } else {
            console.error('Add Member button not found in DOM');
        }
        document.getElementById('memberForm').addEventListener('submit', (e) => this.saveMember(e));
        document.getElementById('cancelMemberBtn').addEventListener('click', () => this.hideMemberModal());
        document.getElementById('closeMemberModal').addEventListener('click', () => this.hideMemberModal());
        document.getElementById('memberSearch').addEventListener('input', (e) => this.searchMembers(e.target.value));
        document.getElementById('memberFilter').addEventListener('change', (e) => this.filterMembers(e.target.value));

        // Revenue management
        document.getElementById('addTitheBtn').addEventListener('click', () => this.showTitheForm());
        document.getElementById('titheFormElement').addEventListener('submit', (e) => this.saveTithe(e));
        document.getElementById('cancelTitheBtn').addEventListener('click', () => this.hideTitheForm());

        // Expense management
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.showExpenseForm());
        document.getElementById('expenseFormElement').addEventListener('submit', (e) => this.saveExpense(e));
        document.getElementById('cancelExpenseBtn').addEventListener('click', () => this.hideExpenseForm());

        // Budget management
        document.getElementById('setBudgetBtn').addEventListener('click', () => this.showBudgetForm());
        document.getElementById('uploadBudgetBtn').addEventListener('click', () => this.showExcelUploadModal());
        document.getElementById('budgetExcelFile').addEventListener('change', (e) => this.handleExcelFileSelect(e));
        document.getElementById('selectExcelFileBtn').addEventListener('click', () => this.triggerExcelFileSelect());
        document.getElementById('downloadTemplateBtn').addEventListener('click', () => this.downloadBudgetTemplate());
        document.getElementById('importExcelDataBtn').addEventListener('click', () => this.importExcelBudgetData());
        document.getElementById('cancelExcelImportBtn').addEventListener('click', () => this.cancelExcelImport());
        document.getElementById('closeExcelModal').addEventListener('click', () => this.hideExcelUploadModal());

        // Reports
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());

        // Settings
        document.getElementById('churchInfoForm').addEventListener('submit', (e) => this.saveSettings(e));
        document.getElementById('backupBtn').addEventListener('click', () => this.backupData());
        document.getElementById('restoreBtn').addEventListener('click', () => this.restoreData());

        // Logo upload
        document.getElementById('uploadLogoBtn').addEventListener('click', () => this.triggerLogoUpload());
        document.getElementById('removeLogoBtn').addEventListener('click', () => this.removeLogo());
        document.getElementById('churchLogo').addEventListener('change', (e) => this.handleLogoUpload(e));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideMemberModal();
            }
        });

        // Handle hash changes for direct links
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                this.switchSection(hash);
            }
        });
    }

    switchSection(section) {
        console.log('switchSection called with:', section);
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            console.log('Activating section:', section);
            targetSection.classList.add('active');
        } else {
            console.error('Section not found:', section);
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        } else {
            console.error('Nav item not found for section:', section);
        }

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            members: 'Members',
            tithes: 'Revenue',
            expenses: 'Expenses',
            budget: 'Budget',
            reports: 'Reports',
            settings: 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section];

        this.currentSection = section;
    }

    // Dashboard Functions
    loadDashboard() {
        this.updateDashboardStats();
        this.renderCharts();
        this.renderRecentTransactions();
    }

    updateDashboardStats() {
        if (this.useServer && this.dashboardData) {
            document.getElementById('totalRevenue').textContent = `$${this.dashboardData.monthlyTithes.toFixed(2)}`;
            document.getElementById('totalExpenses').textContent = `$${this.dashboardData.monthlyExpenses.toFixed(2)}`;
            document.getElementById('netBalance').textContent = `$${(this.dashboardData.monthlyTithes - this.dashboardData.monthlyExpenses).toFixed(2)}`;
            document.getElementById('activeMembers').textContent = this.dashboardData.activeMembers;
        } else if (!this.useServer) {
            // Calculate stats locally for localStorage mode
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const monthlyTithes = this.tithes.filter(tithe => {
                const titheDate = new Date(tithe.date);
                return titheDate.getMonth() === currentMonth && titheDate.getFullYear() === currentYear;
            }).reduce((sum, tithe) => sum + parseFloat(tithe.amount), 0);

            const monthlyExpenses = this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            }).reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
            document.getElementById('totalRevenue').textContent = `$${monthlyTithes.toFixed(2)}`;

            document.getElementById('totalExpenses').textContent = `$${monthlyExpenses.toFixed(2)}`;
            document.getElementById('netBalance').textContent = `$${(monthlyTithes - monthlyExpenses).toFixed(2)}`;
            document.getElementById('activeMembers').textContent = this.members.filter(m => m.status === 'active').length;
        }
    }

    renderCharts() {
        // Income vs Expenses Chart
        const ctx1 = document.getElementById('incomeExpenseChart').getContext('2d');
        const monthlyData = this.getMonthlyData();

        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Income',
                    data: monthlyData.income,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: monthlyData.expenses,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });

        // Revenue Categories Chart
        const ctx2 = document.getElementById('revenueCategoriesChart').getContext('2d');
        const revenueCategories = this.getRevenueCategories();

        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: revenueCategories.labels,
                datasets: [{
                    data: revenueCategories.data,
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#f39c12',
                        '#27ae60',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    getMonthlyData() {
        const months = [];
        const income = [];
        const expenses = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const month = date.getMonth();

            months.push(`${monthName} ${year}`);

            const monthIncome = this.tithes.filter(tithe => {
                const titheDate = new Date(tithe.date);
                return titheDate.getMonth() === month && titheDate.getFullYear() === year;
            }).reduce((sum, tithe) => sum + parseFloat(tithe.amount), 0);

            const monthExpenses = this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
            }).reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            income.push(monthIncome);
            expenses.push(monthExpenses);
        }

        return { labels: months, income, expenses };
    }

    getRevenueCategories() {
        const categories = {};
        this.tithes.forEach(tithe => {
            const category = tithe.type;
            categories[category] = (categories[category] || 0) + parseFloat(tithe.amount);
        });

        return {
            labels: Object.keys(categories),
            data: Object.values(categories)
        };
    }

    renderRecentTransactions() {
        const recentTransactions = [...this.tithes.map(t => ({...t, transactionType: 'income'})),
                                   ...this.expenses.map(e => ({...e, transactionType: 'expense'}))]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        const container = document.getElementById('recentTransactions');
        container.innerHTML = '';

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p>No recent transactions</p>';
            return;
        }

        recentTransactions.forEach(transaction => {
            const isIncome = transaction.transactionType === 'income';
            const displayName = transaction.memberName || transaction.description;
            const amount = parseFloat(transaction.amount);

            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-info">
                    <strong>${displayName}</strong>
                    <small>${new Date(transaction.date).toLocaleDateString()}</small>
                </div>
                <div class="activity-amount ${isIncome ? 'income' : 'expense'}">
                    ${isIncome ? '+' : '-'}$${Math.abs(amount).toFixed(2)}
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Member Management
    showMemberModal(memberId = null) {
        console.log('showMemberModal called with memberId:', memberId);
        const modal = document.getElementById('memberModal');
        const form = document.getElementById('memberForm');
        const title = document.getElementById('memberModalTitle');

        if (!modal || !form || !title) {
            console.error('Modal elements not found');
            return;
        }

        if (memberId) {
            const member = this.members.find(m => m.id === memberId);
            if (member) {
                document.getElementById('memberName').value = member.name;
                document.getElementById('memberEmail').value = member.email;
                document.getElementById('memberPhone').value = member.phone;
                document.getElementById('memberAddress').value = member.address;
                document.getElementById('memberStatus').value = member.status;
                form.setAttribute('data-member-id', memberId);
                title.textContent = 'Edit Member';
            }
        } else {
            form.reset();
            form.removeAttribute('data-member-id');
            title.textContent = 'Add Member';
        }

        console.log('Setting modal display to block');
        modal.style.display = 'block';
    }

    hideMemberModal() {
        document.getElementById('memberModal').style.display = 'none';
    }

    async saveMember(e) {
        e.preventDefault();

        try {
            const formData = new FormData(e.target);
            const memberId = e.target.getAttribute('data-member-id');

            const memberData = {
                id: memberId || Date.now().toString(),
                name: formData.get('memberName'),
                email: formData.get('memberEmail'),
                phone: formData.get('memberPhone'),
                address: formData.get('memberAddress'),
                status: formData.get('memberStatus'),
                joinDate: memberId ? undefined : new Date().toISOString().split('T')[0]
            };

            if (this.useServer) {
                if (memberId) {
                    await this.apiRequest(`/members/${memberId}`, {
                        method: 'PUT',
                        body: JSON.stringify(memberData)
                    });
                } else {
                    const newMember = await this.apiRequest('/members', {
                        method: 'POST',
                        body: JSON.stringify(memberData)
                    });
                    this.members.push(newMember);
                }
            } else {
                // LocalStorage mode
                if (memberId) {
                    this.members = this.members.map(m => m.id === memberId ? memberData : m);
                } else {
                    this.members.push(memberData);
                }
                this.saveMembers();
            }

            await this.loadMembers();
            this.hideMemberModal();
            this.showAlert('Member saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving member:', error);
            this.showAlert('Failed to save member', 'error');
        }
    }

    loadMembers() {
        const tbody = document.getElementById('membersTableBody');
        tbody.innerHTML = '';

        this.members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.email || '-'}</td>
                <td>${member.phone || '-'}</td>
                <td><span class="status ${member.status}">${member.status}</span></td>
                <td>${new Date(member.join_date || member.joinDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.editMember('${member.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteMember('${member.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateMemberSelects();
    }

    editMember(memberId) {
        this.showMemberModal(memberId);
    }

    async deleteMember(memberId) {
        if (confirm('Are you sure you want to delete this member?')) {
            try {
                await this.apiRequest(`/members/${memberId}`, {
                    method: 'DELETE'
                });
                this.members = this.members.filter(m => m.id != memberId);
                this.loadMembers();
                this.showAlert('Member deleted successfully!', 'success');
            } catch (error) {
                this.showAlert('Failed to delete member', 'error');
            }
        }
    }

    searchMembers(query) {
        const rows = document.querySelectorAll('#membersTableBody tr');
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            const visible = name.includes(query.toLowerCase()) || email.includes(query.toLowerCase());
            row.style.display = visible ? '' : 'none';
        });
    }

    filterMembers(status) {
        const rows = document.querySelectorAll('#membersTableBody tr');
        rows.forEach(row => {
            const memberStatus = row.cells[3].textContent.toLowerCase();
            const visible = status === 'all' || memberStatus === status;
            row.style.display = visible ? '' : 'none';
        });
    }

    updateMemberSelects() {
        const selects = document.querySelectorAll('#titheMember');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Member</option>';
            this.members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                select.appendChild(option);
            });
        });
    }

    // Revenue Management
    showTitheForm() {
        document.getElementById('titheForm').style.display = 'block';
        document.getElementById('titheDate').value = new Date().toISOString().split('T')[0];
    }

    hideTitheForm() {
        document.getElementById('titheForm').style.display = 'none';
        document.getElementById('titheFormElement').reset();
    }

    async saveTithe(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const memberId = formData.get('titheMember');
        const member = this.members.find(m => m.id == memberId);

        const titheData = {
            id: this.useServer ? undefined : Date.now().toString(),
            memberId: memberId,
            memberName: member ? member.name : 'Unknown',
            amount: parseFloat(formData.get('titheAmount')),
            type: formData.get('titheType'),
            date: formData.get('titheDate'),
            notes: formData.get('titheNotes')
        };

        try {
            if (this.useServer) {
                const newTithe = await this.apiRequest('/tithes', {
                    method: 'POST',
                    body: JSON.stringify(titheData)
                });
                this.tithes.push(newTithe);
            } else {
                this.tithes.push(titheData);
                this.saveTithes();
            }

            this.loadTithes();
            this.hideTitheForm();
            this.showAlert('Revenue recorded successfully!', 'success');
        } catch (error) {
            this.showAlert('Failed to save revenue record', 'error');
        }
    }

    loadTithes() {
        const tbody = document.getElementById('tithesTableBody');
        tbody.innerHTML = '';

        this.tithes.forEach(tithe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(tithe.date).toLocaleDateString()}</td>
                <td>${tithe.member_name || tithe.memberName}</td>
                <td>${this.formatRevenueType(tithe.type)}</td>
                <td>$${parseFloat(tithe.amount).toFixed(2)}</td>
                <td>${tithe.notes || '-'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteTithe('${tithe.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    formatRevenueType(type) {
        const typeMap = {
            'tithes': 'Tithes',
            'offering': 'Offering',
            'conferences': 'Conferences',
            'special_collections': 'Special Collections',
            'others': 'Others'
        };
        return typeMap[type] || type;
    }

    async deleteTithe(titheId) {
        if (confirm('Are you sure you want to delete this revenue record?')) {
            try {
                if (this.useServer) {
                    await this.apiRequest(`/tithes/${titheId}`, {
                        method: 'DELETE'
                    });
                }
                this.tithes = this.tithes.filter(t => t.id != titheId);
                if (!this.useServer) {
                    this.saveTithes();
                }
                this.loadTithes();
                this.showAlert('Revenue record deleted successfully!', 'success');
            } catch (error) {
                this.showAlert('Failed to delete revenue record', 'error');
            }
        }
    }

    // Expense Management
    showExpenseForm() {
        document.getElementById('expenseForm').style.display = 'block';
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    }

    hideExpenseForm() {
        document.getElementById('expenseForm').style.display = 'none';
        document.getElementById('expenseFormElement').reset();
    }

    async saveExpense(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const expenseData = {
            id: this.useServer ? undefined : Date.now().toString(),
            category: formData.get('expenseCategory'),
            amount: parseFloat(formData.get('expenseAmount')),
            description: formData.get('expenseDescription'),
            date: formData.get('expenseDate')
        };

        try {
            if (this.useServer) {
                const newExpense = await this.apiRequest('/expenses', {
                    method: 'POST',
                    body: JSON.stringify(expenseData)
                });
                this.expenses.push(newExpense);
            } else {
                this.expenses.push(expenseData);
                this.saveExpenses();
            }

            this.loadExpenses();
            this.hideExpenseForm();
            this.showAlert('Expense recorded successfully!', 'success');
        } catch (error) {
            this.showAlert('Failed to save expense', 'error');
        }
    }

    loadExpenses() {
        const tbody = document.getElementById('expensesTableBody');
        tbody.innerHTML = '';

        this.expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>$${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteExpense('${expense.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                if (this.useServer) {
                    await this.apiRequest(`/expenses/${expenseId}`, {
                        method: 'DELETE'
                    });
                }
                this.expenses = this.expenses.filter(e => e.id != expenseId);
                if (!this.useServer) {
                    this.saveExpenses();
                }
                this.loadExpenses();
                this.showAlert('Expense deleted successfully!', 'success');
            } catch (error) {
                this.showAlert('Failed to delete expense', 'error');
            }
        }
    }

    // Budget Management
    showBudgetForm() {
        // Simple budget form - in a real app, this would be more sophisticated
        const categories = ['utilities', 'salary', 'maintenance', 'outreach', 'office', 'other'];
        let budgetHtml = '<h3>Set Monthly Budget</h3><form id="budgetFormElement">';

        categories.forEach(category => {
            const currentBudget = this.budgets[category] || 0;
            budgetHtml += `
                <div class="form-group">
                    <label for="budget${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</label>
                    <input type="number" id="budget${category}" value="${currentBudget}" step="0.01" min="0">
                </div>
            `;
        });

        budgetHtml += `
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Budget</button>
                <button type="button" class="btn btn-secondary" onclick="this.closest('form').reset()">Reset</button>
            </div>
        </form>`;

        document.getElementById('budgetSummary').innerHTML = budgetHtml;

        document.getElementById('budgetFormElement').addEventListener('submit', (e) => this.saveBudget(e));
    }

    saveBudget(e) {
        e.preventDefault();

        const categories = ['utilities', 'salary', 'maintenance', 'outreach', 'office', 'other'];
        categories.forEach(category => {
            const value = parseFloat(document.getElementById(`budget${category}`).value) || 0;
            this.budgets[category] = value;
        });

        this.saveBudgets();
        this.renderBudgetChart();
        this.showAlert('Budget saved successfully!', 'success');
    }

    renderBudgetChart() {
        const ctx = document.getElementById('budgetChart').getContext('2d');

        const categories = Object.keys(this.budgets);
        const budgeted = categories.map(cat => this.budgets[cat]);
        const actual = categories.map(cat => {
            return this.expenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    label: 'Budgeted',
                    data: budgeted,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: '#3498db',
                    borderWidth: 1
                }, {
                    label: 'Actual',
                    data: actual,
                    backgroundColor: 'rgba(231, 76, 60, 0.6)',
                    borderColor: '#e74c3c',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // Excel Budget Upload Functions
    showExcelUploadModal() {
        document.getElementById('excelUploadModal').style.display = 'block';
        document.getElementById('excelPreview').style.display = 'none';
    }

    hideExcelUploadModal() {
        document.getElementById('excelUploadModal').style.display = 'none';
        document.getElementById('excelPreview').style.display = 'none';
        // Reset file input
        document.getElementById('budgetExcelFile').value = '';
    }

    triggerExcelFileSelect() {
        document.getElementById('budgetExcelFile').click();
    }

    handleExcelFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.parseExcelFile(file);
        }
    }

    parseExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first worksheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Process the data
                this.processExcelData(jsonData);
            } catch (error) {
                this.showAlert('Error reading Excel file. Please check the format.', 'error');
                console.error('Excel parsing error:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    processExcelData(data) {
        // Remove header row if it exists
        if (data.length > 0 && typeof data[0][0] === 'string' &&
            data[0][0].toLowerCase().includes('category')) {
            data.shift();
        }

        // Process data rows
        const budgetData = {};
        const validCategories = ['utilities', 'salary', 'maintenance', 'outreach', 'office', 'other'];
        const previewData = [];

        data.forEach((row, index) => {
            if (row.length >= 2) {
                const category = row[0]?.toString().toLowerCase().trim();
                const amount = parseFloat(row[1]);

                if (category && !isNaN(amount)) {
                    // Map common variations to standard categories
                    let mappedCategory = category;
                    if (category.includes('util')) mappedCategory = 'utilities';
                    else if (category.includes('sal')) mappedCategory = 'salary';
                    else if (category.includes('maintain')) mappedCategory = 'maintenance';
                    else if (category.includes('outreach') || category.includes('mission')) mappedCategory = 'outreach';
                    else if (category.includes('office') || category.includes('suppl')) mappedCategory = 'office';
                    else if (!validCategories.includes(category)) mappedCategory = 'other';

                    budgetData[mappedCategory] = (budgetData[mappedCategory] || 0) + amount;
                    previewData.push({
                        originalCategory: row[0],
                        mappedCategory: mappedCategory,
                        amount: amount
                    });
                }
            }
        });

        if (previewData.length === 0) {
            this.showAlert('No valid budget data found in the Excel file.', 'error');
            return;
        }

        this.showExcelPreview(previewData, budgetData);
    }

    showExcelPreview(previewData, budgetData) {
        const previewContainer = document.getElementById('excelDataPreview');
        const previewSection = document.getElementById('excelPreview');

        let html = '<table class="excel-preview-table">';
        html += '<thead><tr><th>Original Category</th><th>Mapped Category</th><th>Amount</th></tr></thead>';
        html += '<tbody>';

        previewData.forEach(item => {
            html += `<tr>
                <td>${item.originalCategory}</td>
                <td>${item.mappedCategory.charAt(0).toUpperCase() + item.mappedCategory.slice(1)}</td>
                <td>$${item.amount.toFixed(2)}</td>
            </tr>`;
        });

        html += '</tbody></table>';

        // Show summary
        html += '<div class="excel-summary" style="margin-top: 15px; padding: 10px; background: white; border-radius: 4px;">';
        html += '<h5>Summary by Category:</h5>';
        Object.entries(budgetData).forEach(([category, amount]) => {
            html += `<div>${category.charAt(0).toUpperCase() + category.slice(1)}: $${amount.toFixed(2)}</div>`;
        });
        html += '</div>';

        previewContainer.innerHTML = html;
        previewSection.style.display = 'block';

        // Store the budget data for import
        this.pendingBudgetData = budgetData;
    }

    importExcelBudgetData() {
        if (this.pendingBudgetData) {
            // Merge with existing budgets
            Object.keys(this.pendingBudgetData).forEach(category => {
                this.budgets[category] = this.pendingBudgetData[category];
            });

            this.saveBudgets();
            this.renderBudgetChart();
            this.showBudgetForm(); // Refresh the budget form
            this.hideExcelUploadModal();
            this.showAlert('Budget data imported successfully from Excel!', 'success');

            // Clear pending data
            this.pendingBudgetData = null;
        }
    }

    cancelExcelImport() {
        this.pendingBudgetData = null;
        document.getElementById('excelPreview').style.display = 'none';
        document.getElementById('budgetExcelFile').value = '';
    }

    downloadBudgetTemplate() {
        // Create sample data
        const templateData = [
            ['Category', 'Budget Amount'],
            ['Utilities', '500.00'],
            ['Salary', '2500.00'],
            ['Maintenance', '300.00'],
            ['Outreach', '200.00'],
            ['Office', '150.00'],
            ['Other', '100.00']
        ];

        // Create workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget Template');

        // Download file
        XLSX.writeFile(workbook, 'church-budget-template.xlsx');
        this.showAlert('Budget template downloaded successfully!', 'success');
    }

    // Reports
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        let reportData = {};

        switch (reportType) {
            case 'monthly':
                reportData = this.generateMonthlyReport();
                break;
            case 'quarterly':
                reportData = this.generateQuarterlyReport();
                break;
            case 'annual':
                reportData = this.generateAnnualReport();
                break;
            default:
                reportData = this.generateMonthlyReport();
        }

        this.displayReport(reportData);
    }

    generateMonthlyReport() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTithes = this.tithes.filter(tithe => {
            const titheDate = new Date(tithe.date);
            return titheDate.getMonth() === currentMonth && titheDate.getFullYear() === currentYear;
        });

        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        return {
            title: `Monthly Report - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            totalRevenue: monthlyTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            tithes: monthlyTithes,
            expenses: monthlyExpenses,
            totalTithes: monthlyTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            totalExpenses: monthlyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
        };
    }

    generateQuarterlyReport() {
        const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
        const currentYear = new Date().getFullYear();

        const quarterlyTithes = this.tithes.filter(tithe => {
            const titheDate = new Date(tithe.date);
            const titheQuarter = Math.floor(titheDate.getMonth() / 3) + 1;
            return titheQuarter === currentQuarter && titheDate.getFullYear() === currentYear;
        });

        const quarterlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const expenseQuarter = Math.floor(expenseDate.getMonth() / 3) + 1;
            return expenseQuarter === currentQuarter && expenseDate.getFullYear() === currentYear;
        });

        return {
            totalRevenue: quarterlyTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            title: `Quarterly Report - Q${currentQuarter} ${currentYear}`,
            tithes: quarterlyTithes,
            expenses: quarterlyExpenses,
            totalTithes: quarterlyTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            totalExpenses: quarterlyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
        };
    }

    generateAnnualReport() {
        const currentYear = new Date().getFullYear();

        const annualTithes = this.tithes.filter(tithe => {
            const titheDate = new Date(tithe.date);
            return titheDate.getFullYear() === currentYear;
        });

        const annualExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === currentYear;
        });

        return {
            totalRevenue: annualTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            title: `Annual Report - ${currentYear}`,
            tithes: annualTithes,
            expenses: annualExpenses,
            totalTithes: annualTithes.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            totalExpenses: annualExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
        };
    }

    displayReport(data) {
        const container = document.getElementById('reportResults');
        container.innerHTML = `
            <h3>${data.title}</h3>
            <div class="report-summary">
                <div class="summary-item">
                    <h4>Total Revenue</h4>
                    <p class="amount income">$${data.totalTithes.toFixed(2)}</p>
                </div>
                <div class="summary-item">
                    <h4>Total Expenses</h4>
                    <p class="amount expense">$${data.totalExpenses.toFixed(2)}</p>
                </div>
                <div class="summary-item">
                    <h4>Net Balance</h4>
                    <p class="amount ${data.totalTithes - data.totalExpenses >= 0 ? 'income' : 'expense'}">
                        $${(data.totalTithes - data.totalExpenses).toFixed(2)}
                    </p>
                </div>
            </div>
            <div class="report-details">
                <h4>Revenue Breakdown by Type</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Count</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.getRevenueTypeBreakdown(data.tithes)}
                    </tbody>
                </table>
            </div>
        `;
    }

    getRevenueTypeBreakdown(tithes) {
        const types = {};
        tithes.forEach(tithe => {
            const formattedType = this.formatRevenueType(tithe.type);
            types[formattedType] = types[formattedType] || { count: 0, amount: 0 };
            types[formattedType].count++;
            types[formattedType].amount += parseFloat(tithe.amount);
        });

        return Object.entries(types).map(([type, data]) => `
            <tr>
                <td>${type}</td>
                <td>${data.count}</td>
                <td>$${data.amount.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    exportData() {
        const data = {
            members: this.members,
            tithes: this.tithes,
            expenses: this.expenses,
            budgets: this.budgets,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `church-finance-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showAlert('Data exported successfully!', 'success');
    }

    // Settings
    loadSettings() {
        document.getElementById('churchName').value = this.settings.churchName || '';
        document.getElementById('churchAddress').value = this.settings.churchAddress || '';
        document.getElementById('churchPhone').value = this.settings.churchPhone || '';
        document.getElementById('churchEmail').value = this.settings.churchEmail || '';

        // Update logo preview
        this.updateLogoPreview();

        // Update header and report logos with church name
        this.updateChurchDisplay();
    }

    saveSettings(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        this.settings = {
            churchName: formData.get('churchName'),
            churchAddress: formData.get('churchAddress'),
            churchPhone: formData.get('churchPhone'),
            churchEmail: formData.get('churchEmail'),
            churchLogo: this.settings.churchLogo // Preserve the logo
        };

        this.saveSettingsToStorage();
        this.updateChurchDisplay();
        this.showAlert('Settings saved successfully!', 'success');
    }

    updateChurchDisplay() {
        const churchName = this.settings.churchName || 'Your Church Name';
        document.getElementById('headerChurchName').textContent = churchName;
        document.getElementById('reportChurchName').textContent = churchName;

        // Update logos with custom image if available
        this.updateLogoDisplays();
    }

    updateLogoDisplays() {
        const logoElements = ['headerLogo', 'reportLogo'];

        logoElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (this.settings.churchLogo) {
                    element.innerHTML = `<img src="${this.settings.churchLogo}" alt="Church Logo" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">`;
                } else {
                    element.innerHTML = '<i class="fas fa-church logo-icon"></i>';
                }
            }
        });
    }

    updateLogoPreview() {
        const preview = document.getElementById('currentLogoPreview');
        const removeBtn = document.getElementById('removeLogoBtn');

        if (this.settings.churchLogo) {
            preview.innerHTML = `
                <img src="${this.settings.churchLogo}" alt="Current Logo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 2px solid var(--border-color);">
                <span>Current logo</span>
            `;
            removeBtn.style.display = 'inline-block';
        } else {
            preview.innerHTML = `
                <i class="fas fa-church" style="font-size: 2rem; color: var(--text-secondary);"></i>
                <span>No logo uploaded</span>
            `;
            removeBtn.style.display = 'none';
        }
    }

    triggerLogoUpload() {
        document.getElementById('churchLogo').click();
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showAlert('Logo file size must be less than 2MB', 'error');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showAlert('Please select a valid image file', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.settings.churchLogo = e.target.result;
                this.saveSettingsToStorage();
                this.updateLogoPreview();
                this.updateLogoDisplays();
                this.showAlert('Logo uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    removeLogo() {
        if (confirm('Are you sure you want to remove the church logo?')) {
            this.settings.churchLogo = null;
            this.saveSettingsToStorage();
            this.updateLogoPreview();
            this.updateLogoDisplays();
            this.showAlert('Logo removed successfully!', 'success');
        }
    }

    backupData() {
        this.exportData();
    }

    restoreData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);

                        if (confirm('This will replace all current data. Are you sure?')) {
                            this.members = data.members || [];
                            this.tithes = data.tithes || [];
                            this.expenses = data.expenses || [];
                            this.budgets = data.budgets || {};
                            this.settings = data.settings || this.settings;

                            this.saveAllData();
                            this.init();
                            this.showAlert('Data restored successfully!', 'success');
                        }
                    } catch (error) {
                        this.showAlert('Invalid file format!', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Data Persistence
    saveMembers() {
        localStorage.setItem('churchMembers', JSON.stringify(this.members));
    }

    saveTithes() {
        localStorage.setItem('churchTithes', JSON.stringify(this.tithes));
    }

    saveExpenses() {
        localStorage.setItem('churchExpenses', JSON.stringify(this.expenses));
    }

    saveBudgets() {
        localStorage.setItem('churchBudgets', JSON.stringify(this.budgets));
    }

    saveSettingsToStorage() {
        localStorage.setItem('churchSettings', JSON.stringify(this.settings));
    }

    saveAllData() {
        this.saveMembers();
        this.saveTithes();
        this.saveExpenses();
        this.saveBudgets();
        this.saveSettingsToStorage();
    }

    // Utility Functions
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            ${message}
        `;

        // Insert at the top of the main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(alertDiv, mainContent.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }

    updateNavigation() {
        // Update active state based on current section
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${this.currentSection}"]`).classList.add('active');
    }
}

// Initialize the application
const app = new ChurchFinanceSystem();

// Make app globally available for onclick handlers
window.app = app;