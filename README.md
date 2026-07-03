# 🚀 Full-Stack Portfolio: ModernStudio & DecodeLabs Integration

Welcome to my portfolio repository. This space highlights my technical journey from crafting aesthetic frontend interfaces to building robust, secure, and scalable backend systems.

---

## 🏛️ Project 1: ModernStudio (Architecture Portfolio)
A high-end, minimalist architecture studio website designed for visual storytelling and premium user experience.

* **Core Concepts**: Semantic HTML5/CSS3, Responsive Grid/Flexbox layouts, and Modern UI/UX standards.
* **Key Features**: Futuristic design showcase, mobile-responsive navigation, and interactive client inquiry forms.
* **Live Demo**: [https://gowshi9.github.io/DecodeLabs-Internship/](https://gowshi9.github.io/DecodeLabs-Internship/)

---

## ⚙️ Project 2 & 3: DecodeLabs Backend Services
A comprehensive backend infrastructure built for the **Skill-Based Internship Matching System**.

### 🛡️ The 4 Pillars of Database Integration (Project 3)
1. **Pillar 1 (Blueprint)**: Strict Mongoose schema design with Regex email validation and age constraints (`min: 18`).
2. **Pillar 2 (Bridge)**: Secure, environment-driven connections (`dotenv`) with graceful error monitoring.
3. **Pillar 3 (Action)**: Standardized RESTful CRUD operations (Create, Read, Update, Delete) mapped directly to database queries.
4. **Pillar 4 (Shield)**: Defense-in-depth security with input sanitization and pre-emptive ID validation to prevent NoSQL injection.

### 🔌 API Endpoints Mapping
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/users` | Register a new user |
| **GET** | `/api/users` | Fetch all registered users |
| **PUT** | `/api/users/:id` | Update an existing user |
| **DELETE** | `/api/users/:id` | Remove a user by ID |

---

## 🛠️ Technical Workflow
* **Frontend**: HTML5, CSS3, Google Fonts.
* **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM).
* **Quality Assurance**: Includes a 10-point Integration Test suite for database state verification.

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Setup environment (.env file required)
cp .env.example .env

# 3. Run integration tests
npm test

# 4. Start the server
node server.js
