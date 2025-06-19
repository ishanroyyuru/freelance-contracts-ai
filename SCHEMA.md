# Database Schema - Freelance Contract Manger

This document outlines the database schema for the Freelance Contract Manager app. It includes all core models, fields, and relationships based on the app's user stories.

--- 
## User

Stores information about registered users of the app

| Field          | Type      | Description                           |
|----------------|-----------|---------------------------------------|
| `id`           | UUID      | Unique identifier                     |
| `email`        | String    | User's email address (must be unique) |
| `passwordHash` | String    | Hashed password for login             |
| `name`         | String    | Full name of the user                 |
| `createdAt`    | DateTime  | When the account was created          |

---

## Contract

Represents an uploaded contract by a user.

| Field        | Type      | Description                                |
|--------------|-----------|--------------------------------------------|
| `id`         | UUID      | Unique identifier                          |
| `userId`     | UUID      | Foreign key → User who owns the contract   |
| `title`      | String    | Name/label for the contract                |
| `text`       | Text      | Full contract text or URL to stored file   |
| `status`     | Enum      | 'draft' / 'review' / 'approved'            |
| `createdAt`  | DateTime  | When the contract was added                |

---

## Annotation

Comments or notes added to specific parts of a contract.

| Field        | Type     | Description                                 |
|--------------|----------|---------------------------------------------|
| `id`         | UUID     | Unique identifier                           |
| `contractId` | UUID     | Foreign key → Contract                      |
| `userId`     | UUID     | Foreign key → User who added the comment    |
| `startOffset`| Integer  | Start character index in contract text      |
| `endOffset`  | Integer  | End character index in contract text        |
| `comment`    | String   | The actual comment                          |
| `createdAt`  | DateTime | When the comment was made                   |

---

## Summary

AI-generated summaries of selected clauses.

| Field         | Type     | Description                                |
|---------------|----------|--------------------------------------------|
| `id`          | UUID     | Unique identifier                          |
| `contractId`  | UUID     | Foreign key → Contract                     |
| `userId`      | UUID     | Foreign key → User who requested summary   |
| `originalText`| Text     | The clause sent to the AI model            |
| `summaryText` | Text     | AI-generated explanation                   |
| `createdAt`   | DateTime | When the summary was generated             |

---

## Relationships Summary

- A **User** can have many **Contracts**
- A **Contract** can have many **Annotations** and **Summaries**
- An **Annotation** belongs to one **Contract** and one **User**
- A **Summary** belongs to one **Contract** and one **User**

---

# Possible Future Extensions

- Add versioning to contracts
- Add roles (e.g. Reviewer, Admin) to users
- Add a history log for workflow changes
