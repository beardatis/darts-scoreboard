import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { GameService } from '../../core/services/game.service';
import { GameDetailsModel } from '../../shared/models/game-details-model';
import { RecordThrowRequest } from '../../shared/models/record-throw-request';
import { ThrowHistoryItem } from '../../shared/models/throw-history-item';

@Component({
  selector: 'app-game-details',
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss'
})
export class GameDetails implements OnInit {

  hasSelectedAnyDart = false;

  game: GameDetailsModel | null = null;

  activePlayerIndex = 0;
  selectedMultiplier = 1;

  currentDarts: number[] = [0, 0, 0];
  currentDartIndex = 0;

  currentDartsDoubleOut: boolean[] = [
    false,
    false,
    false
  ];

  lastThrows: {
    [playerId: string]: number;
  } = {};

  checkoutSuggestions: {
    [playerId: string]: string | null;
  } = {};

  isGameFinished = false;
  winnerPlayerId: string | null = null;

  throws: ThrowHistoryItem[] = [];

  isRecordingThrow = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly gameService: GameService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    const gameId: string | null =
      this.route.snapshot.paramMap.get('id');

    if (gameId === null) {
      return;
    }

    this.loadGame(gameId);
    this.loadThrows(gameId);
  }

  setDouble(): void {
    if (this.isGameFinished || this.isRecordingThrow) {
      return;
    }

    this.selectedMultiplier = 2;
  }

  setTriple(): void {
    if (this.isGameFinished || this.isRecordingThrow) {
      return;
    }

    this.selectedMultiplier = 3;
  }

  selectDartValue(value: number): void {
    if (this.isGameFinished || this.isRecordingThrow) {
      return;
    }

    const finalValue =
      value * this.selectedMultiplier;

    const isDoubleOut =
      this.selectedMultiplier === 2;

    this.currentDarts[this.currentDartIndex] =
      finalValue;

    this.currentDartsDoubleOut[this.currentDartIndex] =
      isDoubleOut;

    if (this.currentDartIndex < 2) {
      this.currentDartIndex++;
    }

    this.selectedMultiplier = 1;
    this.hasSelectedAnyDart = true;

    this.changeDetectorRef.detectChanges();
  }

  selectBull(value: number): void {
    if (this.isGameFinished || this.isRecordingThrow) {
      return;
    }

    this.currentDarts[this.currentDartIndex] =
      value;

    this.currentDartsDoubleOut[this.currentDartIndex] =
      value === 50;

    if (this.currentDartIndex < 2) {
      this.currentDartIndex++;
    }

    this.selectedMultiplier = 1;
    this.hasSelectedAnyDart = true;

    this.changeDetectorRef.detectChanges();
  }

  clearCurrentThrow(): void {
    if (this.isGameFinished || this.isRecordingThrow) {
      return;
    }

    this.resetCurrentThrow();
  }

  recordCurrentThrow(): void {
    if (!this.canRecordThrow) {
      return;
    }

    if (this.game === null) {
      return;
    }

    const activePlayer =
      this.game.players[this.activePlayerIndex];

    if (!activePlayer) {
      return;
    }

    const request: RecordThrowRequest = {
      playerId: activePlayer.playerId,
      dart1: this.currentDarts[0],
      dart2: this.currentDarts[1],
      dart3: this.currentDarts[2],
      dart1IsDoubleOut: this.currentDartsDoubleOut[0],
      dart2IsDoubleOut: this.currentDartsDoubleOut[1],
      dart3IsDoubleOut: this.currentDartsDoubleOut[2]
    };

    if (
      request.dart1 < 0 ||
      request.dart2 < 0 ||
      request.dart3 < 0
    ) {
      alert(
        this.translateService.instant('GAME_DETAILS.ERROR_NEGATIVE_THROW')
      );
      return;
    }

    if (
      request.dart1 > 60 ||
      request.dart2 > 60 ||
      request.dart3 > 60
    ) {
      alert(
        this.translateService.instant('GAME_DETAILS.ERROR_DART_TOO_HIGH')
      );
      return;
    }

    this.isRecordingThrow = true;
    this.changeDetectorRef.detectChanges();

    this.gameService.recordThrow(
      this.game.id,
      request
    )
      .subscribe({
        next: response => {
          console.log('Throw recorded', response);

          this.lastThrows[activePlayer.playerId] =
            response.score;

          this.checkoutSuggestions[activePlayer.playerId] =
            response.checkoutSuggestion;

          this.isGameFinished =
            response.isGameFinished;

          this.winnerPlayerId =
            response.winnerPlayerId;

          this.resetCurrentThrow();

          if (!response.isGameFinished) {
            this.activePlayerIndex =
              (this.activePlayerIndex + 1) %
              this.game!.players.length;
          }

          const gameId =
            this.game!.id;

          this.loadGame(gameId);
          this.loadThrows(gameId);

          this.isRecordingThrow = false;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.isRecordingThrow = false;
          this.changeDetectorRef.detectChanges();

          console.error(error);

          if (error.status === 409) {
            alert(
              this.translateService.instant('GAME_DETAILS.ERROR_DUPLICATE_THROW')
            );
            return;
          }

          alert(
            this.translateService.instant('GAME_DETAILS.ERROR_RECORD_THROW')
          );
        }
      });
  }

  getAvatarClass(index: number): string {
    const classes = [
      'avatar-green',
      'avatar-blue',
      'avatar-purple',
      'avatar-orange',
      'avatar-red',
      'avatar-cyan'
    ];

    return classes[index % classes.length];
  }

  get canRecordThrow(): boolean {
    return (
      !this.isGameFinished &&
      !this.isRecordingThrow &&
      this.hasSelectedAnyDart
    );
  }

  private resetCurrentThrow(): void {
    this.currentDarts = [0, 0, 0];
    this.currentDartIndex = 0;
    this.selectedMultiplier = 1;

    this.currentDartsDoubleOut = [
      false,
      false,
      false
    ];

    this.hasSelectedAnyDart = false;

    this.changeDetectorRef.detectChanges();
  }

  private updateActivePlayerFromThrows(): void {
    if (this.game === null) {
      return;
    }

    if (this.game.players.length === 0) {
      return;
    }

    if (this.isGameFinished) {
      return;
    }

    this.activePlayerIndex =
      this.throws.length % this.game.players.length;
  }

  private loadGame(gameId: string): void {
    this.gameService.getGame(gameId)
      .subscribe({
        next: game => {
          this.game = game;

          for (const player of game.players) {
            this.checkoutSuggestions[player.playerId] =
              player.checkoutSuggestion;
          }

          this.isGameFinished =
            game.status === 2;

          this.winnerPlayerId =
            game.winnerPlayerId;

          this.updateActivePlayerFromThrows();
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private loadThrows(gameId: string): void {
    this.gameService.getThrows(gameId)
      .subscribe({
        next: throws => {
          this.throws = throws;

          this.updateActivePlayerFromThrows();
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
        }
      });
  }
}
