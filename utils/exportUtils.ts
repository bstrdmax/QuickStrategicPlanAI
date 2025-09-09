import type { StrategicPlan, TitledItem } from '../types';
import { StrategyType } from '../types';

const formatTitledItems = (items: TitledItem[], level: 'text' | 'markdown'): string => {
  if (!items || items.length === 0) return 'Not specified.';
  if (level === 'markdown') {
    return items.map(item => `### ${item.title}\n\n${item.description}`).join('\n\n');
  }
  return items.map(item => `${item.title}\n${item.description}`).join('\n\n');
};

const formatList = (items: string[], level: 'text' | 'markdown'): string => {
    if (!items || items.length === 0) return 'Not specified.';
    if (level === 'markdown') {
        return items.map(item => `- ${item}`).join('\n');
    }
    return items.map(item => `- ${item}`).join('\n');
};

export function planToPlainText(plan: StrategicPlan): string {
  const sections = [
    `STRATEGIC DIRECTION\n${plan.direction}`,
    `HOW WE WILL WIN\nStrategy: ${plan.howToWin.strategy === StrategyType.PRICE ? 'Price Leadership' : 'Differentiation'}\n${plan.howToWin.justification}`,
    `REQUIRED CAPABILITIES\n${formatList(plan.capabilities, 'text')}`,
    `LEADERSHIP APPROACH\n${plan.leadership}`,
    `GOALS\n${formatTitledItems(plan.goals, 'text')}`,
    `OBJECTIVES\n${formatTitledItems(plan.objectives, 'text')}`,
    `INITIATIVES\n${formatTitledItems(plan.initiatives, 'text')}`,
    `KEY TASKS\n${formatTitledItems(plan.tasks, 'text')}`,
  ];
  return sections.join('\n\n\n');
}

export function planToMarkdown(plan: StrategicPlan): string {
    const sections = [
        `# Quick Strategic Plan`,
        `## Strategic Direction\n\n${plan.direction}`,
        `## How We Will Win\n\n**Strategy:** ${plan.howToWin.strategy === StrategyType.PRICE ? 'Price Leadership' : 'Differentiation'}\n\n> ${plan.howToWin.justification}`,
        `## Required Capabilities\n\n${formatList(plan.capabilities, 'markdown')}`,
        `## Leadership Approach\n\n${plan.leadership}`,
        `## Goals\n\n${formatTitledItems(plan.goals, 'markdown')}`,
        `## Objectives\n\n${formatTitledItems(plan.objectives, 'markdown')}`,
        `## Initiatives\n\n${formatTitledItems(plan.initiatives, 'markdown')}`,
        `## Key Tasks\n\n${formatTitledItems(plan.tasks, 'markdown')}`,
    ];
    return sections.join('\n\n---\n\n');
}