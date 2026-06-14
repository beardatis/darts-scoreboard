import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../shared/models/player';
// import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player-list',
  //imports: [CommonModule, FormsModule, RouterLink],
  imports: [CommonModule, FormsModule,],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList implements OnInit {
  players: Player[] = [];
  newPlayerName = '';
  isCreatingPlayer = false;
  isLoadingPlayers = false;

  constructor(
    private readonly playerService: PlayerService,
    private readonly changeDetectorRef : ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  private loadPlayers(): void {
    this.isLoadingPlayers = true;

    this.playerService.getPlayers()
      .subscribe({
        next: players => {
          this.players = players;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
        }
      });
  }

  addPlayer(): void {
    if (this.isCreatingPlayer) {
      return;
    }

    const name = this.newPlayerName.trim();

    if (!name) {
      return;
    }

    this.isCreatingPlayer = true;
    this.changeDetectorRef.detectChanges();

    this.playerService.createPlayer(name)
      .subscribe({
        next: () => {
          this.newPlayerName = '';
          this.loadPlayers();

          this.isCreatingPlayer = false;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.isCreatingPlayer = false;
          this.changeDetectorRef.detectChanges();

          console.error(error);
          alert('Nem sikerült létrehozni a játékost.');
        }
      });
  }
}
