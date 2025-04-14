// lib/types.ts

// Types for the game data and state

export interface Statement {
    id: number;
    text: string;
    value: number;
  }
  
  export interface Claim {
    id: number;
    text: string;
  }
  
  export interface Evidence {
    id: number;
    type: 'ethos' | 'pathos' | 'logos';
    text: string;
  }
  
  export interface ChallengeContent {
    statements?: Statement[];
    categories?: string[];
    claims?: Claim[];
    evidence?: Evidence[];
    traps?: number[];
    audiences?: string[];
    topics?: string[];
    approaches?: any[];
    startPoint?: string;
    paths?: any[];
    components?: any[];
    flaws?: any[];
    order?: number[];
    solution: string;
  }
  
  export interface Challenge {
    id: number;
    title: string;
    description: string;
    instructions: string;
    content: ChallengeContent;
    hints: string[];
    timePenalty: number;
  }
  
  export interface GameSettings {
    totalTime: number;
    hintsAvailable: number;
    timePenaltyPerHint: number;
    timePenaltyPerWrongAnswer: number;
  }
  
  export interface GameState {
    currentChallenge: number;
    completedChallenges: number[];
    hintsUsed: {[challengeId: number]: number[]};
    totalPenalties: number;
    startTime: number;
    endTime?: number;
    teamId: string;
    teamName: string;
  }
  
  export interface GameContextType {
    gameState: GameState;
    updateGameState: (newState: Partial<GameState>) => void;
    useHint: (challengeId: number, hintIndex: number) => void;
    completeChallenge: (challengeId: number) => void;
    addPenalty: (minutes: number) => void;
    resetGame: () => void;
  }