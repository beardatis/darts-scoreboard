import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../shared/models/player';

import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-create',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './game-create.html',
  styleUrl: './game-create.scss'
})
export class GameCreate implements OnInit {

  players: Player[] = [];

  selectedPlayerIds: string[] = [];

  gameType = 2; // 501

  constructor(
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  private loadPlayers(): void {
    this.playerService.getPlayers()
      .subscribe({
        next: players => {
          console.log('Game create players:', players);
          this.players = players;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error('Game create players error:', error);
        }
      });
  }
  togglePlayer(
    playerId: string,
    checked: boolean
  ): void {

    if (checked) {

      if (!this.selectedPlayerIds.includes(playerId)) {
        this.selectedPlayerIds.push(playerId);
      }

      return;
    }

    this.selectedPlayerIds =
      this.selectedPlayerIds.filter(
        id => id !== playerId
      );
  }

  startGame(): void {

    if (this.selectedPlayerIds.length < 1) {
      alert('Legalább egy játékost válassz.');
      return;
    }

    this.gameService.createGame({
      gameType: this.gameType,
      playerIds: this.selectedPlayerIds
    })
      .subscribe({
        next: gameId => {

          console.log('Game created:', gameId);

          this.router.navigate([
            '/games',
            gameId
          ]);
        },
        error: error => {
          console.error(error);
          alert('Nem sikerült létrehozni a játékot.');
        }
      });
  }
  movePlayerUp(playerId: string): void {

    const index =
      this.selectedPlayerIds.indexOf(playerId);

    if (index <= 0) {
      return;
    }

    [
      this.selectedPlayerIds[index - 1],
      this.selectedPlayerIds[index]
    ] = [
      this.selectedPlayerIds[index],
      this.selectedPlayerIds[index - 1]
    ];
  }
  movePlayerDown(playerId: string): void {

    const index =
      this.selectedPlayerIds.indexOf(playerId);

    if (
      index < 0 ||
      index >= this.selectedPlayerIds.length - 1
    ) {
      return;
    }

    [
      this.selectedPlayerIds[index],
      this.selectedPlayerIds[index + 1]
    ] = [
      this.selectedPlayerIds[index + 1],
      this.selectedPlayerIds[index]
    ];
  }
  togglePlayerSelection(playerId: string): void {

    if (this.selectedPlayerIds.includes(playerId)) {
      this.selectedPlayerIds =
        this.selectedPlayerIds.filter(
          id => id !== playerId
        );

      return;
    }

    this.selectedPlayerIds.push(playerId);
  }
}
