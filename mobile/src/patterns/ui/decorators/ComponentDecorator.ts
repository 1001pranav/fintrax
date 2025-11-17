/**
 * ComponentDecorator Interface
 * Base interface for UI component decorators
 * Part of the Decorator Pattern implementation
 */

import { GestureResponderEvent } from 'react-native';

export interface ComponentProps {
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  children?: React.ReactNode;
}

export interface ComponentDecorator {
  /**
   * Decorate the onPress handler
   * @param originalOnPress - Original press handler
   * @returns Decorated press handler
   */
  decorateOnPress?(
    originalOnPress?: (event: GestureResponderEvent) => void
  ): (event: GestureResponderEvent) => void;

  /**
   * Decorate component style
   * @param originalStyle - Original style
   * @returns Decorated style
   */
  decorateStyle?(originalStyle?: any): any;

  /**
   * Decorate component children
   * @param originalChildren - Original children
   * @returns Decorated children
   */
  decorateChildren?(originalChildren?: React.ReactNode): React.ReactNode;

  /**
   * Called before component renders
   */
  beforeRender?(): void;

  /**
   * Called after component renders
   */
  afterRender?(): void;
}
