import streamlit as st
import pandas as pd
import pickle
import time
import os
import sys

# Page configuration
st.set_page_config(
    page_title="📚 Book Recommendation System",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom session state initialization
if 'search_performed' not in st.session_state:
    st.session_state.search_performed = False
if 'model_loaded' not in st.session_state:
    st.session_state.model_loaded = False
if 'generating_model' not in st.session_state:
    st.session_state.generating_model = False
if 'model_generation_message' not in st.session_state:
    st.session_state.model_generation_message = None

# Custom CSS for modern animated UI
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
    font-family: 'Poppins', sans-serif;
}

.main {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.stApp {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}

/* Main title animation */
.main-title {
    text-align: center;
    font-size: 3.5em;
    font-weight: 700;
    background: linear-gradient(120deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 3s ease infinite, float 3s ease-in-out infinite;
    background-size: 200% 200%;
    margin-bottom: 0;
}

@keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.subtitle {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.3em;
    font-weight: 300;
    margin-bottom: 40px;
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Search box styling */
.search-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    margin: 20px auto;
    max-width: 900px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Book card styling */
.book-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)) !important;
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    margin: 15px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: cardSlideIn 0.6s ease-out forwards;
    opacity: 1;
    position: relative;
    overflow: hidden;
}

.book-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 3s infinite;
    pointer-events: none;
}

.book-card:hover {
    transform: translateY(-10px) scale(1.01) !important;
    box-shadow: 0 20px 40px rgba(240, 147, 251, 0.3) !important;
    border-color: rgba(240, 147, 251, 0.5) !important;
}

@keyframes cardSlideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

.book-title {
    font-size: 1.4em;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
}

.book-author {
    color: #f093fb;
    font-weight: 500;
    font-size: 1.1em;
    margin-bottom: 8px;
}

.book-rating {
    display: inline-block;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    padding: 8px 20px;
    border-radius: 25px;
    color: white;
    font-weight: 600;
    font-size: 0.95em;
    box-shadow: 0 5px 15px rgba(253, 160, 133, 0.4);
}

.rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    border-radius: 50%;
    font-weight: 700;
    font-size: 1.3em;
    margin-right: 20px;
    box-shadow: 0 5px 20px rgba(240, 147, 251, 0.5);
    animation: pulse 2s infinite;
    flex-shrink: 0;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 5px 20px rgba(240, 147, 251, 0.5); }
    50% { transform: scale(1.1); box-shadow: 0 8px 30px rgba(240, 147, 251, 0.7); }
}

/* Stats cards */
.metric-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.stat-number {
    font-size: 2.5em;
    font-weight: 700;
    background: linear-gradient(120deg, #f093fb, #f5576c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1em;
    margin-top: 5px;
}

/* Button styling */
.stButton > button {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 30px !important;
    padding: 15px 40px !important;
    font-size: 1.1em !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4) !important;
    width: 100% !important;
}

.stButton > button:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 15px 40px rgba(240, 147, 251, 0.6) !important;
}

/* Selectbox styling */
.stSelectbox > div > div {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 15px !important;
    color: white !important;
}

/* Loading animation */
.loading-container {
    text-align: center;
    padding: 50px;
}

