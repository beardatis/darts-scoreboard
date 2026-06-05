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
