# 21st.dev Components for Marcel's Website

This file contains the comprehensive collection of 21st.dev components found for the website development, along with their installation commands.

## Navigation & Layout

### Header with Navigation
Professional header with dropdown menus and mobile responsive design.
```bash
npx 21st add header
```

### Promote Header
Advanced header with search, theme toggle, and social authentication.
```bash
npx 21st add promote-header
```

### Footer Sections
Professional footer with links, social media, and company information.
```bash
npx 21st add footer-7
```

## Hero Sections

### Shape Landing Hero
For the main landing page hero section with animated background shapes.
```bash
npx 21st add shape-landing-hero
```

### Hero Section 2
Alternative hero section design with clean layout.
```bash
npx 21st add hero-section-2
```

## About & Services

### About Us Section
Comprehensive about section with animations, stats, and team information.
```bash
npx 21st add about-us-section
```

### About Section 3
Business-focused about section with achievements and company showcase.
```bash
npx 21st add about-3
```

### Services Showcase
Modern services display with interactive cards and animations.
```bash
npx 21st add services
```

### Features with Image Carousel
Feature showcase with rotating image carousel for service demonstrations.
```bash
npx 21st add feature-with-image-carousel
```

## Portfolio & Gallery

### Portfolio Gallery
3D overlapping image gallery with marquee animation for mobile.
```bash
npx 21st add portfolio-gallery
```

### Gallery Hover Carousel
Interactive gallery with hover effects and detailed project information.
```bash
npx 21st add gallery-hover-carousel
```

### Project Cards
Individual project showcase cards with descriptions and links.
```bash
npx 21st add project-card
```

## Video Components

### Video Player
Custom video player with full controls, speed settings, and modern UI.
```bash
npx 21st add video-player
```

### Video Player Pro
Advanced video player with settings popover and enhanced features.
```bash
npx 21st add video-player-pro
```

## Pricing & Subscriptions

### Pricing Cards
For displaying the video course subscription tiers and service packages.
```bash
npx 21st add pricing-card
```

### Course Cards
Subscription-based course cards with pricing and feature lists.
```bash
npx 21st add login-card
```

## Statistics & Metrics

### Stats Counter
Animated statistics with number counting animations.
```bash
npx 21st add moving-dot-card
```

### Case Studies
Client success stories with metrics and testimonials.
```bash
npx 21st add case-studies
```

### Ruixen Stats
Dashboard-style statistics with charts and key metrics.
```bash
npx 21st add ruixen-stats
```

## Social Proof

### Testimonials
For showcasing client testimonials and reviews.
```bash
npx 21st add testimonials
```

## Call to Action

### CTA Section 4
Professional call-to-action with feature list and prominent button.
```bash
npx 21st add cta-4
```

### Call to Action
Simple and effective call-to-action section with multiple button options.
```bash
npx 21st add call-to-action
```

## Authentication

### Auth Form
Complete authentication system with sign-in, sign-up, and password reset.
```bash
npx 21st add auth-form-1
```

### Sign-in Page
Full-page authentication with gradient background and social login.
```bash
npx 21st add signin-page
```

### Authentication Card
Compact authentication card with password visibility toggle.
```bash
npx 21st add authentication-card
```

## Contact & Interaction

### Contact Form
For the contact section and lead generation.
```bash
npx 21st add contact-form
```

## Installation Notes

**IMPORTANT**: The commands above are simplified examples. 21st.dev components require specific URLs with API keys.

### Actual Installation Format:
```bash
npx shadcn@latest add "https://21st.dev/r/[component-path]?api_key=[your-api-key]"
```

### Example:
```bash
npx shadcn@latest add "https://21st.dev/r/easemize/sign-in?api_key=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18ybXdGd3U1cW5FQXozZ1U2dmxnMW13ZU1PZEoiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovLzIxc3QuZGV2IiwiZXhwIjoxNzU4MTQyMDM4LCJpYXQiOjE3NTgxNDExMzgsImlzcyI6Imh0dHBzOi8vY2xlcmsuMjFzdC5kZXYiLCJqdGkiOiI1ZmM3ZjkzMTc4NjY0Zjk5NWRiOCIsIm5iZiI6MTc1ODE0MTEzMywic3ViIjoidXNlcl8zMW1EUWhHbFcyWVFCaDVFY29CeW5aYXZUNmYifQ.E0EFXkCcm28D2dUVwLL8Re4ulpIAuBJfnW1xBc5wzjr3z5hKvOJhkGMDdF7ZTQhqLURfanYYzyT5yP4fIMIOlsEAbRtgIT3WtlYENN0Lx4KgTt2v_y0yYpZ87hcJRiGnhBOBZ6n4t8IMt1qy4KqFqbpiwQh_2upm0BFnE6vynoAtuhBU2BOhh6_pk0qtmJxKX-mg8Oqnoq6Ht7KIVi7_tvjp0w0Rh2a73QDW7crZwHYz07yDjlpGOVoiHYONFEgTOpkCZQTFF4-A7zrVmKYFJp36QllqOz7yqmN0iREf8AwiXlCuzDYirGjlsdAMF_6EwAiuE781ckx6jvoSFGGqMQ"
```

### To Get Real Installation Commands:
1. Visit [21st.dev](https://21st.dev) 
2. Browse the component library
3. Find the specific components listed above
4. Copy the actual installation URL with your API key
5. Use the npx shadcn@latest add command with the full URL

### Setup Requirements:
1. Next.js project with shadcn/ui initialized
2. 21st.dev account and API key
3. Tailwind CSS configured
4. TypeScript setup (recommended)
5. Additional dependencies may be required per component (framer-motion, react-hook-form, etc.)

## Component Usage Strategy

### Landing Page Flow
1. **Promote Header** - Main navigation with search and authentication
2. **Shape Landing Hero** - Eye-catching hero with animated background
3. **About Us Section** - Marcel's story and achievements (Portfolio.hu, Growth Magazine, etc.)
4. **Services Showcase** - Speaking, mentoring, consulting services
5. **Case Studies** - Client success stories and metrics
6. **Pricing Cards** - Video course subscription tiers
7. **Portfolio Gallery** - Work showcase and projects
8. **CTA Section** - Call-to-action for booking or signup
9. **Footer** - Links, contact info, and social media

### Video Course Platform
1. **Video Player Pro** - Custom video player for course content
2. **Auth Form** - User authentication and registration
3. **Stats Counter** - Progress tracking and course statistics
4. **Course Cards** - Individual course listings with pricing

### Service Pages
1. **Features with Carousel** - Service demonstrations
2. **Testimonials** - Client reviews and social proof
3. **Contact Form** - Lead generation and booking inquiries

## Theme Customization
- All components can be customized to use blue color scheme
- Tailwind CSS variables can be adjusted for brand consistency
- Components support dark/light mode theming
- Responsive design works across all device sizes