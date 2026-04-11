
### 2.2 User Classes

| User Class | Description | Access Level |
|------------|-------------|--------------|
| Guest | Unauthenticated visitor | Read-only: live feed and celebration wall |
| Registered Developer | Authenticated user | Full platform access |
| Project Owner | Developer who created a project | Full CRUD on own projects, milestones |

### 2.3 Operating Environment

- **Client:** Modern web browser (Chrome, Firefox, Edge, Safari)
- **Network:** Standard internet connection
- **Backend:** Firebase cloud infrastructure
- **Hosting:** Vercel/Netlify or Firebase Hosting

### 2.4 Design Constraints

- Design theme: green, white, and black as per challenge specification
- React SPA with client-side routing
- All Firebase API keys stored in environment variables
- GitHub repository public for assessment duration

---

## 3. Functional Requirements

### 3.1 Account Management

**FR-001 — User Registration**

The system shall allow a developer to create an account using an email address and password via Firebase Authentication.

*Acceptance criteria:*
- Email must be validated (format check + Firebase uniqueness check)
- Password must be a minimum of 8 characters
- User is redirected to the feed after successful registration

**FR-002 — User Authentication State**

The system shall persist authentication state across browser sessions.

*Acceptance criteria:*
- Logged-in user remains authenticated after reopening browser
- Protected routes redirect unauthenticated users to login page
- Sign-out clears authentication state immediately

### 3.2 Project Management

**FR-003 — Create Project**

A registered developer shall be able to create a new project entry with the following fields:

| Field | Type | Required |
|-------|------|----------|
| Project name | String (max 100 chars) | Yes |
| Description | String (max 500 chars) | Yes |
| Stage | Enum (idea, completed, shipped) | Yes |
| Tech stack tags | Array of strings | No |
| Support needed | Array of strings | No |

*Acceptance criteria:*
- Required fields enforced with validation
- CreatedAt and updatedAt timestamps set server-side
- Project appears in live feed immediately

**FR-004 — Edit and Delete Project**

A project owner shall be able to edit all fields of their own project and permanently delete it.

*Acceptance criteria:*
- Only project owner (matching ownerId) can edit or delete
- Deletion removes project document and all associated subcollections
- Edit triggers updatedAt timestamp refresh

**FR-005 — Project Stage Tracking**

Projects shall be assigned one of the following stages:
- `idea` — Initial concept phase
- `completed` — Project fully complete (triggers Celebration Wall)
- `shipped` — Project deployed (triggers Celebration Wall)

*Acceptance criteria:*
- Stage displayed as color-coded badge on project card
- Stage change updates updatedAt

**FR-006 — Support Needed Flags**

A developer shall be able to indicate what type of support they are looking for.

*Acceptance criteria:*
- Multiple support types can be selected
- Support tags visible on project card in live feed

### 3.3 Milestones

**FR-007 — Add Milestone**

A project owner shall be able to log milestones against their project.

| Field | Type | Required |
|-------|------|----------|
| Title | String (max 100 chars) | Yes |
| Description | String (max 300 chars) | No |
| Date achieved | Date | Yes |

*Acceptance criteria:*
- Milestones stored as subcollection at `projects/{projectId}/milestones`
- Milestones displayed in chronological timeline on project detail page

**FR-008 — Delete Milestone**

A project owner shall be able to delete milestones permanently.

### 3.4 Live Feed

**FR-009 — Real-Time Project Feed**

All visitors shall see a live feed of projects ordered by most recently updated.

*Acceptance criteria:*
- Feed implemented using Firestore onSnapshot listener
- New and updated projects appear within 2 seconds
- Feed displays: project name, description, stage badge, owner name, support tags, comment count, timestamp

### 3.5 Comments and Collaboration

**FR-010 — Comment on a Project**

A registered developer shall be able to comment on any project.

*Acceptance criteria:*
- Comments stored in subcollection at `projects/{projectId}/comments`
- Comment displays author name, text, and timestamp
- Comments visible to all visitors
- Comment count shown on project card
- Users can like/unlike comments
- Users can delete their own comments

**FR-011 — Raise Hand for Collaboration**

A registered developer shall be able to raise a collaboration request on any project they do not own.

*Acceptance criteria:*
- "Raise Hand" button visible on project cards and detail page for authenticated non-owners
- Developer can withdraw their hand (toggle on/off)
- Project owner can see count of interested developers

### 3.6 Celebration Wall

**FR-012 — Automatic Wall Addition**

When a project owner marks their project stage as `completed` or `shipped`, the project shall automatically appear on the public Celebration Wall.

*Acceptance criteria:*
- Projects with stage `completed` or `shipped` are displayed
- Wall displays: project name, owner name, description, tech stack, completion date

**FR-013 — Celebration Wall Display**

The Celebration Wall shall display all completed/shipped projects with a confetti animation on page load.

*Acceptance criteria:*
- Separate route `/celebration`
- Stats counters show: total projects, happy builders, shipped projects
- Confetti animation plays on page load when projects exist
- Gradient card design with celebration badges

---

## 4. Non-Functional Requirements

**NFR-001 — Performance**
Initial page load shall complete within 3 seconds. Live feed updates within 2 seconds.

**NFR-002 — Security**
All write operations protected by Firestore security rules. API keys stored in `.env` files excluded from version control.

**NFR-003 — Usability**
Interface conforms to green, white, and black design theme. Responsive on mobile to desktop.

**NFR-004 — Reliability**
Application relies on Firebase's 99.95% SLA for Firestore and Authentication.

**NFR-005 — Maintainability**
React components follow consistent naming conventions (camelCase for functions, PascalCase for components).

**NFR-006 — Scalability**
Firestore queries use indexed fields (stage, updatedAt) for consistent performance.

---

## 5. System Constraints

| Constraint | Detail |
|------------|--------|
| Free tier limits | Firebase Spark plan: 50k reads/day, 20k writes/day |
| No server-side logic | All logic runs client-side |
| Public repository | Code must remain publicly visible for assessment |
| Solo development | Individual submission only |

---

## 6. Data Requirements

### 6.1 Firestore Collections Schema

**`projects/{projectId}`**

```javascript
{
  projectId: string,
  ownerId: string,
  ownerName: string,
  name: string,
  description: string,
  stage: 'idea' | 'completed' | 'shipped',
  techStack: string[],
  supportNeeded: string[],
  commentCount: number,
  raisedHands: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}