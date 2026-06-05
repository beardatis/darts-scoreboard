import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateGameRequest } from '../../shared/models/create-game-request';
import { CreateGameResponse } from '../../shared/models/create-game-response';
import { GameDetailsModel } from '../../shared/models/game-details-model';
import { RecordThrowRequest } from '../../shared/models/record-throw-request';
import { RecordThrowResponse } from '../../shared/models/record-throw-response';
import { ThrowHistoryItem } from '../../shared/models/throw-history-item';
import { GameListItem } from '../../shared/models/game-list-item';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  createGame(request: CreateGameRequest): Observable<CreateGameResponse> {
    return this.httpClient.post<CreateGameResponse>(
      `${environment.apiUrl}/api/games`,
      request
    );
  }

  getGame(id: string): Observable<GameDetailsModel> {
    return this.httpClient.get<GameDetailsModel>(
      `${environment.apiUrl}/api/games/${id}`
    );
  }

  recordThrow(
    gameId: string,
    request: RecordThrowRequest
  ): Observable<RecordThrowResponse> {
    return this.httpClient.post<RecordThrowResponse>(
      `${environment.apiUrl}/api/games/${gameId}/throw`,
      request
    );
  }
  getThrows(gameId: string): Observable<ThrowHistoryItem[]> {
    return this.httpClient.get<ThrowHistoryItem[]>(
      `${environment.apiUrl}/api/games/${gameId}/throws`
    );
  }
  getGames(): Observable<GameListItem[]> {
    return this.httpClient.get<GameListItem[]>(
      `${environment.apiUrl}/api/games`
    );
  }
}
