// Church Financial System - Main Application
class ChurchFinanceSystem {
    constructor() {
        this.members = JSON.parse(localStorage.getItem('churchMembers') || '[]');
        this.tithes = JSON.parse(localStorage.getItem('churchTithes') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('churchExpenses') || '[]');
        this.budgets = JSON.parse(localStorage.getItem('churchBudgets') || '{}');
        this.settings = JSON.parse(localStorage.getItem('churchSettings') || JSON.stringify({
            churchName: 'AFM in Zimbabwe Belvedere Assembly',
            churchAddress: '',
            churchPhone: '',
            churchEmail: '',
            churchLogo: 'data:image/png;base64,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'
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
        document.getElementById('titheMember').addEventListener('change', (e) => this.handleContributorChange(e));

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
        console.log('=== MEMBER MODAL DEBUG START ===');
        console.log('showMemberModal called with memberId:', memberId);
        const modal = document.getElementById('memberModal');
        const form = document.getElementById('memberForm');
        const title = document.getElementById('memberModalTitle');

        console.log('Modal element:', modal);
        console.log('Form element:', form);
        console.log('Title element:', title);

        if (!modal || !form || !title) {
            console.error('Modal elements not found');
            console.error('Modal found:', !!modal);
            console.error('Form found:', !!form);
            console.error('Title found:', !!title);
            return;
        }

        if (memberId) {
            console.log('Setting up edit mode for memberId:', memberId);
            const member = this.members.find(m => m.id === memberId);
            console.log('Found member data:', member);
            
            if (member) {
                console.log('Populating form fields with member data...');
                document.getElementById('memberName').value = member.name || '';
                document.getElementById('memberEmail').value = member.email || '';
                document.getElementById('memberPhone').value = member.phone || '';
                document.getElementById('memberAddress').value = member.address || '';
                document.getElementById('memberStatus').value = member.status || 'active';
                
                console.log('Setting data-member-id attribute to:', memberId);
                form.setAttribute('data-member-id', memberId);
                title.textContent = 'Edit Member';
                console.log('Edit mode setup complete');
            } else {
                console.error('Member not found in members array');
                return;
            }
        } else {
            console.log('Setting up add mode (no memberId provided)');
            form.reset();
            form.removeAttribute('data-member-id');
            title.textContent = 'Add Member';
        }

        console.log('Setting modal display to block');
        modal.style.display = 'block';
        console.log('=== MEMBER MODAL DEBUG END ===');
    }

    hideMemberModal() {
        document.getElementById('memberModal').style.display = 'none';
    }

    async saveMember(e) {
        e.preventDefault();
        
        console.log('=== MEMBER SAVE DEBUG START ===');
        console.log('Form submitted, checking details...');
        console.log('Event target:', e.target);
        console.log('Form elements:', e.target.elements);
        
        const formData = new FormData(e.target);
        const memberId = e.target.getAttribute('data-member-id');
        
        console.log('Member ID from form:', memberId);
        console.log('Is edit operation:', !!memberId);
        
        // Debug form data extraction
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`);
        }

        const memberData = {
            name: formData.get('memberName'),
            email: formData.get('memberEmail'),
            phone: formData.get('memberPhone'),
            address: formData.get('memberAddress'),
            status: formData.get('memberStatus')
        };
        
        // Only add joinDate for new members
        if (!memberId) {
            memberData.joinDate = new Date().toISOString().split('T')[0];
        }
        
        console.log('Member data object:', memberData);
        console.log('Current members array length:', this.members.length);

        try {

            console.log('Using server mode:', this.useServer);
            
            if (this.useServer) {
                console.log('Server mode: Making API request...');
                if (memberId) {
                    console.log('Updating existing member via PUT request...');
                    const response = await this.apiRequest(`/members/${memberId}`, {
                        method: 'PUT',
                        body: JSON.stringify(memberData)
                    });
                    console.log('Server response:', response);
                    
                    // Update local array with the new data
                    const updatedMember = { ...memberData, id: memberId };
                    this.members = this.members.map(m => m.id == memberId ? updatedMember : m);
                } else {
                    console.log('Creating new member via POST request...');
                    const newMember = await this.apiRequest('/members', {
                        method: 'POST',
                        body: JSON.stringify(memberData)
                    });
                    console.log('New member created:', newMember);
                    this.members.push(newMember);
                }
            } else {
                console.log('LocalStorage mode: Updating locally...');
                // LocalStorage mode
                if (memberId) {
                    console.log('Updating member in localStorage array...');
                    console.log('Before update - members array:', this.members);
                    this.members = this.members.map(m => {
                        console.log(`Comparing m.id: ${m.id} with memberId: ${memberId}`);
                        return m.id == memberId ? { ...memberData, id: memberId } : m;
                    });
                    console.log('After update - members array:', this.members);
                    this.saveMembers();
                } else {
                    console.log('Adding new member to localStorage...');
                    this.members.push(memberData);
                    this.saveMembers();
                }
            }

            await this.loadMembers();
            this.hideMemberModal();
            this.showAlert('Member saved successfully!', 'success');
            console.log('=== MEMBER SAVE DEBUG END ===');
        } catch (error) {
            console.error('Error saving member:', error);
            this.showAlert('Failed to save member', 'error');
            console.log('=== MEMBER SAVE DEBUG END WITH ERROR ===');
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
        console.log('=== EDIT MEMBER DEBUG START ===');
        console.log('editMember called with memberId:', memberId);
        console.log('Current members array:', this.members);
        const member = this.members.find(m => m.id === memberId);
        console.log('Found member:', member);
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
            select.innerHTML = '<option value="">Select Contributor</option>';
            this.members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                select.appendChild(option);
            });
            // Add Others option
            const othersOption = document.createElement('option');
            othersOption.value = 'others';
            othersOption.textContent = 'Others/Non-members';
            select.appendChild(othersOption);
        });
    }

    // Revenue Management
    showTitheForm() {
        document.getElementById('titheForm').style.display = 'block';
        document.getElementById('titheDate').value = new Date().toISOString().split('T')[0];
        // Reset form
        this.hideOtherContributorField();
    }

    hideTitheForm() {
        document.getElementById('titheForm').style.display = 'none';
        document.getElementById('titheFormElement').reset();
        this.hideOtherContributorField();
    }

    handleContributorChange(event) {
        const selectedValue = event.target.value;
        if (selectedValue === 'others') {
            this.showOtherContributorField();
        } else {
            this.hideOtherContributorField();
        }
    }

    showOtherContributorField() {
        document.getElementById('otherContributorGroup').style.display = 'block';
        document.getElementById('otherContributorName').setAttribute('required', 'required');
        document.getElementById('otherContributorName').focus();
    }

    hideOtherContributorField() {
        document.getElementById('otherContributorGroup').style.display = 'none';
        document.getElementById('otherContributorName').removeAttribute('required');
        document.getElementById('otherContributorName').value = '';
    }

    async saveTithe(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const memberId = formData.get('titheMember');
        let memberName = 'Unknown';

        if (memberId === 'others') {
            // Handle "Others" case
            memberName = formData.get('otherContributorName') || 'Others';
        } else {
            // Handle regular member case
            const member = this.members.find(m => m.id == memberId);
            memberName = member ? member.name : 'Unknown';
        }

        const titheData = {
            id: this.useServer ? undefined : Date.now().toString(),
            memberId: memberId === 'others' ? null : memberId,
            memberName: memberName,
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
        const churchName = this.settings.churchName || 'AFM in Zimbabwe Belvedere Assembly';
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