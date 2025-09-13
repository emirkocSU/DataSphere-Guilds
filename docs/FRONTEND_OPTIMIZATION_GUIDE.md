
# Frontend Performance Optimization Guide

This guide provides practical steps and code examples for implementing critical frontend performance optimizations: Bundle Optimization (via Code Splitting) and Lazy Loading for components and images.

---

## 1. Bundle Optimization with Code Splitting

Code splitting is the most impactful way to optimize your application bundle. It allows you to split your code into various bundles which can then be loaded on demand or in parallel, instead of loading one massive bundle on initial load.

We will use React's built-in `React.lazy` and `Suspense` APIs.

### How to Implement

Imagine you have a `DashboardScreen` that is large and only shown to authenticated users. It's a perfect candidate for code splitting.

**Step 1: Use Dynamic `import()`**

Modify your routing logic (e.g., in `navigation/AppNavigator.tsx`) to use dynamic imports.

**Before:**
```typescript
import DashboardScreen from '../screens/DashboardScreen';

// ... inside your navigator
<Stack.Screen name="Dashboard" component={DashboardScreen} />
```

**After:**
```typescript
import React, { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

// 1. Use React.lazy to import the component dynamically
const LazyDashboardScreen = React.lazy(() => import('../screens/DashboardScreen'));

// 2. Create a Suspense-wrapped component
const DashboardScreen = (props) => (
  <Suspense fallback={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}>
    <LazyDashboardScreen {...props} />
  </Suspense>
);

// 3. Use the new component in your navigator
<Stack.Screen name="Dashboard" component={DashboardScreen} />
```

**Why this works:** The code for `DashboardScreen` will now be in a separate JavaScript file. It will only be downloaded and parsed by the browser/device when the user navigates to the "Dashboard" screen for the first time. The `Suspense` component shows a loading indicator while the user waits.

---

## 2. Lazy Loading Implementation

Lazy loading defers the loading of off-screen or non-critical resources until they are actually needed.

### a) Lazy Loading Components

This is the same technique as Code Splitting above. It's perfect for:
- Modals
- Tabs that are not initially visible
- Any complex component that is rendered conditionally

**Example: A Profile Edit Modal**

```typescript
import React, { Suspense, useState } from 'react';

const LazyEditProfileModal = React.lazy(() => import('../components/EditProfileModal'));

const ProfilePage = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setModalVisible(true)}>Edit Profile</button>
      {isModalVisible && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyEditProfileModal onClose={() => setModalVisible(false)} />
        </Suspense>
      )}
    </div>
  );
};
```

### b) Lazy Loading Images

For web, modern browsers provide a native and highly efficient way to lazy-load images using the `loading` attribute.

**Implementation:**

When using a custom `Image` component in your React Native for Web project, you can pass down this property.

```typescript
// In your cross-platform Image component (e.g., components/common/Image.tsx)

import { Image as RNImage, ImageProps } from 'react-native';

export const Image = (props: ImageProps & { loading?: 'lazy' | 'eager' }) => {
  // The `loading` prop will be automatically picked up by the browser on web builds
  return <RNImage {...props} />;
};
```

**Usage:**

When rendering a list of items with images, especially those further down the page:

```typescript
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 100, height: 100 }}
        loading="lazy" // This is the key!
      />
      <Text>{item.title}</Text>
    </View>
  )}
/>
```

**Result:** The browser will only request the image file when the user scrolls and the image is about to enter the viewport, significantly improving initial page load time and saving bandwidth.
