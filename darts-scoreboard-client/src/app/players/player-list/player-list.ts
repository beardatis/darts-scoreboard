import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../shared/models/player';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList implements OnInit {
  players: Player[] = [];
  newPlayerName = '';

  constructor(
    private readonly playerService: PlayerService,
    private readonly changeDetectorRef : ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  private loadPlayers(): void {
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
    const name = this.newPlayerName.trim();

    if (!name) {
      return;
    }

    this.playerService.createPlayer(name)
      .subscribe({
        next: () => {
          this.newPlayerName = '';
          this.loadPlayers();
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          console.error(error);
          alert('Nem sikerült létrehozni a játékost.');
        }
      });
  }
}
