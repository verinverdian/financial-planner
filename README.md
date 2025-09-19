# FinanceTrack Co.

FinanceTrack Co. is a modern personal finance management web application designed to help individuals track income, manage expenses, and achieve financial goals effectively. With an intuitive dashboard and robust reporting features, users can gain full visibility into their finances.

## Features

- Expense Tracking: Easily track daily expenses and see where your money goes.
- Income Management: Manage multiple income sources in one dashboard.
- Goal Setting: Create financial goals and track progress toward them.
- Financial Reports: Generate monthly reports to keep your finances on track.
- Interactive Dashboard: Visualize income vs expenses, category breakdowns, and 7-day trends.
- Pagination: Navigate through income and expense records efficiently.

## Screenshots
### Landing Page
- Clean and modern design with hero section and call-to-action.
- Highlights features and pricing plans.
<img width="560" height="1626" alt="image" src="https://github.com/user-attachments/assets/dc31f3db-e516-4da6-ab55-1f6f14572f87" />


### Dashboard
- Overview of financial health, goals, and transaction history.
- Graphs and charts for quick insights.
- Ability to add, edit, and delete income and expenses.
<img width="560" height="3586" alt="image" src="https://github.com/user-attachments/assets/91868c50-1a6e-4a9a-a6a2-5f40da297b82" />


## Installation

### Clone the repository:
```
git clone https://github.com/your-username/finance-track.git
cd finance-track
```
### Install dependencies:
```
npm install
# or
yarn install
```

### Configure environment variables:

Create a .env file with your database and API credentials (e.g., Supabase).

Run the development server:
```
npm run dev
# or
yarn dev
```

Open http://localhost:3000 to view the app in your browser.

## Usage

- Add Income/Expense: Use the left panel to add new transactions.
- Track Goals: Add goals and assign portions of income toward achieving them.
- View Reports: Check charts and summaries for insights on your spending habits.
- Pagination: Use the navigation at the bottom of income/expense lists for easier browsing.

## Technologies

- Frontend: React, Next.js, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Charts: Recharts or similar for data visualization
- Icons: Lucide-react