.loading-text {
    color: white;
    font-size: 1.3em;
    animation: blink 1.5s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.match-bar {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 12px;
}

.match-fill {
    height: 100%;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 10px;
    animation: fillWidth 0.8s ease-out forwards;
}

@keyframes fillWidth {
    0% { width: 0%; }
    100% { width: 100%; }
}

h1, h2, h3, p, span, label {
    color: white !important;
}

.stMarkdown {
    color: white;
}
</style>
""", unsafe_allow_html=True)

# Generate model from data
def generate_model():
    """Generate recommendation model from CSV data"""
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import linear_kernel
        
        # Create containers for persistent messages
        warning_container = st.container()
        info_container = st.container()
        progress_container = st.container()
        
        with warning_container:
            st.warning("⚠️ Model file not found. Generating from data...", icon="⚠️")
        
        with info_container:
            st.info("🔨 Generating recommendation model from data... This may take 1-2 minutes on first run.", icon="🔨")
        
        with progress_container:
            progress_bar = st.progress(0, text="Loading dataset...")
            
            # Load and prepare data
            progress_bar.progress(20, text="Loading dataset...")
            df = pd.read_csv('books_data.csv')
            
            # Convert rating to numeric
            progress_bar.progress(40, text="Processing book data...")
            df['average_rating'] = pd.to_numeric(df['average_rating'], errors='coerce')
            df['book_content'] = df['title'] + ' ' + df['authors']
            
            # Create TF-IDF vectors
            progress_bar.progress(60, text="Creating TF-IDF vectors...")
            tfidf_vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf_vectorizer.fit_transform(df['book_content'])
            
            # Compute similarity
            progress_bar.progress(80, text="Computing similarity matrix...")
            cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
            
            # Save model
            progress_bar.progress(95, text="Saving model...")
            model_data = {
                'tfidf_vectorizer': tfidf_vectorizer,
                'tfidf_matrix': tfidf_matrix,
                'cosine_sim': cosine_sim,
                'df': df
            }
            
            with open('book_recommendation_model.pkl', 'wb') as f:
                pickle.dump(model_data, f)
            
            progress_bar.progress(100, text="✅ Model generated successfully!")
            time.sleep(1)
        
        return model_data, None
        
    except FileNotFoundError:
        return None, "Dataset file (books_data.csv) not found!"
    except Exception as e:
        return None, f"Error generating model: {str(e)}"

# Load the model with error handling
@st.cache_resource
def load_model():
    try:
        model_path = 'book_recommendation_model.pkl'
        
        # If model doesn't exist, return special flag
        if not os.path.exists(model_path):
            return None, "MODEL_NOT_FOUND"
        
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        # Validate model structure
        required_keys = ['tfidf_vectorizer', 'tfidf_matrix', 'cosine_sim', 'df']
        missing_keys = [key for key in required_keys if key not in model_data]
        
        if missing_keys:
            return None, f"Model incomplete. Missing: {', '.join(missing_keys)}"
        
        return model_data, None
    except pickle.UnpicklingError as e:
        return None, f"Corrupted model file: {str(e)}"
    except Exception as e:
        return None, f"Error loading model: {str(e)}"

# Recommendation function with comprehensive error handling
def get_recommendations(book_title, model_data, num_recommendations=10):
    """Get book recommendations with error handling"""
    try:
        if not book_title or not book_title.strip():
            return None, "Please select a book"
        
        df = model_data['df']
        cosine_sim = model_data['cosine_sim']
        
        # Check if book exists
        matching_books = df[df['title'] == book_title]
        if matching_books.empty:
            return None, f"Book '{book_title}' not found in database"
        
        idx = matching_books.index[0]
        
        # Get similarity scores
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:num_recommendations + 1]
        
        if not sim_scores:
            return None, "Could not find similar books"
        
        book_indices = [i[0] for i in sim_scores]
        
        # Get columns safely
        available_cols = df.columns.tolist()
        cols_to_get = ['title', 'authors', 'average_rating']
        cols_to_get = [col for col in cols_to_get if col in available_cols]
        
        if 'title' not in cols_to_get:
            return None, "Required columns missing from dataset"
        
        recommendations = df.iloc[book_indices][cols_to_get].copy()
        recommendations['similarity_score'] = [score[1] for score in sim_scores]
        
        return recommendations, None
        
    except IndexError as e:
        return None, f"Index error: {str(e)}"
    except KeyError as e:
        return None, f"Missing column: {str(e)}"
    except Exception as e:
        return None, f"Unexpected error: {str(e)}"

# Main app
def main():
    # Load model with error handling
    model_data, model_error = load_model()
    
    # If model not found, generate it
    if model_error == "MODEL_NOT_FOUND":
        st.markdown('<h1 class="main-title">📚 Book Recommendation System</h1>', unsafe_allow_html=True)
        model_data, gen_error = generate_model()
        
        if gen_error:
            st.error(f"❌ {gen_error}")
            if "books_data.csv" in gen_error.lower():
                st.warning("⚠️ **Dataset Missing!**\n\nPlease ensure `books_data.csv` is in the same directory as the app.")
            return
    elif model_error:
        st.markdown('<h1 class="main-title">📚 Book Recommendation System</h1>', unsafe_allow_html=True)
        st.error(f"❌ {model_error}")
        st.info("🔄 **Auto-generation failed.** Please ensure:\n\n1. `books_data.csv` exists in this directory\n2. You have internet access to install required packages\n3. Sufficient disk space is available\n\nTry refreshing the page to retry.")
        return
    
    df = model_data['df']
    
    # Header with animation
    st.markdown('<h1 class="main-title">📚 Book Recommendation System</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">✨ Discover your next favorite book with AI-powered recommendations ✨</p>', unsafe_allow_html=True)

    # Sidebar with statistics and settings
    with st.sidebar:
        st.markdown("## 🎯 Settings & Configuration")
        num_recommendations = st.slider("Number of Recommendations", 5, 20, 10, help="How many books would you like to see")
        
        st.markdown("---")
        st.markdown("## 📊 Dataset Statistics")
        
        # Display metrics with animations
        col1, col2 = st.columns(2)
        with col1:
            st.markdown(f"""
            <div class="metric-card">
                <div class="stat-number">{len(df):,}</div>
                <div class="stat-label">📚 Total Books</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card">
                <div class="stat-number">{df['authors'].nunique():,}</div>
                <div class="stat-label">✍️ Authors</div>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Parse rating safely
        try:
            avg_rating = pd.to_numeric(df['average_rating'], errors='coerce').mean()
            st.markdown(f"""
            <div class="metric-card">
                <div class="stat-number">⭐ {avg_rating:.2f}</div>
                <div class="stat-label">Avg Rating</div>
            </div>
            """, unsafe_allow_html=True)
        except Exception as e:
            st.warning("Could not calculate average rating")
        
        st.markdown("---")
        st.markdown("## 🔍 How it Works")
        st.info("✨ **TF-IDF + Cosine Similarity**\n\nThis system analyzes book titles and authors to find books with similar characteristics. The similarity score shows how closely each recommendation matches your selection.")
        
        st.markdown("---")
        st.markdown("## ⚙️ About")
        st.caption("Book Recommendation System v1.0 | Powered by Machine Learning")

    # Main search container
    st.markdown('<div class="search-container">', unsafe_allow_html=True)
    
    st.markdown("### 🔍 Find Books You'll Love")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Book selection with improved UI
        book_titles = df['title'].tolist()
        selected_book = st.selectbox(
            "Search or Select a Book",
            options=["-- Select a Book --"] + book_titles,
            index=0,
            help="Start typing to search for a book in our database"
        )
    
    with col2:
        st.markdown("<br>", unsafe_allow_html=True)
        search_clicked = st.button("🚀 Get Recommendations", use_container_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

    # Display recommendations section
    if search_clicked or st.session_state.search_performed:
        if selected_book == "-- Select a Book --":
            st.warning("⚠️ Please select a book first to get recommendations")
        else:
            st.session_state.search_performed = True
            
            with st.spinner(""):
                # Custom loading animation
                loading_placeholder = st.empty()
                loading_placeholder.markdown("""
                <div class="loading-container">
                    <div class="loading-text">🔮 Analyzing books and finding perfect matches...</div>
                </div>
                """, unsafe_allow_html=True)
                time.sleep(1.2)
                loading_placeholder.empty()
            
            # Get recommendations
            recommendations, error = get_recommendations(selected_book, model_data, num_recommendations)
            
            if error:
                st.error(f"❌ {error}")
            elif recommendations is not None and len(recommendations) > 0:
                st.markdown(f"""
                <div style="text-align: center; margin: 30px 0;">
                    <h2 style="background: linear-gradient(120deg, #f093fb, #f5576c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    📖 Perfect Matches for "{selected_book}"
                    </h2>
                    <p style="color: rgba(255,255,255,0.7); margin-top: 10px;">
                    Found {len(recommendations)} highly relevant recommendations
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                # Display each recommendation
                for idx, (_, row) in enumerate(recommendations.iterrows(), 1):
                    try:
                        title = row.get('title', 'Unknown')
                        authors = row.get('authors', 'Unknown Author')
                        rating = row.get('average_rating', 'N/A')
                        similarity = row.get('similarity_score', 0)
                        
                        # Convert rating to float safely
                        try:
                            rating_float = float(rating)
                            rating_display = f"{rating_float:.2f}"
                        except:
                            rating_display = str(rating)
                        
                        match_percent = int(similarity * 100)
                        
                        # Create columns
                        col_badge, col_content = st.columns([0.1, 0.9])
                        
                        with col_badge:
                            st.markdown(f'<div style="display: flex; justify-content: center; padding-top: 5px;"><div class="rank-badge" style="margin-right: 0;">{idx}</div></div>', unsafe_allow_html=True)
                        
                        with col_content:
                            st.markdown(f'<div class="book-card"><div class="book-title">📕 {title}</div><div class="book-author">✍️ {authors}</div><div style="margin-top: 12px; display: flex; gap: 12px; flex-wrap: wrap;"><span class="book-rating">⭐ {rating_display}</span><span style="background: linear-gradient(135deg, #4facfe, #00f2fe); padding: 6px 14px; border-radius: 20px; color: white; font-weight: 600; font-size: 0.9em; white-space: nowrap;">🎯 {match_percent}% Match</span></div><div class="match-bar"><div class="match-fill" style="width: {match_percent}%;"></div></div></div>', unsafe_allow_html=True)
                        
                    except Exception as e:
                        st.error(f"Error displaying recommendation {idx}: {str(e)}")
                        continue
                
                # Success message
                st.success(f"✅ Successfully found {len(recommendations)} recommendations!")
                
            else:
                st.error("❌ Could not generate recommendations. Please try another book.")

    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px; margin-top: 40px;">
        <p>Made with ❤️ using Streamlit | 📚 Advanced Book Recommendation System</p>
        <p style="font-size: 0.85em; margin-top: 10px;">Using TF-IDF Vectorization & Cosine Similarity | Enhanced UI with Animations</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
