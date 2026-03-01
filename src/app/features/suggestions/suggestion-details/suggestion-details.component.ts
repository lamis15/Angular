import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestionId!: number;
  suggestion!: Suggestion;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis les paramètres de route
    this.route.params.subscribe(params => {
      this.suggestionId = +params['id'];
      this.loadSuggestionDetails();
    });
  }

  /**
   * Charge les détails d'une suggestion depuis le service
   */
  loadSuggestionDetails(): void {
    // VERSION AVEC HttpClient (Partie 2)
    this.suggestionService.getSuggestionById(this.suggestionId).subscribe({
      next: (data) => {
        this.suggestion = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la suggestion:', error);
        // Si le backend n'est pas disponible, utiliser les données locales
        const suggestions = this.suggestionService.getSuggestionsListLocal();
        const found = suggestions.find(s => s.id === this.suggestionId);
        
        if (found) {
          this.suggestion = found;
        } else {
          this.router.navigate(['/notfound']);
        }
      }
    });

    // VERSION LOCALE (Partie 1)
    /*
    const suggestions = this.suggestionService.getSuggestionsListLocal();
    const found = suggestions.find(s => s.id === this.suggestionId);
    
    if (found) {
      this.suggestion = found;
    } else {
      this.router.navigate(['/notfound']);
    }
    */
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

  /**
   * Retour à la liste des suggestions
   */
  backToList(): void {
    this.router.navigate(['/suggestions']);
  }

  /**
   * Navigation vers le formulaire de modification
   */
  editSuggestion(): void {
    this.router.navigate(['/suggestions/edit', this.suggestionId]);
  }
}