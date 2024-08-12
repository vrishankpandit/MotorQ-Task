# MotorQ-Task README

## Overview
This repository contains a Node.js application designed to manage vehicles and organizations. It provides a REST API for performing CRUD operations on vehicles and organizations, including adding new vehicles, creating organizations, and listing items. The application uses Express.js as its web server framework and Axios for making HTTP requests.

## Features
- **CRUD Operations for Organizations**: Create new organizations.
- **Vehicle Management**: Add new vehicles with VIN decoding.
- **Item Management**: Add, update, and delete items.
- **Rate Limiting**: Limits the number of requests to the VIN decoding endpoint to prevent abuse.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- Basic knowledge of JavaScript and Node.js.

### Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/vrishankpandit/motorq-task.git
2. Navigate to the cloned repository:
   ```bash
   cd motorq-task
3. Install the required npm packages:
   ```bash
   npm install
4.Start the application:
  ```bash
  node index.js
