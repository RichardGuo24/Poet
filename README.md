# Poetry Explorer - Angular Application

A beautiful Angular application that integrates with the [Poetry Database API](https://poetrydb.org/) to explore and discover poems.

## Features

- **Search by Author** - Find all poems by your favorite poets
- **Search by Title** - Discover specific poems you're looking for
- **Random Poem** - Get surprised with a random poem
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Error Handling** - Comprehensive error messages for failed requests
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FrontendPoet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

### Search for Poems
1. Enter an **Author Name** (e.g., "Shakespeare", "Emily Dickinson")
2. Or enter a **Poem Title** (e.g., "Sonnet 18", "Hope is the Thing with Feathers")
3. Or search by both author and title
4. Click the **Search** button to find matching poems

### Get a Random Poem
Click the **Random Poem** button to discover a random poem from the database.

## Project Structure

```
FrontendPoet/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── search/
│   │   │   │   └── search.component.ts
│   │   │   └── poem-display/
│   │   │       └── poem-display.component.ts
│   │   ├── services/
│   │   │   └── poetry-db.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
```

## API Integration

The application uses the [Poetry Database API](https://poetrydb.org/) with the following endpoints:

- **Search by Author**: `GET /author/{author}`
- **Search by Title**: `GET /title/{title}`
- **Random Poem**: `GET /random`

### Error Handling

The application handles various HTTP errors:
- **404 Not Found** - No poems match your search
- **Network Errors** - Connection issues with the API
- **Server Errors** - API service unavailable
- **Validation Errors** - Empty search parameters

## Build for Production

```bash
npm run build
```

The built files will be stored in the `dist/poetry-db-app` directory.

## Technologies Used

- **Angular 17** - Modern web framework
- **TypeScript** - Type-safe language
- **RxJS** - Reactive programming
- **SCSS** - Advanced styling
- **HttpClient** - API communication

## Future Enhancements

- Add filters and sorting options
- Implement pagination for large result sets
- Add poem bookmarking functionality
- Support for different poem formats
- Dark mode toggle
- Share poem feature

## License

This project is open source and available under the MIT License.
