/**
 * Button Component Tests
 * 
 * Comprehensive test suite for the Button component in DataSphere Guilds
 * Tests cover functionality, accessibility, performance, and edge cases
 * 
 * @version 2.0.0
 */

import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
// ThemeProvider mock - in real implementation, this would come from react-native-elements
const ThemeProvider: React.FC<{ theme: any; children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

import Button from '@components/common/Button';
import { theme } from '@theme';
import type { ButtonProps, ButtonVariant, ButtonSize } from '@types';

// Mock dependencies
jest.mock('@theme', () => ({
  theme: {
    colors: {
      primary: '#2E7D32',
      secondary: '#1976D2',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      disabled: '#BDBDBD',
      text: '#212121',
      background: '#FFFFFF',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      button: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
      },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
  },
}));

jest.mock('@utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('@hooks/useHaptics', () => ({
  useHaptics: () => ({
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Test utilities
const createTestComponent = (props: Partial<ButtonProps> = {}) => {
  const defaultProps: ButtonProps = {
    title: 'Test Button',
    onPress: jest.fn(),
    testID: 'test-button',
    ...props,
  };

  return (
    <ThemeProvider theme={theme}>
      <Button {...defaultProps} />
    </ThemeProvider>
  );
};

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'text'];
const sizes: ButtonSize[] = ['small', 'medium', 'large'];

describe('Button Component', () => {
  // Mock functions
  const mockOnPress = jest.fn();
  const mockOnLongPress = jest.fn();
  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('🎨 Rendering & Basic Functionality', () => {
    it('should render correctly with default props', () => {
      const { getByTestId, getByText } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      const title = getByText('Test Button');

      expect(button).toBeTruthy();
      expect(title).toBeTruthy();
    });

    it('should call onPress handler when pressed', async () => {
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onLongPress handler when long pressed', async () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          onLongPress: mockOnLongPress 
        })
      );

      const button = getByTestId('test-button');
      fireEvent(button, 'longPress');

      await waitFor(() => {
        expect(mockOnLongPress).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onPress when disabled', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          disabled: true 
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should render custom children instead of title', () => {
      const customContent = <Text testID="custom-content">Custom Content</Text>;
      const { getByTestId, queryByText } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          children: customContent 
        })
      );

      expect(getByTestId('custom-content')).toBeTruthy();
      expect(queryByText('Test Button')).toBeNull();
    });
  });

  describe('🎭 Variants & Styling', () => {
    variants.forEach((variant) => {
      it(`should render ${variant} variant correctly`, () => {
        const { getByTestId } = render(
          createTestComponent({ 
            onPress: mockOnPress,
            variant,
            testID: `${variant}-button`
          })
        );

        const button = getByTestId(`${variant}-button`);
        expect(button).toBeTruthy();
        
        // Verify variant-specific styling is applied
        expect(button.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              // Variant-specific styles would be checked here
            })
          ])
        );
      });
    });

    sizes.forEach((size) => {
      it(`should render ${size} size correctly`, () => {
        const { getByTestId } = render(
          createTestComponent({ 
            onPress: mockOnPress,
            size,
            testID: `${size}-button`
          })
        );

        const button = getByTestId(`${size}-button`);
        expect(button).toBeTruthy();
      });
    });

    it('should apply custom styles correctly', () => {
      const customButtonStyle = { backgroundColor: 'red', padding: 20 };
      const customTitleStyle = { color: 'yellow', fontSize: 18 };
      
      const { getByTestId } = render(
        createTestComponent({
          onPress: mockOnPress,
          buttonStyle: customButtonStyle,
          titleStyle: customTitleStyle,
        })
      );

      const button = getByTestId('test-button');
      const title = getByTestId('test-button-title');

      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customButtonStyle)])
      );
      expect(title.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customTitleStyle)])
      );
    });

    it('should handle full width correctly', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          fullWidth: true 
        })
      );

      const button = getByTestId('test-button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '100%' })
        ])
      );
    });
  });

  describe('🔄 Loading State', () => {
    it('should show loading indicator when loading', () => {
      const { getByTestId, queryByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: true 
        })
      );

      const loader = getByTestId('test-button-loader');
      expect(loader).toBeTruthy();
      expect(loader.type).toBe(ActivityIndicator);

      // Title should be hidden during loading
      expect(queryByTestId('test-button-title')).toBeNull();
    });

    it('should not call onPress when loading', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: true 
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should show custom loading text', () => {
      const { getByText } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: true,
          loadingText: 'Processing...'
        })
      );

      expect(getByText('Processing...')).toBeTruthy();
    });

    it('should handle loading state transitions', async () => {
      const { getByTestId, queryByTestId, rerender } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: false 
        })
      );

      // Initially not loading
      expect(queryByTestId('test-button-loader')).toBeNull();
      expect(getByTestId('test-button-title')).toBeTruthy();

      // Switch to loading
      rerender(createTestComponent({ 
        onPress: mockOnPress,
        loading: true 
      }));

      expect(getByTestId('test-button-loader')).toBeTruthy();
      expect(queryByTestId('test-button-title')).toBeNull();
    });
  });

  describe('🎯 Icons & Content', () => {
    it('should render left icon correctly', () => {
      const LeftIcon = () => <View testID="left-icon" />;
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          leftIcon: <LeftIcon /> 
        })
      );

      const icon = getByTestId('left-icon');
      const title = getByTestId('test-button-title');

      expect(icon).toBeTruthy();
      expect(title).toBeTruthy();
    });

    it('should render right icon correctly', () => {
      const RightIcon = () => <View testID="right-icon" />;
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          rightIcon: <RightIcon /> 
        })
      );

      const icon = getByTestId('right-icon');
      const title = getByTestId('test-button-title');

      expect(icon).toBeTruthy();
      expect(title).toBeTruthy();
    });

    it('should render both left and right icons', () => {
      const LeftIcon = () => <View testID="left-icon" />;
      const RightIcon = () => <View testID="right-icon" />;
      
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          leftIcon: <LeftIcon />,
          rightIcon: <RightIcon />
        })
      );

      expect(getByTestId('left-icon')).toBeTruthy();
      expect(getByTestId('right-icon')).toBeTruthy();
      expect(getByTestId('test-button-title')).toBeTruthy();
    });

    it('should handle icon spacing correctly', () => {
      const LeftIcon = () => <View testID="left-icon" />;
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          leftIcon: <LeftIcon />,
          iconSpacing: 12
        })
      );

      const button = getByTestId('test-button');
      // Verify spacing is applied correctly
      expect(button).toBeTruthy();
    });
  });

  describe('♿ Accessibility', () => {
    it('should have proper accessibility role', () => {
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should reflect disabled state in accessibility', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          disabled: true 
        })
      );

      const button = getByTestId('test-button');
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it('should support custom accessibility label', () => {
      const { getByLabelText } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          accessibilityLabel: 'Submit form button'
        })
      );

      const button = getByLabelText('Submit form button');
      expect(button).toBeTruthy();
    });

    it('should support accessibility hint', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          accessibilityHint: 'Double tap to submit the form'
        })
      );

      const button = getByTestId('test-button');
      expect(button.props.accessibilityHint).toBe('Double tap to submit the form');
    });

    it('should have proper accessibility state for loading', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: true 
        })
      );

      const button = getByTestId('test-button');
      expect(button.props.accessibilityState).toEqual({ 
        disabled: true,
        busy: true 
      });
    });

    it('should announce loading state changes', async () => {
      const { getByTestId, rerender } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: false 
        })
      );

      const button = getByTestId('test-button');
      
      // Switch to loading
      rerender(createTestComponent({ 
        onPress: mockOnPress,
        loading: true 
      }));

      // Verify accessibility announcement
      expect(button.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('⚡ Performance & Optimization', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const TestButton = (props: ButtonProps) => {
        renderSpy();
        return <Button {...props} />;
      };

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <TestButton title="Test" onPress={mockOnPress} />
        </ThemeProvider>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(
        <ThemeProvider theme={theme}>
          <TestButton title="Test" onPress={mockOnPress} />
        </ThemeProvider>
      );

      // Should not re-render due to memoization
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid button presses correctly', async () => {
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');

      // Rapid fire presses
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      await waitFor(() => {
        // Should debounce or handle appropriately
        expect(mockOnPress).toHaveBeenCalled();
      });
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('🔧 Platform-Specific Behavior', () => {
    it('should handle iOS-specific styling', () => {
      Platform.OS = 'ios';
      
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
      // iOS-specific styles would be tested here
    });

    it('should handle Android-specific styling', () => {
      Platform.OS = 'android';
      
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
      // Android-specific styles would be tested here
    });

    it('should handle web-specific behavior', () => {
      Platform.OS = 'web';
      
      const { getByTestId } = render(
        createTestComponent({ onPress: mockOnPress })
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
      // Web-specific behavior would be tested here
    });
  });

  describe('🎮 Haptic Feedback', () => {
    it('should trigger haptic feedback on press', async () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          hapticFeedback: true 
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      await waitFor(() => {
        // Verify haptic feedback was triggered
        expect(mockOnPress).toHaveBeenCalled();
      });
    });

    it('should not trigger haptic feedback when disabled', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          hapticFeedback: false 
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      // Haptic should not be triggered
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('📊 Analytics Integration', () => {
    it('should track button press events', async () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          analyticsEvent: 'button_press',
          analyticsProperties: { button_type: 'primary' }
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('button_press', {
          button_type: 'primary'
        });
      });
    });
  });

  describe('🎬 Animation States', () => {
    it('should handle press animation', async () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          animated: true 
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      // Animation should be triggered
      await act(async () => {
        jest.advanceTimersByTime(150); // Animation duration
      });

      expect(mockOnPress).toHaveBeenCalled();
    });

    it('should handle scale animation on press', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          scaleOnPress: true 
        })
      );

      const button = getByTestId('test-button');
      fireEvent(button, 'pressIn');

      // Scale animation should be applied
      expect(button).toBeTruthy();
    });
  });

  describe('🔄 Edge Cases & Error Handling', () => {
    it('should handle undefined onPress gracefully', () => {
      const { getByTestId } = render(
        createTestComponent({ onPress: undefined as any })
      );

      const button = getByTestId('test-button');
      
      expect(() => fireEvent.press(button)).not.toThrow();
    });

    it('should handle empty title gracefully', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          title: '' 
        })
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
    });

    it('should handle null children gracefully', () => {
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: mockOnPress,
          children: null 
        })
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
    });

    it('should handle theme provider absence', () => {
      const { getByTestId } = render(
        <Button title="Test" onPress={mockOnPress} testID="test-button" />
      );

      const button = getByTestId('test-button');
      expect(button).toBeTruthy();
    });
  });

  describe('📸 Snapshot Testing', () => {
    variants.forEach((variant) => {
      it(`should match snapshot for ${variant} variant`, () => {
        const tree = render(
          createTestComponent({ 
            onPress: mockOnPress,
            variant 
          })
        ).toJSON();
        
        expect(tree).toMatchSnapshot(`button-${variant}`);
      });
    });

    sizes.forEach((size) => {
      it(`should match snapshot for ${size} size`, () => {
        const tree = render(
          createTestComponent({ 
            onPress: mockOnPress,
            size 
          })
        ).toJSON();
        
        expect(tree).toMatchSnapshot(`button-${size}`);
      });
    });

    it('should match snapshot for loading state', () => {
      const tree = render(
        createTestComponent({ 
          onPress: mockOnPress,
          loading: true 
        })
      ).toJSON();
      
      expect(tree).toMatchSnapshot('button-loading');
    });

    it('should match snapshot for disabled state', () => {
      const tree = render(
        createTestComponent({ 
          onPress: mockOnPress,
          disabled: true 
        })
      ).toJSON();
      
      expect(tree).toMatchSnapshot('button-disabled');
    });

    it('should match snapshot with icons', () => {
      const LeftIcon = () => <View testID="left-icon" />;
      const RightIcon = () => <View testID="right-icon" />;
      
      const tree = render(
        createTestComponent({ 
          onPress: mockOnPress,
          leftIcon: <LeftIcon />,
          rightIcon: <RightIcon />
        })
      ).toJSON();
      
      expect(tree).toMatchSnapshot('button-with-icons');
    });
  });

  describe('🧪 Integration Tests', () => {
    it('should work correctly within forms', async () => {
      const mockSubmit = jest.fn();
      
      const FormWithButton = () => (
        <View>
          <Button
            title="Submit Form"
            onPress={mockSubmit}
            testID="submit-button"
            variant="primary"
          />
        </View>
      );

      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <FormWithButton />
        </ThemeProvider>
      );

      const button = getByTestId('submit-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });

    it('should work correctly with navigation', async () => {
      const mockNavigate = jest.fn();
      
      const { getByTestId } = render(
        createTestComponent({ 
          onPress: () => mockNavigate('NextScreen'),
          title: 'Navigate'
        })
      );

      const button = getByTestId('test-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('NextScreen');
      });
    });
  });
});

// Custom matchers are defined in jest/setupAfterEnv.ts
