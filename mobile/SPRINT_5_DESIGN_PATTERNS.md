# SPRINT 5 DESIGN PATTERNS

## Overview

This document outlines the design patterns implemented in Sprint 5 of the Fintrax Mobile App.
Sprint 5 focuses on Biometrics, Notifications, and Polish with professional design patterns.

---

## Design Patterns Used

### 1. Strategy Pattern

**Used in:**
- Biometric Authentication (US-5.1)
- Dark Mode / Theme Management (US-5.4)

**Purpose:**
Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
The strategy pattern lets the algorithm vary independently from clients that use it.

**Implementation:**

```typescript
// Biometric Authentication Strategy
interface AuthenticationStrategy {
  authenticate(): Promise<AuthResult>;
  isAvailable(): Promise<boolean>;
  getType(): string;
}

class FaceIDStrategy implements AuthenticationStrategy { ... }
class TouchIDStrategy implements AuthenticationStrategy { ... }
class FingerprintStrategy implements AuthenticationStrategy { ... }
class PasswordStrategy implements AuthenticationStrategy { ... }

// Theme Strategy
interface ThemeStrategy {
  getColors(): ColorScheme;
  getName(): string;
}

class LightThemeStrategy implements ThemeStrategy { ... }
class DarkThemeStrategy implements ThemeStrategy { ... }
class AutoThemeStrategy implements ThemeStrategy { ... }
```

**Benefits:**
- Easy to add new authentication methods
- Cleaner code with single responsibility
- Runtime algorithm switching
- Testable individual strategies

---

### 2. Observer Pattern

**Used in:**
- Push Notifications (US-5.2)
- Task Reminders (US-5.3)

**Purpose:**
Defines a one-to-many dependency between objects so that when one object changes state,
all its dependents are notified and updated automatically.

**Implementation:**

```typescript
// Notification Observer
interface NotificationObserver {
  update(notification: Notification): void;
}

class NotificationSubject {
  private observers: NotificationObserver[] = [];

  attach(observer: NotificationObserver): void { ... }
  detach(observer: NotificationObserver): void { ... }
  notify(notification: Notification): void { ... }
}

class TaskReminderObserver implements NotificationObserver { ... }
class FinanceAlertObserver implements NotificationObserver { ... }
```

**Benefits:**
- Loose coupling between notification service and handlers
- Easy to add new notification types
- Centralized notification management
- Event-driven architecture

---

### 3. Factory Pattern

**Used in:**
- Task Reminder Creation (US-5.3)
- Notification Creation (US-5.2)

**Purpose:**
Defines an interface for creating objects, but lets subclasses decide which class to instantiate.
Factory pattern lets a class defer instantiation to subclasses.

**Implementation:**

```typescript
// Notification Factory
interface NotificationFactory {
  createNotification(type: NotificationType, data: any): Notification;
}

class TaskReminderFactory implements NotificationFactory {
  createNotification(type: NotificationType, data: TaskData): Notification {
    // Create task reminder notification with specific formatting
  }
}

class FinanceAlertFactory implements NotificationFactory {
  createNotification(type: NotificationType, data: FinanceData): Notification {
    // Create finance alert notification with specific formatting
  }
}
```

**Benefits:**
- Centralized object creation logic
- Easy to extend with new notification types
- Consistent notification structure
- Encapsulates complex creation logic

---

### 4. Singleton Pattern

**Used in:**
- Biometric Service (US-5.1)
- Notification Service (US-5.2)
- Theme Manager (US-5.4)

**Purpose:**
Ensures a class has only one instance and provides a global point of access to it.

**Implementation:**

```typescript
class BiometricService {
  private static instance: BiometricService;

  private constructor() { ... }

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  authenticate(): Promise<AuthResult> { ... }
}
```

**Benefits:**
- Single source of truth
- Controlled access to sole instance
- Reduced namespace pollution
- Permits lazy initialization

---

### 5. State Pattern

**Used in:**
- Loading States (US-5.6)
- Pull-to-Refresh States (US-5.6)

**Purpose:**
Allows an object to alter its behavior when its internal state changes.
The object will appear to change its class.

**Implementation:**

