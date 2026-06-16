import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../shared/models/player';

@Component({
  selector: 'app-player-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss'
})
export class PlayerList implements OnInit {
  players: Player[] = [];
  newPlayerName = '';

  isCreatingPlayer = false;
  isLoadingPlayers = false;

  editingPlayerId: string | null = null;
  editingPlayerName = '';

  savingPlayerIds: string[] = [];
  deletingPlayerIds: string[] = [];

  constructor(
    private readonly playerService: PlayerService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadPlayers();
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
          alert(error.error ?? 'Nem sikerült létrehozni a játékost.');
        }
      });
  }

  startEditing(player: Player): void {
    this.editingPlayerId = player.id;
    this.editingPlayerName = player.name;
    this.changeDetectorRef.detectChanges();
  }

  cancelEditing(): void {
    this.editingPlayerId = null;
    this.editingPlayerName = '';
    this.changeDetectorRef.detectChanges();
  }

  savePlayer(player: Player): void {
    if (this.savingPlayerIds.includes(player.id)) {
      return;
    }

    const name = this.editingPlayerName.trim();

    if (!name) {
      alert('A játékos neve nem lehet üres.');
      return;
    }

    this.savingPlayerIds.push(player.id);
    this.changeDetectorRef.detectChanges();

    this.playerService.updatePlayer(
      player.id,
      name
    )
      .subscribe({
        next: () => {
          player.name = name;

          this.savingPlayerIds =
            this.savingPlayerIds.filter(id => id !== player.id);

          this.cancelEditing();
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.savingPlayerIds =
            this.savingPlayerIds.filter(id => id !== player.id);

          this.changeDetectorRef.detectChanges();

          console.error(error);
          alert(error.error ?? 'Nem sikerült módosítani a játékost.');
        }
      });
  }

  deletePlayer(player: Player): void {
    if (this.deletingPlayerIds.includes(player.id)) {
      return;
    }

    const confirmed = confirm(
      `Biztosan törlöd ezt a játékost: ${player.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingPlayerIds.push(player.id);
    this.changeDetectorRef.detectChanges();

    this.playerService.deletePlayer(player.id)
      .subscribe({
        next: () => {
          this.players =
            this.players.filter(item => item.id !== player.id);

          this.deletingPlayerIds =
            this.deletingPlayerIds.filter(id => id !== player.id);

          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.deletingPlayerIds =
            this.deletingPlayerIds.filter(id => id !== player.id);

          this.changeDetectorRef.detectChanges();

          console.error(error);
          alert(error.error ?? 'Nem sikerült törölni a játékost.');
        }
      });
  }

  private loadPlayers(): void {
    this.isLoadingPlayers = true;

    this.playerService.getPlayers()
      .subscribe({
        next: players => {
          this.players = players;
          this.isLoadingPlayers = false;
          this.changeDetectorRef.detectChanges();
        },
        error: error => {
          this.isLoadingPlayers = false;
          this.changeDetectorRef.detectChanges();

          console.error(error);
        }
      });
  }
}
