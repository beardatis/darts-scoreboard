import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../shared/models/player';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-create',
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './game-create.html',
  styleUrl: './game-create.scss'
})
export class GameCreate implements OnInit {

  players: Player[] = [];
  selectedPlayerIds: string[] = [];
  gameType = 2; // 501
  isCreatingGame = false;

  constructor(
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  startGame(): void {
    if (this.isCreatingGame) {
      return;
    }

    if (this.selectedPlayerIds.length < 1) {
      alert(
        this.translateService.instant('GAME_CREATE.ERROR_SELECT_PLAYER')
      );
      return;
    }

    this.isCreatingGame = true;
    this.changeDetectorRef.detectChanges();

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

          this.isCreatingGame = false;
          this.changeDetectorRef.detectChanges();

          alert(
            this.translateService.instant('GAME_CREATE.ERROR_CREATE_GAME')
          );
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

    this.changeDetectorRef.detectChanges();
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

    this.changeDetectorRef.detectChanges();
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
}