```typescript
interface LoadingState {
  handle(context: LoadingContext): void;
  render(): React.ReactElement;
}

class IdleState implements LoadingState {
  handle(context: LoadingContext): void {
    // Handle idle state
  }
  render(): React.ReactElement {
    return <View />;
  }
}

class LoadingState implements LoadingState {
  handle(context: LoadingContext): void {
    // Handle loading state
  }
  render(): React.ReactElement {
    return <LoadingSkeleton />;
  }
}

class RefreshingState implements LoadingState { ... }
class ErrorState implements LoadingState { ... }
class SuccessState implements LoadingState { ... }
```

**Benefits:**
- Cleaner state management
- Eliminates complex conditional logic
- Each state is encapsulated
- Easy to add new states

---

### 6. Decorator Pattern

**Used in:**
- UI Animations (US-5.7)
- Haptic Feedback (US-5.7)
- Component Enhancement (US-5.7)

**Purpose:**
Attaches additional responsibilities to an object dynamically.
Decorators provide a flexible alternative to subclassing for extending functionality.

**Implementation:**

```typescript
interface UIComponent {
  render(): React.ReactElement;
  onPress(): void;
}

class BasicButton implements UIComponent {
  render(): React.ReactElement { ... }
  onPress(): void { ... }
}

class HapticDecorator implements UIComponent {
  private component: UIComponent;

  constructor(component: UIComponent) {
    this.component = component;
  }

  render(): React.ReactElement {
    return this.component.render();
  }

  onPress(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.component.onPress();
  }
}

class AnimatedDecorator implements UIComponent { ... }
class LoadingDecorator implements UIComponent { ... }
```

**Benefits:**
- Extends behavior without modifying original component
- Composable enhancements
- Follows Open/Closed Principle
- Runtime behavior modification

---

### 7. MVC (Model-View-Controller) Pattern

**Used in:**
- Settings & Profile Screen (US-5.8)

**Purpose:**
Separates application into three interconnected components: Model, View, and Controller.

**Implementation:**

```typescript
// Model
class UserProfileModel {
  private user: User;

  getUser(): User { ... }
  updateUser(user: User): void { ... }
  saveToStorage(): Promise<void> { ... }
}

// View
const ProfileView: React.FC<{ user: User; onUpdate: (user: User) => void }> = ({
  user,
  onUpdate,
}) => {
  return <View>...</View>;
};

// Controller
class ProfileController {
  private model: UserProfileModel;

  constructor(model: UserProfileModel) {
    this.model = model;
  }

  getProfile(): User {
    return this.model.getUser();
  }

  updateProfile(user: User): void {
    this.model.updateUser(user);
    this.model.saveToStorage();
  }
}
```

**Benefits:**
- Clear separation of concerns
- Easier testing
- Reusable components
- Better maintainability

---

## Pattern Relationships

### Composite Patterns

Several patterns work together in Sprint 5:

1. **Authentication Flow:**
   - Strategy Pattern (authentication methods)
   - Singleton Pattern (service instance)
   - State Pattern (authentication states)

2. **Notification System:**
   - Observer Pattern (notification delivery)
   - Factory Pattern (notification creation)
   - Singleton Pattern (service instance)

3. **UI Enhancement:**
   - Decorator Pattern (haptics, animations)
   - State Pattern (loading states)
   - Strategy Pattern (theme)

---

## Design Principles Applied

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each strategy handles one authentication method
   - Each factory creates one type of notification
   - Each state handles one loading state

2. **Open/Closed Principle (OCP)**
   - Strategies are open for extension, closed for modification
   - Decorators add behavior without modifying original components

3. **Liskov Substitution Principle (LSP)**
   - All authentication strategies can be used interchangeably
   - All theme strategies can be swapped at runtime

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces (AuthenticationStrategy, ThemeStrategy)
   - Clients depend only on methods they use

5. **Dependency Inversion Principle (DIP)**
   - High-level modules depend on abstractions (interfaces)
   - Concrete implementations injected at runtime

### Additional Principles

