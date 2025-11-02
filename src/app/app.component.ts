import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { PoemDisplayComponent } from './components/poem-display/poem-display.component';
import { PoetryDbService, Poem } from './services/poetry-db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchComponent, PoemDisplayComponent],
  template: `
    <div class="app-container">
      <app-search
        #searchComponent
        (search)="onSearch($event)"
        (random)="onRandom()"
      ></app-search>

      <app-poem-display [poems]="displayedPoems"></app-poem-display>

      <div *ngIf="isLoadingData" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading poems...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        background: #0f0f0f;
      }

      .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        background: #1a1a1a;
        border-radius: 8px;
        margin-top: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .spinner {
        border: 4px solid #333;
        border-top: 4px solid #888;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-spinner p {
        color: #b0b0b0;
        font-weight: 600;
        margin: 0;
      }

      @media (max-width: 768px) {
        .app-container {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  @ViewChild('searchComponent') searchComponent!: SearchComponent;

  displayedPoems: Poem[] = [];
  isLoadingData = false;

  constructor(private poetryDbService: PoetryDbService) {}

  onSearch(searchParams: { author: string; title: string }): void {
    this.isLoadingData = true;
    this.displayedPoems = [];

    this.poetryDbService
      .searchByAuthorAndTitle(searchParams.author, searchParams.title)
      .subscribe({
        next: (poems) => {
          this.displayedPoems = poems;
          this.isLoadingData = false;
          this.searchComponent.setLoading(false);

          if (poems.length === 0) {
            this.searchComponent.setError(
              'No poems found. Try different search terms.'
            );
          } else {
            this.searchComponent.clearError();
          }
        },
        error: (error) => {
          this.isLoadingData = false;
          this.displayedPoems = [];
          this.searchComponent.setLoading(false);
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred. Please check your connection and try again.';
          this.searchComponent.setError(errorMessage);
          console.error('Search error:', error);
        },
      });
  }

  onRandom(): void {
    this.isLoadingData = true;
    this.displayedPoems = [];

    this.poetryDbService.getRandomPoem().subscribe({
      next: (poem) => {
        this.displayedPoems = [poem];
        this.isLoadingData = false;
        this.searchComponent.setLoading(false);
        this.searchComponent.clearError();
      },
      error: (error) => {
        this.isLoadingData = false;
        this.displayedPoems = [];
        this.searchComponent.setLoading(false);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch random poem. Please try again.';
        this.searchComponent.setError(errorMessage);
        console.error('Random poem error:', error);
      },
    });
  }
}
