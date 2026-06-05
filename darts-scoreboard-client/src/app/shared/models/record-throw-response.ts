export interface RecordThrowResponse {
  gameId: string;
  playerId: string;
  dart1: number;
  dart2: number;
  dart3: number;
  score: number;
  remainingScore: number;
  isBust: boolean;
  isGameFinished: boolean;
  winnerPlayerId: string | null;
  checkoutSuggestion: string | null;
}
