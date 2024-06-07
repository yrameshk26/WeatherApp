# Weather Application

## Description

This is a weather application built with Vue.js and Vite. The app is designed to fetch current weather and weather forecast for a selected city.

### Features

- **Current Weather**: Select a city from the dropdown menu to view the current weather, including weather description, wind speed, and temperature.
- **Weather Forecast**: After selecting a city, view the forecast in a tabular format, showing average temperature, minimum temperature, maximum temperature, wind speed, and weather description. The forecast is divided into 3-hour intervals for a particular day.
- **Pagination**: The forecast table is paginated by days below. Selecting a different date will display the forecast for that day.
- **Caching**: The app uses caching to store API data for 5 minutes, reducing the frequency of API calls as weather changes are unlikely to occur within this short timeframe.
- **Precommit Check**: Enforces linting before committing changes to maintain code quality.
- **Environment Variables**: Utilizes `.env` files to manage environment variables.

### Technologies Used

- **Vue.js**: JavaScript framework for building user interfaces.
- **Vite**: Next-generation front-end tooling for Vue.js.
- **Tailwind CSS**: Utility-first CSS framework for quickly building custom designs.
- **Axios**: Promise-based HTTP client for making HTTP requests.
- **Date-fns**: Modern JavaScript date utility library.
- **Lru-cache**: Least Recently Used (LRU) cache for caching API data.
- **@headlessui/vue**: Collection of completely unstyled, fully accessible UI components for Vue.js.
- **@heroicons/vue**: A set of free MIT-licensed high-quality SVG icons for you to use in your web projects.

## Deployment

### Deployment Process

This application has been deployed on Azure as a web app using GitHub Actions with Continuous Integration/Continuous Deployment (CI/CD). With every push to the GitHub repository, the application is automatically deployed.

### Accessing the Application

You can access the deployed application at [https://victorious-moss-0c9fad50f.5.azurestaticapps.net]([https://intercap.azurewebsites.net](https://victorious-moss-0c9fad50f.5.azurestaticapps.net)).

## Prerequisites

Make sure you have Node.js and npm installed on your system. You can download them from [Node.js official website](https://nodejs.org/).

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.  
It correctly bundles Vue in production mode and optimizes the build for the best performance.

### `npm run preview`

Locally preview production build.

### `npm run lint`

Checks the code for linting errors using Prettier and ESLint.

### `npm run lint:fix`

Fixes the linting errors using Prettier and ESLint.

### `npm run format`

Formats the code in the `src/` directory using Prettier.

## Learn More

You can learn more about Vite and Vue.js from the following resources:

- [Vite Documentation](https://vitejs.dev/guide/)
- [Vue.js Documentation](https://vuejs.org/v2/guide/)
