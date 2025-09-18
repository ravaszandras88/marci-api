#!/bin/bash

# Build the project
npm run build

# Create deployment directory structure
echo "Setting up deployment structure..."

# Copy files to deployment directory (adjust path as needed)
# rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' . /var/www/marci-api/

# Or for remote deployment to DigitalOcean droplet:
# rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' . user@your-droplet-ip:/var/www/marci-api/

echo "Build completed. Files ready for deployment."
echo ""
echo "To deploy to DigitalOcean droplet:"
echo "1. Copy this project to your droplet: scp -r . user@your-droplet-ip:/var/www/marci-api/"
echo "2. SSH to droplet: ssh user@your-droplet-ip"
echo "3. Install dependencies: cd /var/www/marci-api && npm install"
echo "4. Start with PM2: pm2 start ecosystem.config.js"
echo "5. Configure nginx to proxy to localhost:3002"