# Cinema Management SPA 🎬

## Description
This is a modern, fully interactive Single Page Application (SPA) designed for a cinema chain to automate and optimize its movie screening schedules and ticket reservation system. It solves common operational challenges such as overbooking, manual screening logs, and lack of real-time occupancy insights for administrators. 

The application implements a robust authentication layer, dynamic client-side routing, role-based access control (RBAC), and persistent user sessions.

## Technologies Used
*   **Frontend Core:** Vanilla JavaScript (ES6+) / Vite
*   **Styling & UI:** TailwindCSS (Responsive Layouts)
*   **Mock Backend Database:** JSON-Server
*   **API Client:** Fetch API / Axios (Asynchronous REST operations)
*   **Session Management:** Web Storage API (`localStorage` / `sessionStorage`)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com
    cd cinema-management-spa
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running JSON-Server
The application relies on `json-server` to simulate a REST API for authentication, movies, screenings, and reservations.

Run the mock server using the following npm script:
```bash
npm run server
```
*Note: This will host the database endpoint at `http://localhost:3000`.*

## Running the Project
To launch the Vite development server and view the project locally:

```bash
npm run dev
```
Open your browser and navigate to the local link provided in your terminal (usually `http://localhost:5173`).

## Test Users
Use the following credentials to authenticate and test different routing behaviors and panel features:

| Role | Email / Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@cinema.com` | `admin123` |
| **Standard User 1** | `user1@cinema.com` | `user123` |
| **Standard User 2** | `user2@cinema.com` | `user123` |

## Project Structure
The application follows a clean, modular architecture separating components, routing, and services:

```text
├── public/
├── src/
│   ├── assets/          # Shared images, icons, and styles
│   ├── components/      # Reusable UI components (Navbar, Modal, Toast)
│   ├── database/        # db.json file for json-server configuration
│   ├── guards/          # Route middleware/guards to secure navigation
│   ├── services/        # Fetch/Axios API communication modules (Auth, CRUD)
│   ├── utils/           # Helper functions (Date formatting, validators)
│   ├── views/           # SPA Page views (Login, Billboard, AdminDashboard)
│   ├── app.js           # Core application bootstrapper & DOM events
│   ├── router.js        # Hash/History API routing logic initialization
│   └── main.css         # TailwindCSS configuration injections
├── index.html
├── package.json
└── README.md
```

## Role Permissions
The system enforces strict access control matrices based on the active session role:

### Administrator (`admin`)
*   Full CRUD lifecycle control over all movie screenings (Create, Read, Update, Delete).
*   Global visibility over every booking registered in the database.
*   Authorization capabilities to approve or cancel pending tickets.
*   Access to advanced administration views and analytics dashboards.

### Standard User (`user`)
*   Browse the real-time available movie billboard.
*   Book seats/tickets for active screenings, validating remaining capacity.
*   Isolate and view only personal booking history records.
*   Modify or cancel personal active tickets (restricted if the movie has already started).

## Technical Decisions

1.  **SPA Engine via Hash Routing:** Implemented client-side routing using the window URL Hash change listener. This avoids server document requests on navigation, rendering content dynamically inside a single root DOM element container.
2.  **Route Protection (Guards):** Configured a custom router middleware system. If an unauthenticated user or an unauthorized standard customer attempts to reach administrative pages, the guard intercepts the state and triggers an immediate redirect to the login or billboard view.
3.  **Automated Inventory Updates:** Implemented transaction-like logic during booking actions. When a client books seats or cancels an order, concurrent PATCH requests update the screening resource's capacity fields to avoid race conditions and seat overbooking.
4.  **Session Persistence Engine:** Utilized `localStorage` to securely store JWT/User tokens. A bootstrap verification lifecycle ensures that if a user refreshes their tab, state context hooks reload properly without kicking them out of the current session view.