- **DRY (Don't Repeat Yourself):** Shared logic in base classes/utilities
- **KISS (Keep It Simple, Stupid):** Simple, focused implementations
- **YAGNI (You Aren't Gonna Need It):** Only implement what's needed

---

## File Structure

```
src/
├── patterns/
│   ├── authentication/
│   │   ├── strategies/
│   │   │   ├── AuthenticationStrategy.ts
│   │   │   ├── FaceIDStrategy.ts
│   │   │   ├── TouchIDStrategy.ts
│   │   │   ├── FingerprintStrategy.ts
│   │   │   └── PasswordStrategy.ts
│   │   └── BiometricService.ts (Singleton)
│   ├── notifications/
│   │   ├── observers/
│   │   │   ├── NotificationObserver.ts
│   │   │   ├── TaskReminderObserver.ts
│   │   │   └── FinanceAlertObserver.ts
│   │   ├── factories/
│   │   │   ├── NotificationFactory.ts
│   │   │   ├── TaskReminderFactory.ts
│   │   │   └── FinanceAlertFactory.ts
│   │   └── NotificationService.ts (Singleton + Observer)
│   ├── theme/
│   │   ├── strategies/
│   │   │   ├── ThemeStrategy.ts
│   │   │   ├── LightThemeStrategy.ts
│   │   │   ├── DarkThemeStrategy.ts
│   │   │   └── AutoThemeStrategy.ts
│   │   └── ThemeManager.ts (Singleton)
│   ├── loading/
│   │   ├── states/
│   │   │   ├── LoadingState.ts
│   │   │   ├── IdleState.ts
│   │   │   ├── LoadingState.ts
│   │   │   ├── RefreshingState.ts
│   │   │   ├── ErrorState.ts
│   │   │   └── SuccessState.ts
│   │   └── LoadingContext.ts
│   └── ui/
│       ├── decorators/
│       │   ├── ComponentDecorator.ts
│       │   ├── HapticDecorator.tsx
│       │   ├── AnimatedDecorator.tsx
│       │   └── LoadingDecorator.tsx
│       └── components/
│           └── EnhancedButton.tsx
├── services/
│   ├── BiometricService.ts
│   ├── NotificationService.ts
│   └── ThemeService.ts
└── screens/
    └── settings/
        ├── SettingsScreen.tsx (View)
        ├── ProfileController.ts (Controller)
        └── UserProfileModel.ts (Model)
```

---

## Testing Strategies

### Unit Testing Patterns

```typescript
describe('BiometricService (Singleton)', () => {
  it('should return the same instance', () => {
    const instance1 = BiometricService.getInstance();
    const instance2 = BiometricService.getInstance();
    expect(instance1).toBe(instance2);
  });
});

describe('FaceIDStrategy', () => {
  it('should authenticate successfully', async () => {
    const strategy = new FaceIDStrategy();
    const result = await strategy.authenticate();
    expect(result.success).toBe(true);
  });
});

describe('NotificationFactory', () => {
  it('should create task reminder notification', () => {
    const factory = new TaskReminderFactory();
    const notification = factory.createNotification('task_reminder', taskData);
    expect(notification.type).toBe('task_reminder');
  });
});
```

---

## Performance Considerations

1. **Lazy Initialization:** Singletons initialized only when needed
2. **Memoization:** Strategies memoize expensive operations
3. **Event Debouncing:** Observers debounce rapid events
4. **Component Memoization:** React.memo for decorated components

---

## Security Considerations

1. **Biometric Data:** Never stored, only used for authentication
2. **Secure Storage:** Tokens stored in expo-secure-store
3. **Encryption:** Sensitive data encrypted before storage
4. **Validation:** Input validation in all controllers

---

## Future Enhancements

1. **Chain of Responsibility:** For notification priority handling
2. **Command Pattern:** For undo/redo functionality
3. **Proxy Pattern:** For API caching
4. **Adapter Pattern:** For third-party service integration

---

## References

- **Design Patterns: Elements of Reusable Object-Oriented Software** (Gang of Four)
- **Head First Design Patterns** (Freeman & Freeman)
- **React Design Patterns and Best Practices** (Gomes)
- **TypeScript Design Patterns** (Lozovyk)

---

**Document Version:** 1.0
**Sprint:** 5
**Last Updated:** November 17, 2025
**Status:** Implementation In Progress
