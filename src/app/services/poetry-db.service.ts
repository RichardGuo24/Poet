import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: string;
}

export interface PoemSearchResult {
  poems: Poem[];
  totalResults: number;
}

@Injectable({
  providedIn: 'root',
})
export class PoetryDbService {
  private readonly baseUrl = 'https://poetrydb.org';

  constructor(private http: HttpClient) {}

  /**
   * Search for poems by author name
   * @param author Author name to search for
   * @returns Observable of poems by the author
   */
  searchByAuthor(author: string): Observable<Poem[]> {
    if (!author.trim()) {
      return throwError(() => new Error('Author name cannot be empty'));
    }

    const url = `${this.baseUrl}/author/${encodeURIComponent(author)}`;
    return this.http.get<any>(url).pipe(
      tap((response) => {
        if (!response) {
          throw new Error('Invalid response from server');
        }
      }),
      map((response) => {
        // The API returns an object with the author name as key and poems array as value
        // Handle both direct array response and wrapped response
        if (Array.isArray(response)) {
          return response;
        }
        // If response has a 'poems' property, use that
        if (response.poems && Array.isArray(response.poems)) {
          return response.poems;
        }
        return [];
      }),
      catchError((error) => this.handleError('Author search', error))
    );
  }

  /**
   * Search for poems by title
   * @param title Poem title to search for
   * @returns Observable of poems with matching title
   */
  searchByTitle(title: string): Observable<Poem[]> {
    if (!title.trim()) {
      return throwError(() => new Error('Title cannot be empty'));
    }

    const url = `${this.baseUrl}/title/${encodeURIComponent(title)}`;
    return this.http.get<any>(url).pipe(
      tap((response) => {
        if (!response) {
          throw new Error('Invalid response from server');
        }
      }),
      map((response) => {
        // Handle both direct array response and wrapped response
        if (Array.isArray(response)) {
          return response;
        }
        // If response has a 'poems' property, use that
        if (response.poems && Array.isArray(response.poems)) {
          return response.poems;
        }
        return [];
      }),
      catchError((error) => this.handleError('Title search', error))
    );
  }

  /**
   * Search for poems by both author and title
   * @param author Author name
   * @param title Poem title
   * @returns Observable combining results from both searches
   */
  searchByAuthorAndTitle(author: string, title: string): Observable<Poem[]> {
    if (!author.trim() && !title.trim()) {
      return throwError(
        () => new Error('At least one search parameter is required')
      );
    }

    const queries: Observable<Poem[]>[] = [];

    if (author.trim()) {
      queries.push(this.searchByAuthor(author));
    }

    if (title.trim()) {
      queries.push(this.searchByTitle(title));
    }

    if (queries.length === 0) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    // Combine results from multiple searches
    return new Observable((observer) => {
      const results: Set<string> = new Set();
      const allPoems: Poem[] = [];
      let completed = 0;

      queries.forEach((query) => {
        query.subscribe({
          next: (poems) => {
            poems.forEach((poem) => {
              const key = `${poem.title}|${poem.author}`;
              if (!results.has(key)) {
                results.add(key);
                allPoems.push(poem);
              }
            });
          },
          error: (error) => {
            observer.error(error);
          },
          complete: () => {
            completed++;
            if (completed === queries.length) {
              observer.next(allPoems);
              observer.complete();
            }
          },
        });
      });
    });
  }

  /**
   * Get a random poem
   * @returns Observable of a random poem
   */
  getRandomPoem(): Observable<Poem> {
    const url = `${this.baseUrl}/random`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0];
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => this.handleError('Random poem retrieval', error))
    );
  }

  /**
   * Handle HTTP errors with appropriate messages
   * @param operation Operation name for error message
   * @param error The HTTP error response
   */
  private handleError(operation: string, error: any): Observable<never> {
    let errorMessage = `${operation} failed`;

    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.status === 0) {
        errorMessage = `Network error: Unable to reach the server at ${this.baseUrl}`;
      } else if (error.status === 404) {
        errorMessage = `${operation}: No results found. Please try a different search.`;
      } else if (error.status >= 500) {
        errorMessage = `Server error (${error.status}): The Poetry Database API is temporarily unavailable.`;
      } else if (error.status >= 400) {
        errorMessage = `Request error (${error.status}): ${error.statusText}`;
      } else if (error.status === 0) {
        errorMessage = `HTTP request failed. Received status: ${error.status}`;
      } else if (error.status !== 200) {
        errorMessage = `HTTP request failed with status ${error.status}. Expected 200.`;
      }
    } else if (error instanceof Error) {
      errorMessage = `${operation}: ${error.message}`;
    }

    console.error(`[PoetryDB Error] ${errorMessage}`, error);
    return throwError(() => new Error(errorMessage));
  }
}
