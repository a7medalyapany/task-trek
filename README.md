# Task Management App

A task management application built with **React**, **Redux Toolkit**, and **React Hook Form**, featuring comprehensive CRUD operations for managing tasks. This app allows users to create, edit, delete, and view tasks while utilizing state management and filtering functionalities.

## Features

- **Create New Task**
  - Users can create tasks with the following inputs:
    - Title
    - Priority (Low, Medium `default` , High)
    - State (todo, doing, done)
  - Input validation using **React Hook Form** and **Yup**.

- **Edit Task**
  - Users can edit existing tasks by updating/adding:
    - Image
    - Title
    - Description
    - Priority
    - State

- **Delete Task**
  - Users can delete tasks from the task list.

- **View Task**
  - Display tasks in a list or card layout including:
    - Image
    - Title
    - Description
    - Priority
    - State

- **State Management**
  - Change the state of a task between todo, doing, and done.
  - Changes reflect in task details and overall task list.

- **Filtering**
  - Filter tasks by:
    - State (todo, doing, done)
    - Priority (Low, Medium, High)
    - Search by task name.

## Bonus Features

- Users can drag and drop tasks between states (todo, doing, done).

## Technologies Used

- React
- Redux Toolkit
- React Hook Form

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/a7medalyapany/task-management-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-management-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Follow the instructions on the app interface to create, edit, delete, and manage tasks.
- Use the filtering options to find tasks quickly.
