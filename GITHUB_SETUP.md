# 🚀 Push Your Project to GitHub

Follow these simple steps to push your Book Recommendation System to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - **Repository name**: `Book-Recommendation-System`
   - **Description**: `A modern, AI-powered book recommendation engine with beautiful animations using Streamlit`
   - **Visibility**: Public
   - **License**: MIT
4. Click **"Create repository"**
5. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/Book-Recommendation-System.git`)

## Step 2: Add Remote and Push

Replace `YOUR_USERNAME` with your GitHub username:

```bash
cd "d:\Book Recommondation System"
git remote add origin https://github.com/YOUR_USERNAME/Book-Recommendation-System.git
git branch -M main
git push -u origin main
```

## Step 3: Authentication

When prompted for username/password:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

### How to Create a Personal Access Token:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Click **"Generate new token"**
3. Name: `Book-Recommendation-System`
4. Select scope: ✅ **repo** (full control of repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Paste it when prompted for password

## Step 4: Verify

Visit `https://github.com/YOUR_USERNAME/Book-Recommendation-System` to see your project!

## ✅ What Gets Uploaded

**Included:**
- ✅ `app.py` - Streamlit application
- ✅ `Book_Recommendation_System.ipynb` - Model training
- ✅ `books_data.csv` - Dataset
- ✅ `README.md` - Documentation
- ✅ `requirements.txt` - Dependencies
- ✅ `.gitignore` - Git ignore rules

**Excluded (too large/temporary):**
- ❌ `book_recommendation_model.pkl`
- ❌ `__pycache__/`
- ❌ `.streamlit/`
- ❌ `venv/`

## 🎯 Share Your Project

Once pushed, share the link:
```
https://github.com/YOUR_USERNAME/Book-Recommendation-System
```

Add **topics** on GitHub:
- `machine-learning`
- `recommendation-system`
- `streamlit`
- `python`
- `book-recommendations`

---

**Need Help?** Check [GitHub Docs](https://docs.github.com) or run:
```bash
git remote -v
git log --oneline
```
