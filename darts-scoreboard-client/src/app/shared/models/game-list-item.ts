export interface GameListItem {
  id: string;
  gameType: number;
  status: number;
  winnerPlayerId: string | null;
  startedAt: string;
  finishedAt: string | null;
}
