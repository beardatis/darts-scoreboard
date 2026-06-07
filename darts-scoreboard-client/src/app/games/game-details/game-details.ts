import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../core/services/game.service';
import { GameDetailsModel } from '../../shared/models/game-details-model';
import { RecordThrowRequest } from '../../shared/models/record-throw-request';
import { ThrowHistoryItem } from '../../shared/models/throw-history-item';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-details',
  imports: [
    CommonModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss'
})
export class GameDetails implements OnInit {

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
    private readonly changeDetectorRef: ChangeDetectorRef
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
    this.selectedMultiplier = 2;
  }

  setTriple(): void {
    this.selectedMultiplier = 3;
  }

  selectDartValue(value: number): void {
    const finalValue = value * this.selectedMultiplier;
    const isDoubleOut =
      this.selectedMultiplier === 2;

    this.currentDarts[this.currentDartIndex] =
      value * this.selectedMultiplier;

    this.currentDartsDoubleOut[this.currentDartIndex] =
      isDoubleOut;

    this.currentDarts[this.currentDartIndex] = finalValue;

    if (this.currentDartIndex < 2) {
      this.currentDartIndex++;
    }

    this.selectedMultiplier = 1;
    this.changeDetectorRef.detectChanges();
  }

  selectBull(value: number): void {
    this.currentDarts[this.currentDartIndex] = value;

    this.currentDartsDoubleOut[this.currentDartIndex] =
      value === 50;

    if (this.currentDartIndex < 2) {
      this.currentDartIndex++;
    }

    this.selectedMultiplier = 1;
    this.changeDetectorRef.detectChanges();
  }

  clearCurrentThrow(): void {
    this.currentDarts = [0, 0, 0];
    this.currentDartIndex = 0;
    this.selectedMultiplier = 1;
    this.currentDartsDoubleOut = [
      false,
      false,
      false
    ];

    this.changeDetectorRef.detectChanges();
  }

  recordCurrentThrow(): void {
    if (this.isRecordingThrow) {
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
      alert('Negatív dobás nem engedélyezett.');
      return;
    }

    if (
      request.dart1 > 60 ||
      request.dart2 > 60 ||
      request.dart3 > 60
    ) {
      alert('Egy nyíl értéke legfeljebb 60 lehet.');
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

          this.lastThrows[activePlayer.playerId] = response.score;

          this.checkoutSuggestions[activePlayer.playerId] =
            response.checkoutSuggestion;

          this.isGameFinished = response.isGameFinished;
          this.winnerPlayerId = response.winnerPlayerId;

          this.clearCurrentThrow();

          if (!response.isGameFinished) {
            this.activePlayerIndex =
              (this.activePlayerIndex + 1) %
              this.game!.players.length;
          }

          this.changeDetectorRef.detectChanges();

          const gameId = this.game!.id;

          this.loadGame(gameId);
          this.loadThrows(gameId);
          this.isRecordingThrow = false;

          setTimeout(() => {
            this.changeDetectorRef.detectChanges();
          });
        },
        error: error => {
          console.error(error);
          alert('Nem sikerült rögzíteni a dobást.');
          this.isRecordingThrow = false;
          this.changeDetectorRef.detectChanges();
        }
      });
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

          this.isGameFinished = game.status === 2;
          this.winnerPlayerId = game.winnerPlayerId;

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
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
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
}
