import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Player } from '../../shared/models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  getPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(
      `${environment.apiUrl}/api/players`
    );
  }

  createPlayer(name: string): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/api/players`,
      { name }
    );
  }
  updatePlayer(
    playerId: string,
    name: string
  ) {
    return this.httpClient.put<void>(
      `${environment.apiUrl}/api/players/${playerId}`,
      {
        name
      }
    );
  }

  deletePlayer(playerId: string) {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/api/players/${playerId}`
    );
  }
}
