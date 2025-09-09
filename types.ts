
export enum StrategyType {
  PRICE = 'PRICE',
  DIFFERENTIATION = 'DIFFERENTIATION',
}

export interface HowToWin {
  strategy: StrategyType;
  justification: string;
}

export interface TitledItem {
  title: string;
  description: string;
}

export interface StrategicPlan {
  direction: string;
  howToWin: HowToWin;
  capabilities: string[];
  leadership: string;
  goals: TitledItem[];
  objectives: TitledItem[];
  initiatives: TitledItem[];
  tasks: TitledItem[];
}
