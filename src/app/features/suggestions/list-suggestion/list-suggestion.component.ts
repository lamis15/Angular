import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {
  searchText: string = '';
  favorites: Suggestion[] = [];
  suggestions: Suggestion[] = [];

  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  /**
   * Charge la liste des suggestions depuis le service
   */
  loadSuggestions(): void {
    // VERSION AVEC HttpClient (Partie 2)
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des suggestions:', error);
        // Si le backend n'est pas disponible, utiliser les données locales
        this.suggestions = this.suggestionService.getSuggestionsListLocal();
      }
    });

    // VERSION LOCALE (Partie 1) - Décommenter si pas de backend
    // this.suggestions = this.suggestionService.getSuggestionsListLocal();
  }

  /**
   * Incrémente les likes d'une suggestion
   */
  incrementLikes(suggestion: Suggestion): void {
    const newLikes = suggestion.nbLikes + 1;
    
    // VERSION AVEC HttpClient
    this.suggestionService.updateLikes(suggestion.id, newLikes).subscribe({
      next: (updatedSuggestion) => {
        suggestion.nbLikes = updatedSuggestion.nbLikes;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des likes:', error);
        // Fallback local
        suggestion.nbLikes++;
      }
    });

    // VERSION LOCALE (Partie 1)
    // suggestion.nbLikes++;
  }

  /**
   * Ajoute une suggestion aux favoris
   */
  addToFavorites(suggestion: Suggestion): void {
    if (!this.favorites.find(fav => fav.id === suggestion.id)) {
      this.favorites.push(suggestion);
      alert(`"${suggestion.title}" ajoutée aux favoris!`);
    } else {
      alert('Cette suggestion est déjà dans vos favoris!');
    }
  }

  /**
   * Supprime une suggestion
   */
  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      // VERSION AVEC HttpClient
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          // Recharger la liste après suppression
          this.loadSuggestions();
          alert('Suggestion supprimée avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la suggestion.');
        }
      });

      // VERSION LOCALE (Partie 1)
      // this.suggestions = this.suggestions.filter(s => s.id !== id);
    }
  }

  /**
   * Filtre les suggestions
   */
  get filteredSuggestions(): Suggestion[] {
    if (!this.searchText.trim()) {
      return this.suggestions;
    }
    
    const searchLower = this.searchText.toLowerCase();
    return this.suggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(searchLower) ||
      suggestion.category.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Vérifie si une suggestion est refusée
   */
  isRefused(status: string): boolean {
    return status === 'refusee';
  }

  /**
   * Retourne la classe CSS selon le statut
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'acceptee':
        return 'status-accepted';
      case 'refusee':
        return 'status-refused';
      case 'en_attente':
        return 'status-pending';
      default:
        return '';
    }
  }

  /**
   * Formate le statut pour l'affichage
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'acceptee':
        return 'Acceptée';
      case 'refusee':
        return 'Refusée';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  }
}