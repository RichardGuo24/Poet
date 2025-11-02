import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Poem } from '../../services/poetry-db.service';

@Component({
  selector: 'app-poem-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="poems-container">
      <div *ngIf="poems.length === 0" class="no-results">
        <span class="empty-icon">📖</span>
        <p>No poems to display. Try searching for an author or poem title.</p>
      </div>

      <div class="poems-grid">
        <div *ngFor="let poem of poems; let i = index" class="poem-card" [@slideIn]>
          <div class="poem-header">
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-author">by {{ poem.author }}</p>
          </div>

          <div class="poem-meta">
            <span class="line-count">
              <span class="meta-label">Lines:</span>
              <span class="meta-value">{{ poem.linecount }}</span>
            </span>
          </div>

          <div class="poem-text">
            <div *ngFor="let line of poem.lines" class="poem-line">
              {{ line || '&nbsp;' }}
            </div>
          </div>

          <div class="poem-footer">
            <span class="poem-number">Poem {{ i + 1 }} of {{ poems.length }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="poems.length > 0" class="results-summary">
        <span class="summary-icon">✨</span>
        Found {{ poems.length }} poem{{ poems.length !== 1 ? 's' : '' }}
      </div>
    </div>
  `,
  styles: [
    `
      .poems-container {
        width: 100%;
      }

      .no-results {
        text-align: center;
        padding: 3rem 2rem;
        background: #1a1a1a;
        border-radius: 8px;
        color: #999;
        border: 1px solid #333;
      }

      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      .poems-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
      }

      .poem-card {
        background: #1a1a1a;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        transition: all 0.2s ease;
        border-left: 2px solid #555;
        border: 1px solid #333;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .poem-card:hover {
        border-color: #444;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      }

      .poem-header {
        padding: 1.5rem;
        background: #0f0f0f;
        color: #e0e0e0;
        border-bottom: 1px solid #333;
      }

      .poem-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: 0.5px;
      }

      .poem-author {
        margin: 0.75rem 0 0 0;
        font-size: 0.9rem;
        color: #888;
        font-style: italic;
        font-weight: 300;
      }

      .poem-meta {
        padding: 0.75rem 1.5rem;
        background-color: #0f0f0f;
        border-bottom: 1px solid #333;
        display: flex;
        gap: 1rem;
      }

      .line-count {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .meta-label {
        font-weight: 500;
        color: #888;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
      }

      .meta-value {
        color: #b0b0b0;
      }

      .poem-text {
        padding: 1.5rem;
        flex-grow: 1;
        overflow-y: auto;
        max-height: 600px;
      }

      .poem-line {
        margin: 0.5rem 0;
        line-height: 1.7;
        color: #d0d0d0;
        font-family: 'Georgia', serif;
        font-size: 0.95rem;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .poem-footer {
        padding: 0.75rem 1.5rem;
        background-color: #0f0f0f;
        border-top: 1px solid #333;
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .results-summary {
        text-align: center;
        padding: 1rem;
        background: #1a1a1a;
        color: #b0b0b0;
        border-radius: 8px;
        font-weight: 500;
        border: 1px solid #333;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.9rem;
      }

      .summary-icon {
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .poems-grid {
          grid-template-columns: 1fr;
        }

        .poem-title {
          font-size: 1.25rem;
        }

        .poem-text {
          max-height: 300px;
        }
      }
    `,
  ],
})
export class PoemDisplayComponent {
  @Input() poems: Poem[] = [];
}
