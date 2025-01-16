  # Chit-Chat App

A feature-rich real-time messaging application built using **React Native** for the frontend and **NestJS** for the backend. Chit-Chat App demonstrates the power of combining a modern mobile framework with a scalable server-side architecture to deliver seamless user experiences.

  ---

## Table of Contents

- [Chit-Chat App](#chit-chat-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend (NestJS)](#backend-nestjs)
    - [Frontend (React Native)](#frontend-react-native)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
    - [Backend (NestJS)](#backend-nestjs-1)
    - [Frontend (React Native with expo)](#frontend-react-native-with-expo)
  - [Dependencies](#dependencies)
    - [Backend (NestJS)](#backend-nestjs-2)
    - [Frontend (React Native with expo)](#frontend-react-native-with-expo-1)
  - [Configuration](#configuration)
  - [Examples](#examples)
  - [Troubleshooting](#troubleshooting)
  - [Contributors](#contributors)
  - [License](#license)

## Introduction

The **Chit-Chat App** is designed to provide real-time messaging functionality with features like authentication, group chats, notifications, and more. The project leverages **React Native** for building cross-platform mobile interfaces and **NestJS** for creating a robust backend API. This repository serves as a reference implementation for scalable, full-stack mobile applications.

  ---

## Features

- Real-time messaging with WebSocket support.
- Cross-platform mobile interface using React Native.
- Secure user authentication with JWT.
- Group chat functionality with dynamic room creation.
- Push notifications for message updates.
- Modular and scalable backend architecture.
- Integration with popular libraries like TypeORM and Firebase.
- Robust error handling and middleware support.
- Comprehensive testing utilities for both frontend and backend.

  ---

 ## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn package manager
- React Native CLI
- Android Studio / Xcode (for running the app on emulators or physical devices)
- 
### Backend (NestJS)

1. **Clone the repository**:
    ```bash
    git clone https://github.com/naushadraien/Chit-Chat.git
    cd chit-chat-app/backend
    ```


2. **Install dependencies**:
    ```bash
    npm install
    ```

  3. **Set up environment variables**:
    ```bash
    cp .env.example .env
    ```
4. **Start the server**:
    ```bash
    npm run start:dev
    ```

### Frontend (React Native)

1. **Navigate to the frontend folder**:
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the app**:
    ```bash
    npm run start
    ```
    Open the app on an emulator or physical device using the React Native CLI:
    ```bash
    npm run android  # For Android
    npm run ios      # For iOS
    ```

---

## Usage

- **Login and Signup**: Authenticate users using email and password.
- **Real-time Messaging**: Send and receive messages instantly with WebSockets.
- **Group Chats**: Create and manage chat rooms for group conversations.
- **Push Notifications**: Stay informed about new messages and updates.
- 
  ---

## Project Structure

### Backend (NestJS)
```bash
backend/src/
├── app.module.ts       # Root module of the backend
├── main.ts             # Entry point for the backend server
├── auth/               # Authentication module
├── chat/               # Chat module for WebSocket management
├── database/           # Database connection and entities
└── common/             # Shared utilities, guards, and interceptors
  ```

### Frontend (React Native with expo)
```bash
frontend/src/
├── components/         # Reusable UI components
├── screens/            # App screens (e.g., Login, Chat, Profile)
├── navigation/         # Navigation setup
├── context/            # Context API for global state management
└── services/           # API and WebSocket service handlers
  ```

  ## Dependencies

  ### Backend (NestJS)

  - Node.js (v16 or later)
  - NestJS (v9.x)
  - TypeScript (v4.x)
  - Other dependencies are listed in the package.json file for each project.
  - Mongoose
  - WebSocket for real-time communication
  - JWT for secure authentication
  - 
 ### Frontend (React Native with expo)

  - React Native (v0.72 or later)
  - React Navigation
  - Axios for API requests

  ## Configuration

    ### Backend (NestJS)

  This project uses environment variables for configuration. The following variables should be defined in a .env file:

  - PORT: The port number to run the server (default: 3000).
  - DATABASE_URL: Connection string for the database.
  - JWT_SECRET: Secret key for JWT authentication.

    ### Frontend (React Native with expo)

  Configure the backend API and WebSocket URLs in client/src/config.ts:

  - export const API_URL = "http://localhost:3000/api";
  - export const SOCKET_URL = "http://localhost:3000";


  ## Examples

  The following examples are included in the repository:

  - User Authentication: Backend authentication API integrated with the frontend login screen.
  - WebSocket Messaging: Real-time messaging between two or more users.

  Run the examples by switching to the respective branches or exploring the lessons folder.

  ## Troubleshooting

  - Issue: Backend Fails to Start:
    - Solution: 
    - Ensure the .env file is correctly configured.
    - Verify the database is running and accessible.
  - Issue: Frontend Errors:
    - Solution: 
    - Check if the expo CLI is installed and configured.
    - Ensure the API and WebSocket URLs are correctly set.
 - Issue: WebSocket Connection Issues:
    - Solution: 
    - Confirm the backend server is running and accessible from the device.

  For additional help, create an issue in the repository.

  ## Contributors

  - [MD Naushad Raien](Creator and maintainer.)

  ## License

  This project is licensed under the MIT License. See the LICENSE file for details.

  
Let me know if you'd like further customization or additional sections!

