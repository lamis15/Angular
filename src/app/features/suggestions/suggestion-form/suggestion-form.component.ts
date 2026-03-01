import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode: boolean = false;
  suggestionId!: number;
  
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.suggestionId = +params['id'];
        this.loadSuggestionForEdit();
      }
    });
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.suggestionForm = this.fb.group({
      title: [
        '', 
        [
          Validators.required, 
          Validators.minLength(5),
          Validators.pattern('^[A-Z].*')
        ]
      ],
      description: [
        '', 
        [
          Validators.required, 
          Validators.minLength(30)
        ]
      ],
      category: ['', Validators.required],
      date: [{ value: today, disabled: true }],
      status: [{ value: 'en_attente', disabled: true }]
    });
  }

  /**
   * Safely formats a date for input[type="date"]
   */
  private formatDateForInput(date: any): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];
    }
    
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date received:', date);
      return new Date().toISOString().split('T')[0];
    }
    
    return dateObj.toISOString().split('T')[0];
  }

  /**
   * Charge les données de la suggestion à modifier
   */
  loadSuggestionForEdit(): void {
    this.suggestionService.getSuggestionById(this.suggestionId).subscribe({
      next: (data) => {
        this.suggestionForm.patchValue({
          title: data.title,
          description: data.description,
          category: data.category,
          date: this.formatDateForInput(data.date),
          status: data.status
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la suggestion:', error);
        alert('Erreur lors du chargement de la suggestion.');
        this.router.navigate(['/suggestions']);
      }
    });
  }

  // Getters pour faciliter l'accès aux contrôles
  get title() {
    return this.suggestionForm.get('title');
  }

  get description() {
    return this.suggestionForm.get('description');
  }

  get category() {
    return this.suggestionForm.get('category');
  }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const suggestionData: Partial<Suggestion> = {
        title: this.suggestionForm.get('title')?.value,
        description: this.suggestionForm.get('description')?.value,
        category: this.suggestionForm.get('category')?.value,
        date: new Date(),
        status: 'en_attente'
      };

      if (this.isEditMode) {
        // MODE MODIFICATION
        this.suggestionService.updateSuggestion(this.suggestionId, suggestionData as Suggestion).subscribe({
          next: () => {
            alert('Suggestion modifiée avec succès !');
            this.router.navigate(['/suggestions']);
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification de la suggestion.');
          }
        });
      } else {
        // MODE AJOUT
        const newSuggestion: Suggestion = {
          ...suggestionData,
          id: 0,
          nbLikes: 0
        } as Suggestion;

        this.suggestionService.addSuggestion(newSuggestion).subscribe({
          next: () => {
            alert('Suggestion ajoutée avec succès !');
            this.router.navigate(['/suggestions']);
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout:', error);
            alert('Erreur lors de l\'ajout de la suggestion.');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}