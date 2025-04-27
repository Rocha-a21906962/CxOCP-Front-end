# Frontend React App

This project is a frontend application built with [React](https://github.com/facebook/create-react-app).

It provides a user interface for login, registration, file uploads (Process), and interacting with a chatbot through a chat page.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

## Available Pages (localhost:3000)

- [/ or /login](http://localhost:3000/)
- [/register](http://localhost:3000/register)
- [/chat](http://localhost:3000/chat)
- [/uploader](http://localhost:3000/uploader)

## Project Overview

This frontend app allows users to register and log in, upload a process file, and interact with a chatbot through a chat interface.

## Deployment

You can deploy the app using Docker:

```bash
# Make sure you are inside the project folder
docker build -t frontend-image .
```

followed by

```bash
docker run -d -p 3000:3000 --name frontend frontend-image
```
