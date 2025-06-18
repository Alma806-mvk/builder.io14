# Firebase Collections for Social Content AI Studio Analytics

## Core Analytics Collections

### 1. `user_sessions` - Track User Activity

```javascript
{
  userId: string,
  sessionId: string,
  startTime: timestamp,
  endTime: timestamp,
  duration: number, // in minutes
  platform: string, // web/mobile
  userAgent: string,
  subscription: 'free' | 'pro' | 'business',
  features_used: string[], // ['generator', 'canvas', 'analytics']
  pages_visited: string[],
  actions_count: number,
  ip_country: string, // optional
  referrer: string
}
```

### 2. `content_generations` - Track AI Content Creation

```javascript
{
  userId: string,
  sessionId: string,
  timestamp: timestamp,
  contentType: 'Script' | 'Idea' | 'Title' | 'Image' | etc,
  platform: 'YouTube' | 'Instagram' | 'TikTok' | etc,
  inputLength: number, // characters in user prompt
  outputLength: number, // characters in generated content
  processingTime: number, // milliseconds
  success: boolean,
  errorType?: string,
  aiPersona: string,
  language: string,
  subscription: string,
  usageCount: number, // user's total usage this month
  promptQuality: 'basic' | 'detailed' | 'advanced'
}
```

### 3. `canvas_activities` - Track Canvas Usage

```javascript
{
  userId: string,
  sessionId: string,
  timestamp: timestamp,
  action: 'create_item' | 'edit_item' | 'delete_item' | 'save_snapshot' | 'export',
  itemType: 'stickyNote' | 'textElement' | 'shapeElement' | 'imageElement',
  canvasId: string,
  duration: number, // time spent on canvas
  itemsCount: number,
  toolsUsed: string[], // ['layers', 'effects', 'templates']
  templateUsed?: string,
  exportFormat?: 'png' | 'pdf' | 'jpg',
  subscription: string
}
```

### 4. `feature_usage` - Track Feature Adoption

```javascript
{
  userId: string,
  sessionId: string,
  timestamp: timestamp,
  feature: string, // 'ai_generation', 'canvas', 'templates', 'analytics'
  subFeature?: string, // 'effects_panel', 'layer_management', 'quick_actions'
  action: 'view' | 'use' | 'complete' | 'abandon',
  duration: number,
  subscription: string,
  isFirstTime: boolean,
  success: boolean
}
```

### 5. `user_behavior` - Daily/Weekly Aggregates

```javascript
{
  userId: string,
  date: string, // YYYY-MM-DD
  totalSessions: number,
  totalDuration: number, // minutes
  contentGenerated: number,
  canvasItemsCreated: number,
  featuresUsed: string[],
  subscription: string,
  generationsRemaining: number,
  mostUsedPlatform: string,
  mostUsedContentType: string,
  engagementScore: number // calculated metric
}
```

### 6. `subscription_events` - Track Monetization

```javascript
{
  userId: string,
  timestamp: timestamp,
  event: 'trial_start' | 'upgrade' | 'downgrade' | 'cancel' | 'reactivate',
  fromPlan: string,
  toPlan: string,
  revenue: number,
  paymentMethod: string,
  triggerFeature?: string, // what feature led to upgrade
  usageAtUpgrade?: number,
  sessionId?: string
}
```

### 7. `error_logs` - Track Issues

```javascript
{
  userId?: string,
  timestamp: timestamp,
  errorType: 'api_error' | 'ui_error' | 'payment_error' | 'auth_error',
  errorMessage: string,
  stackTrace?: string,
  feature: string,
  userAgent: string,
  subscription?: string,
  sessionId?: string,
  resolved: boolean
}
```

### 8. `app_performance` - Track Performance Metrics

```javascript
{
  timestamp: timestamp,
  userId?: string,
  metric: 'page_load' | 'api_response' | 'generation_time' | 'canvas_render',
  value: number, // milliseconds
  feature: string,
  userAgent: string,
  sessionId?: string
}
```

### 9. `user_feedback` - Track User Satisfaction

```javascript
{
  userId: string,
  timestamp: timestamp,
  type: 'rating' | 'comment' | 'bug_report' | 'feature_request',
  feature: string,
  rating?: number, // 1-5
  comment?: string,
  subscription: string,
  sessionId: string
}
```

### 10. `onboarding_progress` - Track User Journey

```javascript
{
  userId: string,
  timestamp: timestamp,
  step: 'signup' | 'first_generation' | 'first_canvas' | 'first_template',
  completed: boolean,
  timeToComplete?: number, // minutes from signup
  dropoffPoint?: string,
  subscription: string
}
```

## Usage Analytics Queries

### Most Popular Features

```javascript
// Query feature_usage collection
db.collection("feature_usage")
  .where("timestamp", ">=", last30Days)
  .orderBy("feature");
```

### Conversion Funnel

```javascript
// Track user journey from free to paid
db.collection("user_behavior")
  .where("subscription", "==", "free")
  .where("generationsRemaining", "<=", 5);
```

### Content Generation Trends

```javascript
// Most popular content types and platforms
db.collection("content_generations")
  .where("timestamp", ">=", lastWeek)
  .orderBy("contentType");
```

### Canvas Usage Patterns

```javascript
// Most used canvas features
db.collection("canvas_activities")
  .where("timestamp", ">=", lastMonth)
  .orderBy("toolsUsed");
```

## Implementation Example

```javascript
// Track content generation
const trackContentGeneration = async (data) => {
  await db.collection("content_generations").add({
    userId: auth.currentUser.uid,
    sessionId: getCurrentSessionId(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    contentType: data.contentType,
    platform: data.platform,
    inputLength: data.userInput.length,
    outputLength: data.output.content.length,
    processingTime: data.processingTime,
    success: true,
    subscription: userSubscription,
    usageCount: userMonthlyUsage,
    // ... other fields
  });
};

// Track feature usage
const trackFeatureUsage = async (feature, action) => {
  await db.collection("feature_usage").add({
    userId: auth.currentUser.uid,
    sessionId: getCurrentSessionId(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    feature: feature,
    action: action,
    subscription: userSubscription,
    isFirstTime: !hasUsedFeatureBefore(feature),
    // ... other fields
  });
};
```

## Key Metrics to Track

1. **User Engagement**

   - Daily/Monthly Active Users
   - Session duration and frequency
   - Feature adoption rates

2. **Content Generation**

   - Generations per user
   - Popular content types/platforms
   - Success/failure rates

3. **Canvas Usage**

   - Canvas sessions per user
   - Most used tools and templates
   - Export rates

4. **Monetization**

   - Free to paid conversion rates
   - Revenue per user
   - Churn rates by feature usage

5. **Performance**
   - API response times
   - Error rates
   - User satisfaction scores

This structure will give you comprehensive insights into how users interact with your Social Content AI Studio app and help optimize both user experience and business metrics.
