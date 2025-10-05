# YLADA - Your Lead Advanced Data Assistant

YLADA is a comprehensive lead generation platform designed for wellness and quality of life professionals, including Herbalife distributors and wellness coaches, to capture and convert leads through personalized health assessments and wellness tools.

## Features

- **Personalized Wellness Assessment**: Quiz-based evaluation for lead capture
- **Lead Generation Tools**: Calculators, assessments, and interactive content
- **Professional Dashboard**: Track leads and conversions
- **Payment Integration**: Stripe-powered purchase system for tools and subscriptions
- **PWA Support**: Installable web app for mobile and desktop
- **Multi-language Support**: Available in English, Portuguese, and Spanish
- **Referral System**: Gamified lead sharing and rewards

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ylada-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure Stripe:
   - Get your Stripe API keys from the Stripe Dashboard
   - Update `.env.local` with your actual keys:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── quiz/               # Health assessment quiz
│   ├── protocols/          # Protocol access page
│   ├── success/            # Payment success page
│   ├── calculators/        # Nutritional calculators
│   ├── nutrition/          # Nutrition tables (preserved)
│   └── page.tsx            # Homepage
├── lib/
│   └── stripe.ts           # Stripe configuration
└── components/             # Reusable components
```

## Key Features

### Health Assessment Quiz
- Multi-step questionnaire for lead capture
- Personalized recommendations
- Risk assessment
- Professional consultation offers

### Payment System
- Lead generation tools ($9.90 each)
- Monthly subscription ($7.90/month)
- Stripe Checkout integration
- Success page with lead access

### PWA Configuration
- Installable on mobile and desktop
- Offline capabilities
- App-like experience
- Push notifications ready

## Protocol Structure

Each protocol includes:
- Overview and objectives
- Personalized calculations
- Supplement recommendations
- Exercise guidelines
- Progress tracking tools
- Downloadable PDFs

## Available Tools

1. **BMI Calculator** - Personalized body mass index and health risk assessment
2. **Body Composition Analyzer** - Muscle mass, fat percentage, and wellness analysis
3. **Meal Planner** - Personalized meal plans and shopping lists
4. **Hydration Monitor** - Water intake tracking and wellness reminders
5. **Wellness Assessment** - Comprehensive health and lifestyle evaluation

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Ensure environment variables are set
- Build command: `npm run build`
- Start command: `npm start`

## Stripe Setup

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Create products and prices for each protocol
4. Update the price IDs in the code
5. Test with Stripe's test mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary. All rights reserved.

## Support

For support, email support@ylada.app or visit our help center.

## Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics
- [ ] Community features
- [ ] Healthcare provider integration
- [ ] AI-powered recommendations