import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Poem } from '../../services/poetry-db.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1>Poetry Explorer</h1>
        <p class="subtitle">Discover poems from the Poetry Database</p>
      </div>

      <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
        <div class="form-group">
          <label for="author">Author</label>
          <input
            id="author"
            type="text"
            formControlName="author"
            placeholder="e.g., Shakespeare, Emily Dickinson"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="title">Poem Title</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="e.g., Sonnet 18, Hope is the Thing with Feathers"
            class="input-field"
          />
        </div>

        <button type="submit" [disabled]="isLoading" class="search-button">
          <span *ngIf="!isLoading">🔍 Search</span>
          <span *ngIf="isLoading">⏳ Searching...</span>
        </button>

        <button type="button" (click)="onRandom()" [disabled]="isLoading" class="random-button">
          <span *ngIf="!isLoading">🎲 Random Poem</span>
          <span *ngIf="isLoading">⏳ Loading...</span>
        </button>
      </form>

      <div *ngIf="errorMessage" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [
    `
      .search-container {
        background: #1a1a1a;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
      }

      .search-header {
        text-align: center;
        color: #e0e0e0;
        margin-bottom: 2rem;
      }

      .search-header h1 {
        font-size: 2.5rem;
        margin: 0;
        font-weight: 400;
        letter-spacing: 1px;
      }

      .subtitle {
        font-size: 0.95rem;
        margin: 0.75rem 0 0 0;
        color: #999;
        font-weight: 300;
      }

      .search-form {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        gap: 1rem;
        align-items: flex-end;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      label {
        color: #b0b0b0;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .input-field {
        padding: 0.75rem;
        border: 1px solid #333;
        border-radius: 4px;
        font-size: 1rem;
        background: #0f0f0f;
        color: #e0e0e0;
        transition: all 0.2s ease;
      }

      .input-field:focus {
        outline: none;
        border-color: #555;
        box-shadow: 0 0 0 2px rgba(85, 85, 85, 0.2);
      }

      .search-button,
      .random-button {
        padding: 0.75rem 1.5rem;
        border: 1px solid #333;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .search-button {
        background-color: #333;
        color: #e0e0e0;
      }

      .search-button:hover:not(:disabled) {
        background-color: #444;
        border-color: #555;
      }

      .random-button {
        background-color: #555;
        color: #e0e0e0;
      }

      .random-button:hover:not(:disabled) {
        background-color: #666;
        border-color: #777;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error-message {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #2a1a1a;
        color: #d4a574;
        border-radius: 4px;
        border: 1px solid #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .error-icon {
        font-size: 1.2rem;
      }

      @media (max-width: 1024px) {
        .search-form {
          grid-template-columns: 1fr 1fr;
        }

        .search-button,
        .random-button {
          grid-column: 1;
        }
      }

      @media (max-width: 768px) {
        .search-container {
          padding: 1.5rem;
        }

        .search-header h1 {
          font-size: 2rem;
        }

        .search-form {
          grid-template-columns: 1fr;
        }

        .search-button,
        .random-button {
          grid-column: 1;
        }
      }
    `,
  ],
})
export class SearchComponent {
  @Output() search = new EventEmitter<{ author: string; title: string }>();
  @Output() random = new EventEmitter<void>();

  searchForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      author: [''],
      title: [''],
    });
  }

  onSearch(): void {
    const { author, title } = this.searchForm.value;

    // Validate that at least one field is filled
    if (!author.trim() && !title.trim()) {
      this.errorMessage = 'Please enter an author name or poem title';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.search.emit({ author: author.trim(), title: title.trim() });
  }

  onRandom(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.random.emit();
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setError(error: string): void {
    this.errorMessage = error;
    this.isLoading = false;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
