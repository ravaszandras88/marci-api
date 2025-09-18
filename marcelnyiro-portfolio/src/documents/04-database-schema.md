# Database Schema & SQL Queries

## Database Configuration
```javascript
// PostgreSQL connection with pg driver
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: 'marcel_portfolio',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Tables

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'none',
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  billing_cycle VARCHAR(20),
  started_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Course Progress Table
```sql
CREATE TABLE course_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(255) NOT NULL,
  episode_id VARCHAR(255),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP,
  last_watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id, episode_id)
);

-- Indexes
CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX idx_course_progress_last_watched ON course_progress(last_watched_at);
```

## Common SQL Queries

### User Operations
```typescript
// Get user by email
const getUserByEmail = `
  SELECT * FROM users WHERE email = $1;
`;

// Create new user
const createUser = `
  INSERT INTO users (email, name, avatar_url) 
  VALUES ($1, $2, $3) 
  RETURNING *;
`;

// Update user subscription
const updateUserSubscription = `
  UPDATE users 
  SET subscription_tier = $1, subscription_status = $2, updated_at = NOW()
  WHERE id = $3
  RETURNING *;
`;
```

### Subscription Operations
```typescript
// Create subscription
const createSubscription = `
  INSERT INTO subscriptions (user_id, tier, status, stripe_subscription_id, stripe_customer_id, billing_cycle, started_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

// Get active subscription
const getActiveSubscription = `
  SELECT s.*, u.email, u.name 
  FROM subscriptions s
  JOIN users u ON s.user_id = u.id
  WHERE s.user_id = $1 AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
`;
```

### Course Progress Operations
```typescript
// Update progress with upsert
const updateProgress = `
  INSERT INTO course_progress (user_id, course_id, episode_id, progress_percentage, last_watched_at)
  VALUES ($1, $2, $3, $4, NOW())
  ON CONFLICT (user_id, course_id, episode_id)
  DO UPDATE SET 
    progress_percentage = $4,
    last_watched_at = NOW(),
    completed_at = CASE WHEN $4 = 100 THEN NOW() ELSE completed_at END;
`;

// Get user progress
const getUserProgress = `
  SELECT course_id, episode_id, progress_percentage, completed_at, last_watched_at
  FROM course_progress
  WHERE user_id = $1
  ORDER BY last_watched_at DESC;
`;

// Get course completion rate
const getCourseCompletion = `
  SELECT 
    course_id,
    COUNT(*) as total_episodes,
    COUNT(CASE WHEN progress_percentage = 100 THEN 1 END) as completed_episodes,
    AVG(progress_percentage) as avg_progress
  FROM course_progress
  WHERE user_id = $1
  GROUP BY course_id;
`;
```

## Redis Caching Strategy

### Session Caching
```typescript
// Cache user session
const cacheUserSession = async (userId: string, sessionData: object) => {
  await redis.setex(`session:${userId}`, 3600, JSON.stringify(sessionData));
};

// Cache video progress for real-time updates
const cacheVideoProgress = async (userId: string, courseId: string, episodeId: string, progress: number) => {
  await redis.setex(`progress:${userId}:${courseId}:${episodeId}`, 300, progress.toString());
};
```

## Environment Variables
```env
DB_HOST=your-digitalocean-db-host
DB_USER=marcel_db_user
DB_PASSWORD=secure_password
DB_NAME=marcel_portfolio

REDIS_URL=redis://your-redis-instance

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://marcel-ceo.com
```