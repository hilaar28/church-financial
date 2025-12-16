# Church Financial Management System

A comprehensive financial management system designed specifically for churches to manage, tithes their finances, members, offerings, and expenses.

## ✨ Features

- **👥 Member Management** - Add, edit, and manage church members
- **💰 Tithes & Offerings** - Track financial contributions and donations
- **📊 Expense Management** - Record and monitor church expenses by category
- **📈 Budget Planning** - Set and track monthly budgets
- **⚙️ Settings** - Configure church information and preferences
- **📱 Dashboard** - View financial overview and key statistics
- **🔒 Security** - Built-in rate limiting and input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/church-financial-system.git
   cd church-financial-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3001`
   - API health check: `http://localhost:3001/api/health`

### Development Mode
For development with auto-reload:
```bash
npm run dev
```

## 🗄️ Database

The system uses SQLite by default for simplicity and ease of deployment. The database file (`church_finance.db`) is automatically created and initialized when the server starts.

### Database Tables
- **Members** - Church member information
- **Tithes** - Tithes and offerings records
- **Expenses** - Church expenses by category
- **Budgets** - Monthly budget allocations
- **Settings** - Church configuration settings

## 📡 API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Tithes
- `GET /api/tithes` - Get all tithes
- `POST /api/tithes` - Record new tithe
- `DELETE /api/tithes/:id` - Delete tithe record

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Record new expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - Get current month budgets
- `POST /api/budgets` - Set/update budgets

### Settings
- `GET /api/settings` - Get church settings
- `POST /api/settings` - Update church settings

### Dashboard
- `GET /api/dashboard` - Get financial overview

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Security:** Helmet, CORS, Rate Limiting
- **Development:** Nodemon

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=3001
NODE_ENV=development
```

### Church Settings
After starting the server, configure your church details through the web interface or API:
- Church name
- Address
- Phone number
- Email
- Logo

## 🚀 Deployment

The system is designed for easy deployment on various platforms:

### Recommended Platforms
- **Railway** - Easiest deployment, free tier available
- **Render** - Good alternative with free tier
- **Heroku** - Popular platform with add-ons
- **DigitalOcean** - VPS for more control

### Database Migration
For production deployments, consider migrating to PostgreSQL for better scalability.

See [deployment-guide.md](./deployment-guide.md) for detailed deployment instructions.

## 📋 Usage

### Adding Members
1. Navigate to the Members section
2. Click "Add Member"
3. Fill in member details (name, email, phone, address)
4. Save the member

### Recording Tithes/Offerings
1. Go to Tithes section
2. Click "Add Tithe"
3. Select member (or enter name if not a registered member)
4. Enter amount, type (tithe/offering/special), and date
5. Add any notes if needed

### Managing Expenses
1. Access the Expenses section
2. Click "Add Expense"
3. Select category (utilities, salary, maintenance, etc.)
4. Enter amount, description, and date
5. Save the expense

### Setting Budgets
1. Go to Budgets section
2. Set monthly budget allocations for each category
3. Save budgets for the current month

## 🔒 Security Features

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - SQL injection protection
- **CORS Protection** - Configurable cross-origin requests
- **Helmet.js** - Security headers
- **Environment Variables** - Secure configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

## 🎯 Roadmap

- [ ] User authentication and roles
- [ ] Advanced reporting and analytics
- [ ] Mobile app integration
- [ ] Email notifications
- [ ] Multi-church support
- [ ] API documentation with Swagger

---

**Built with ❤️ for churches worldwide**