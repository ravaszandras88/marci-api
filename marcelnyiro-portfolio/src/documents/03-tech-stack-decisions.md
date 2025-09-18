# Tech Stack & Architecture Decisions
## DUAL-PURPOSE: Portfolio Website + Course Sales Platform

## Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 21st.dev + Shadcn/ui (Blue theme)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Backend
- **Runtime**: Node.js on DigitalOcean Droplet
- **API**: Next.js API Routes + tRPC
- **Database**: PostgreSQL (DigitalOcean Managed) with pg driver
- **Authentication**: NextAuth.js (required for course access)
- **Caching**: Redis for sessions and video progress
- **File Storage**: DigitalOcean Spaces (course videos)
- **CDN**: Bunny CDN for video delivery
- **Containerization**: Docker

## Key Decisions Made

### Database: PostgreSQL with Direct SQL (NO ORM)
**Why**: Removed Prisma/ORM for simplicity
**Benefit**: Direct control, better performance, simpler debugging

### Hosting: DigitalOcean (NOT Vercel)
**Why**: More control, better pricing for our needs
**Setup**: Droplets + Managed DB + Redis + Spaces

### Booking: Calendly Embed (NO API)
**Why**: Simple iframe integration vs complex API
**Benefit**: No maintenance, immediate functionality

### Payments: Stripe Checkout Sessions
**Why**: Pre-built UI vs custom payment forms
**Benefit**: PCI compliance handled by Stripe

### Video: 21st.dev player + Bunny CDN
**Why**: Professional player already available
**Benefit**: Advanced features without custom development

## Infrastructure Architecture

### DigitalOcean Setup
```yaml
droplet:
  size: "s-2vcpu-4gb" # 4GB RAM, 2 vCPUs
  region: "fra1" # Frankfurt for EU users
  
database:
  type: "managed-postgresql-14"
  size: "db-s-1vcpu-1gb"
  region: "fra1"
  
redis:
  type: "managed-redis-7" 
  size: "db-s-1vcpu-1gb"
  region: "fra1"
  
spaces:
  name: "marcel-video-content"
  region: "fra1"
  cdn_enabled: true
```

### Deployment Stack
- **Docker** for containerization
- **Nginx** reverse proxy
- **GitHub Actions** for CI/CD
- **SSL** via Let's Encrypt

## Integrations

### Simplified Integrations
- **Booking**: Calendly embed widget (no API needed)
- **Payments**: Stripe API with Checkout Sessions  
- **Email**: Resend with templates
- **Video**: Bunny CDN or DigitalOcean Spaces
- **Analytics**: Google Analytics

### API Strategy
- **tRPC**: Type-safe APIs (reduces boilerplate)
- **Direct SQL**: No ORM abstraction
- **Redis**: Caching for performance
- **Minimal Endpoints**: Only essential APIs

## Color System (Blue Theme)
- **Primary Blue**: #2563eb (Blue-600)
- **Secondary Blue**: #1e40af (Blue-700)
- **Accent Blue**: #3b82f6 (Blue-500)
- **Light Blue**: #dbeafe (Blue-100)
- **Text**: #1f2937 (Gray-800)
- **Background**: #ffffff (White)
- **Muted**: #6b7280 (Gray-500)