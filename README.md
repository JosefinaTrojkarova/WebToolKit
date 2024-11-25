# WebToolkit

WebToolkit is a web app designed as a catalogue of tools for web developers.

## Features

- Tool catalog for web developers
- Search and filter tools by categories
- Easy navigation and user-friendly interface

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JosefinaTrojkarova/WebToolKit.git
```

2. Install dependencies:

```bash
cd WebToolKit
npm install
```

3. Add .env file

   - For the app to work on your development server, you'll need to create a .env file in the root of the project and configure the required environment variables.
   - Please reach out to us to get the necessary values for the following variables:

   ```makefile
    MONGODB_URI=...

    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...

    AUTH_SECRET=...
    AUTH_ORIGIN=http://localhost:3000

    YOUTUBE_API_KEY=...
   ```

4. Start the development server:

```bash
npm run dev
```

## Technologies Used

- Nuxt.js
- MongoDB
- Many other packages
