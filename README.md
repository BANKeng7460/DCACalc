# DCA Calculator

A modern, aesthetic, and highly functional web application for calculating Dollar Cost Averaging (DCA) strategies. Optimize your entry point and determine the exact capital needed to reach your target average cost.

**Live Demo:** [http://dca-calc-dime.vercel.app/](http://dca-calc-dime.vercel.app/)

## Features

- **Instant Profit/Loss Calculation**: Enter your cost per share and current price to instantly see your portfolio standing.
- **DCA Planning**: Input your total invested capital and a target loss/profit percentage.
- **Actionable Insights**: The calculator will automatically determine:
  - The exact **Deposit Amount** required to reach your goal.
  - Your **New Average Cost** per share after the deposit.
  - Your **Total Capital** invested post-deposit.
- **Edge Case Handling**: Alerts you if a target percentage is mathematically impossible to reach based on current market prices.
- **Premium UI/UX**: Built with a sleek dark mode, glassmorphism elements, and smooth micro-animations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is open-source and available for anyone to use and modify.
