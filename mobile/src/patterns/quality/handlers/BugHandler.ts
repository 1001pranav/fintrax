/**
 * Chain of Responsibility Pattern - Bug Handler
 *
 * Handles bug triage by passing bugs through a chain of handlers.
 * Each handler determines if it can handle the bug or passes it to the next handler.
 */

import { Bug, BugPriority } from '../../testing/types';

export interface IBugHandler {
  setNext(handler: IBugHandler): IBugHandler;
  handle(bug: Bug): BugPriority | null;
}

export abstract class AbstractBugHandler implements IBugHandler {
  private nextHandler: IBugHandler | null = null;

  setNext(handler: IBugHandler): IBugHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(bug: Bug): BugPriority | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(bug);
    }
    return null;
  }

  protected logTriage(bug: Bug, priority: BugPriority, reason: string): void {
    console.log(`[Bug Triage] ${bug.id} → ${priority}: ${reason}`);
  }
}

/**
 * Handler for crash bugs (highest priority)
 */
export class CrashBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    if (bug.type === 'crash' || bug.severity === 'critical') {
      const priority = 'P0';
      this.logTriage(bug, priority, 'App crashes are blocking issues');
      return priority;
    }
    return super.handle(bug);
  }
}

/**
 * Handler for data loss bugs
 */
export class DataLossBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    if (
      bug.type === 'data_loss' ||
      bug.category === 'sync' ||
      bug.title.toLowerCase().includes('data loss') ||
      bug.title.toLowerCase().includes('data lost')
    ) {
      const priority = 'P0';
      this.logTriage(bug, priority, 'Data loss is unacceptable');
      return priority;
    }
    return super.handle(bug);
  }
}

/**
 * Handler for security bugs
 */
export class SecurityBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    if (
      bug.type === 'security' ||
      bug.tags.includes('vulnerability') ||
      bug.tags.includes('security') ||
      bug.severity === 'critical'
    ) {
      const priority = 'P1';
      this.logTriage(bug, priority, 'Security vulnerabilities need urgent attention');
      return priority;
    }
    return super.handle(bug);
  }
}

/**
 * Handler for performance bugs
 */
export class PerformanceBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    if (
      bug.type === 'performance' ||
      bug.category === 'ui' ||
      bug.tags.includes('slow') ||
      bug.severity === 'high'
    ) {
      const priority = 'P2';
      this.logTriage(bug, priority, 'Performance issues impact user experience');
      return priority;
    }
    return super.handle(bug);
  }
}

/**
 * Handler for UI bugs
 */
export class UIBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    if (bug.type === 'ui' || bug.category === 'ui' || bug.tags.includes('ui')) {
      const priority = bug.severity === 'high' ? 'P2' : 'P3';
      this.logTriage(bug, priority, 'UI bugs should be fixed based on severity');
      return priority;
    }
    return super.handle(bug);
  }
}

/**
 * Default handler for all other bugs
 */
export class DefaultBugHandler extends AbstractBugHandler {
  handle(bug: Bug): BugPriority | null {
    const priority = 'P3';
    this.logTriage(bug, priority, 'Default priority for other bugs');
    return priority;
  }
}

/**
 * Bug Triage Service
 */
export class BugTriageService {
  private handlerChain: IBugHandler;

  constructor() {
    // Build the chain
    const crashHandler = new CrashBugHandler();
    const dataLossHandler = new DataLossBugHandler();
    const securityHandler = new SecurityBugHandler();
    const performanceHandler = new PerformanceBugHandler();
    const uiHandler = new UIBugHandler();
    const defaultHandler = new DefaultBugHandler();

    crashHandler
      .setNext(dataLossHandler)
      .setNext(securityHandler)
      .setNext(performanceHandler)
      .setNext(uiHandler)
      .setNext(defaultHandler);

    this.handlerChain = crashHandler;
  }

  triageBug(bug: Bug): BugPriority {
    console.log(`\n[Bug Triage] Processing bug: ${bug.title}`);
    const priority = this.handlerChain.handle(bug);
    return priority || 'P3';
  }

  triageMultipleBugs(bugs: Bug[]): Map<BugPriority, Bug[]> {
    const categorized = new Map<BugPriority, Bug[]>();
    categorized.set('P0', []);
    categorized.set('P1', []);
    categorized.set('P2', []);
    categorized.set('P3', []);

    for (const bug of bugs) {
      const priority = this.triageBug(bug);
      categorized.get(priority)?.push(bug);
    }

    return categorized;
  }
}

/**
 * Usage:
 *
 * const triageService = new BugTriageService();
 *
 * const bug: Bug = {
 *   id: 'bug-001',
 *   type: 'crash',
 *   severity: 'critical',
 *   category: 'auth',
 *   title: 'App crashes on login',
 *   description: 'App crashes when user tries to login',
 *   tags: ['crash', 'auth'],
 *   createdAt: new Date().toISOString(),
 * };
 *
 * const priority = triageService.triageBug(bug);
 * // Output: P0 (blocking)
 */
