export interface ThrowHistoryItem {
  id: string;
  gameId: string;
  gamePlayerId: string;
  playerName: string;
  dart1: number;
  dart2: number;
  dart3: number;
  score: number;
  remainingAfterThrow: number;
  roundNumber: number;
  isBust: boolean;
  createdAt: string;
}
