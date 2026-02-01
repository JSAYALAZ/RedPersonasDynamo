# SocialGraph — People & Relationships (DynamoDB + Next.js)

Minimal social graph app built with a **single-table design in DynamoDB**, a small API in **Next.js/Node**, and a **Tailwind UI** to manage **profiles** and **relationships**.

> Focus: clean architecture, scalable DynamoDB modeling, and a minimalist UX.

---

## ✨ Features

- **People (Profiles)**
  - Create a person profile (name, nickname, residence, email)
  - List all profiles using a DynamoDB **GSI** for fast access
  - Count profiles efficiently

- **Relationships**
  - Select **exactly two people** from the UI (card selection)
  - “Create relation” button becomes enabled only when two are selected
  - Create a relation by selecting only the **relation type** (modal)
  - Person detail view groups relationships by type and shows partners

- **Live updates**
  - Person detail page **polls the API every 30 seconds** (auto-refresh)

---

## 🧠 DynamoDB Data Modeling (Single-Table)

This project uses a **single-table** approach with composite keys and a GSI.

### Primary keys
- `pk` (partition key)
- `sk` (sort key)

### Profile item
Example:
```json
{
  "pk": "PERSON#u1",
  "sk": "PROFILE",
  "name": "Jose Ayala",
  "nickname": "jsayala",
  "residence": "Quito",
  "email": "jsayala@hotmail.com",
  "GSI1PK": "PROFILE",
  "GSI1SK": 1700000000000
}
```

### GSI used for listing profiles
- **GSI1**
  - `GSI1PK` (String) → `"PROFILE"`
  - `GSI1SK` (Number) → timestamp for ordering

This enables:
- List all profiles by querying `GSI1PK = "PROFILE"`
- Count profiles with `Select: "COUNT"` and pagination

---

## 🔎 Key DynamoDB Operations (Backend)

### Get a profile name by ID (GetCommand)
Profiles are fetched by **exact key**:
- `pk = PERSON#u1`
- `sk = PROFILE`

A safe helper normalizes inputs like `"1"`, `"u1"`, or `"PERSON#u1"` into a valid `pk`.

### Count profiles
Profiles are counted via `GSI1` using `Select: "COUNT"` and pagination to handle >1MB results.

---

## 🖥️ Frontend UX

### People list (minimalist UI)
- Card-based list using Tailwind
- Clicking a card toggles selection
- Selected cards show a subtle ring + “Selected” badge
- The UI keeps at most **2 selected IDs** (the relation flow depends on it)

### Floating actions
Floating buttons in the bottom-right:
- **Add person** (opens CreatePerson modal)
- **Add relation** (disabled until 2 persons are selected)

### Person detail page
Displays:
- Basic info: name, nickname, residence, pk
- Relations grouped by type:
  - Each group lists partners
- Auto-refresh every **30 seconds**
- Manual “Refresh” button

---

## 🧩 API Response (Person Detail)

Example response used for rendering:
```json
{
  "name": "daniel",
  "nickname": "daniel",
  "pk": "PERSON#u4",
  "residence": "Cuenca",
  "relations": [
    {
      "type": "FAMILY",
      "partners": [
        { "importante": 0, "id": "Sin definir", "name": "Jose Ayala" },
        { "importante": 0, "id": "Sin definir", "name": "angy" }
      ]
    },
    {
      "type": "FRIEND",
      "partners": [
        { "importante": 0, "id": "Sin definir", "name": "Xavier Siguachi" }
      ]
    }
  ]
}
```

---

## 🛠 Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Next.js (API routes) / Node
- **HTTP Client:** Axios + custom `useAxios` hook
- **Database:** AWS DynamoDB (single-table design + GSI)
- **UX:** Modals, floating buttons, selection-based actions
- **Notifications:** react-toastify

---

## ▶️ Getting Started

### 1) Install
```bash
npm install
# or
pnpm install
```

### 2) Environment variables
Create `.env.local` (example):
```bash
AWS_REGION=us-east-1
SOCIALGRAPH_TABLE=SocialGraph
```

> Ensure your AWS credentials are configured (AWS CLI profile, environment variables, or IAM role).

### 3) Run dev
```bash
npm run dev
# or
pnpm dev
```

Open:
- `http://localhost:3000`

---

## ✅ What I Learned / Highlights (Portfolio Notes)

- How to design a scalable **social graph** with DynamoDB using:
  - Composite keys (`pk`, `sk`)
  - A **GSI** for listing and counting entities
- When to use **GetCommand vs QueryCommand** (exact key lookup vs range queries)
- Pagination patterns for DynamoDB to avoid 1MB page limits
- Building a minimalist UI with:
  - card selection logic (max 2)
  - disabled actions based on state
  - modal-driven workflows
- Implementing simple **polling** for near-real-time views

---

## 📌 Roadmap Ideas

- Add real relation persistence (write both directions: A→B and B→A)
- Support weighted importance and sorting partners
- Add “remove relation” and “remove person” flows
- Replace polling with SSE/WebSockets (or DynamoDB Streams → push)

---

## 🧑‍💻 Author

**Jose** — Web Developer (Node.js)  
Portfolio: https://www.linkedin.com/in/jsayalaec/
