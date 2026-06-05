export interface GamePlayer {
  gamePlayerId: string;
  playerId: string;
  playerName: string;
  startingScore: number;
  remainingScore: number;
  isActiveInGame: boolean;
  checkoutSuggestion: string | null;
}
