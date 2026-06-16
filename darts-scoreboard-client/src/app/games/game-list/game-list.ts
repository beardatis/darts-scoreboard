import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../core/services/game.service';
import { GameListItem } from '../../shared/models/game-list-item';

@Component({
  selector: 'app-game-list',
  imports: [
    CommonModule
  ],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss'
})
export class GameList implements OnInit {

  games: GameListItem[] = [];

  deletingGameIds: string[] = [];

  mode: 'active' | 'history' = 'active';

  constructor(
    private readonly gameService: GameService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;

    if (path === 'games/history') {
      this.mode = 'history';
    }

    this.loadGames();
  }

  get activeGames(): GameListItem[] {
    return this.games.filter(game => game.status === 1);
  }

  get finishedGames(): GameListItem[] {
    return this.games.filter(game => game.status === 2);
  }

  openGame(gameId: string): void {
    this.router.navigate([
      '/games',
      gameId
    ]);
  }

  abandonGame(gameId: string): void {
    this.deleteGameInternal(
      gameId,
      'Biztosan elveted az aktív játékot?'
    );
  }

  deleteGame(gameId: string): void {
    this.deleteGameInternal(
      gameId,
      'Biztosan törlöd ezt a befejezett játékot?'
    );
  }

  private deleteGameInternal(
    gameId: string,
    confirmMessage: string
  ): void {
    if (this.deletingGameIds.includes(gameId)) {
      return;
    }

    const confirmed = confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    this.deletingGameIds.push(gameId);
    this.changeDetectorRef.detectChanges();

    this.gameService.deleteGame(gameId)
      .subscribe({
        next: () => {
          this.games =
            this.games.filter(game => game.id !== gameId);

          this.deletingGameIds =
            this.deletingGameIds.filter(id => id !== gameId);

          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.deletingGameIds =
            this.deletingGameIds.filter(id => id !== gameId);

          this.changeDetectorRef.detectChanges();

          console.error(error);
          alert('Nem sikerült törölni a játékot.');
        }
      });
  }

  private loadGames(): void {
    this.gameService
      .getGames()
      .subscribe({
        next: games => {
          this.games = games;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
        }
      });
  }
}
