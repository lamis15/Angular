import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  // URL du backend
  private suggestionUrl = 'http://localhost:3000/suggestions';

  // Liste locale des suggestions (fallback)
  private suggestionList: Suggestion[] = [
    {
      id: 1,
      title: 'Organiser une journée team building',
      description: 'Suggestion pour organiser une journée de team building pour renforcer les liens entre les membres de l\'équipe.',
      category: 'Événements',
      date: new Date('2025-01-20'),
      status: 'acceptee',
      nbLikes: 10
    },
    {
      id: 2,
      title: 'Améliorer le système de réservation',
      description: 'Proposition pour améliorer la gestion des réservations en ligne avec un système de confirmation automatique.',
      category: 'Technologie',
      date: new Date('2025-01-15'),
      status: 'refusee',
      nbLikes: 0
    },
    {
      id: 3,
      title: 'Créer un système de récompenses',
      description: 'Mise en place d\'un programme de récompenses pour motiver les employés et reconnaître leurs efforts.',
      category: 'Ressources Humaines',
      date: new Date('2025-01-25'),
      status: 'refusee',
      nbLikes: 0
    },
    {
      id: 4,
      title: 'Moderniser l\'interface utilisateur',
      description: 'Refonte complète de l\'interface utilisateur pour une meilleure expérience utilisateur.',
      category: 'Technologie',
      date: new Date('2025-01-30'),
      status: 'en_attente',
      nbLikes: 0
    }
  ];

  constructor(private http: HttpClient) {}

  // ============ MÉTHODE LOCALE (Fallback) ============

  getSuggestionsListLocal(): Suggestion[] {
    return this.suggestionList;
  }

  // ============ MÉTHODES AVEC HttpClient ============

  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<any>(this.suggestionUrl).pipe(
      map(response => response.suggestions || response)
    );
  }

  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http.get<any>(`${this.suggestionUrl}/${id}`).pipe(
      map(response => response.suggestion || response)
    );
  }

  addSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<any>(this.suggestionUrl, suggestion).pipe(
      map(response => response.suggestion || response)
    );
  }

  updateSuggestion(id: number, suggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<any>(`${this.suggestionUrl}/${id}`, suggestion).pipe(
      map(response => response.suggestion || response)
    );
  }

  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
  }

  updateLikes(id: number, nbLikes: number): Observable<Suggestion> {
    return this.http.patch<any>(`${this.suggestionUrl}/${id}`, { nbLikes }).pipe(
      map(response => response.suggestion || response)
    );
  }
}