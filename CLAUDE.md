# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Marcel Nyirő's portfolio website showcasing him as an AI-driven entrepreneur and business strategist. Features include Outfino (AI fashion platform with 73M HUF OUVC investment), speaking engagements, mentoring services, and course platform.

## Commands

### Development
```bash
# Development with Turbopack
cd marciportfolio && npm run dev

# Build production
cd marciportfolio && npm run build

# Start production server
cd marciportfolio && npm start

# Lint check
cd marciportfolio && npm run lint
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS v4, Framer Motion for animations
- **UI Components**: 21st.dev premium components library + shadcn/ui
- **3D Graphics**: Three.js with React Three Fiber, GSAP for animations
- **Icons**: Lucide React, Radix Icons, React Icons
- **State**: React hooks (no Redux needed for this project)

### Project Structure
```
marciportfolio/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/
│   │   ├── ui/          # 21st.dev UI components (pre-built)
│   │   └── blocks/      # Page sections (newsletter, footer)
│   ├── lib/             # Utilities (cn function)
│   └── documents/       # Project documentation
```

### Key Components Available
All 21st.dev components are already imported and ready to use:
- `infinite-hero.tsx` - 3D animated hero section
- `timeline-component.tsx` - Achievements display
- `pricing-card.tsx` - Service pricing cards
- `circular-testimonials.tsx` - Client testimonials
- `video-player-pro.tsx` - Course video player
- `dashboard-with-collapsible-sidebar.tsx` - User dashboard
- `form-1.tsx` - Contact forms
- `header.tsx` & `navigation-menu.tsx` - Navigation
- `footer-section.tsx` - Footer

### Color System (Blue Theme)
```css
Primary Blue: #2563eb (Blue-600)
Secondary Blue: #1e40af (Blue-700)
Accent Blue: #3b82f6 (Blue-500)
Light Blue: #dbeafe (Blue-100)
```

## Content Requirements

### Sections to Build
1. **Hero**: AI entrepreneur intro with `infinite-hero.tsx`
2. **Achievements**: Portfolio.hu, OUVC investment, Growth Magazine using `timeline-component.tsx`
3. **Services**: Speaking, mentoring, advisory with `pricing-card.tsx`
4. **Testimonials**: Client reviews with `circular-testimonials.tsx`
5. **Contact**: Inquiry forms with `form-1.tsx`
6. **Courses**: Video platform (Phase 2)

### Marcel's Real Information
- **Name**: Marcel Nyirő (Nyírő Marcell Csaba)
- **Company**: Outfino - AI fashion platform
- **Investment**: 73M HUF from OUVC (Óbuda University VC)
- **Media**: Portfolio.hu, StartupOnline, Growth Magazine coverage
- **LinkedIn**: 500+ connections, 728 followers
- **Services**: AI/entrepreneurship speaking, startup mentoring, fashion tech advisory

## Implementation Notes

### Component Integration
1. Components from 21st.dev are pre-styled and production-ready
2. Modify color variables to match blue theme (#2563eb)
3. Components use Framer Motion - animations are built-in
4. Use `cn()` utility from `lib/utils.ts` for className merging

### Content Data
All content specifications are in `src/documents/`:
- `01-project-overview.md` - Requirements
- `02-component-inventory.md` - Component mapping
- `05-content-strategy.md` - Text content
- `09-marcel-real-info.md` - Real business data

### Development Priorities
1. Replace default Next.js page with portfolio layout
2. Integrate existing UI components
3. Apply blue theme throughout
4. Add Marcel's real content from documentation
5. Ensure responsive design works on all devices

### Performance Considerations
- Three.js animations in hero may need optimization for mobile
- Lazy load heavy components like video player
- Use Next.js Image component for optimization
- Consider reducing shader complexity on lower-end devices