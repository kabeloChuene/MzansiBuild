
### Data Flow
1. User interacts with React frontend
2. Firebase Authentication handles user login/signup
3. Firestore stores all project, comment, and milestone data
4. Real-time listeners update UI automatically when data changes

---

## 🚀 Deployment Model

**Platform:** Vercel 

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect GitHub repo to Vercel/Netlify
3. Configure environment variables (see below)
4. Deploy automatically on push to main branch

**Build Settings:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18.x

---

## 🎨 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Firebase (Auth, Firestore) |
| Routing | React Router DOM |
| Icons | Lucide React |
| Version Control | Git + GitHub |
| Deployment | Vercel/Netlify |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Git installed (or GitHub Desktop)

### Step 1: Clone the repository

**Using Git command line:**
```bash
git clone https://github.com/kabeloChuene/MzansiBuild.git
cd MzansiBuild
