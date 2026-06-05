import { GamePlayer } from './game-player';

export interface GameDetailsModel {
  id: string;
  gameType: number;
  status: number;
  createdByUserId: string;
  winnerPlayerId: string | null;
  startedAt: string;
  finishedAt: string | null;
  players: GamePlayer[];
}
