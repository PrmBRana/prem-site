/**
 * Technical Notes & Articles Engine with Interactive Composer
 * Prem Bahadur Rana - Academic Engineering Notes
 * 
 * NOTE FOR PREM:
 * To add, edit, or remove articles, edit `articles-data.js`!
 * This file handles UI rendering, modals, and helper actions.
 */

(function () {
  'use strict';

  // Get articles from the dedicated articles-data.js database
  function getArticlesList() {
    if (window.ARTICLES_DATABASE && Array.isArray(window.ARTICLES_DATABASE) && window.ARTICLES_DATABASE.length > 0) {
      return window.ARTICLES_DATABASE;
    }
    return [];
  }

  /* -------------------------------------------------------------
     RENDER ARTICLES INTO DOM
     ------------------------------------------------------------- */
  function renderArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    const articles = getArticlesList();
    container.innerHTML = '';

    if (articles.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">
          No articles loaded yet. Edit <code>articles-data.js</code> to add your first article.
        </div>
      `;
      return;
    }

    articles.forEach((article) => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.onclick = () => openArticleReader(article.id);

      card.innerHTML = `
        <div class="article-top-meta">
          <span class="badge badge-blue">${article.category}</span>
          <span class="article-date">${article.date} · ${article.readTime}</span>
        </div>
        <h3 class="article-card-title">${article.title}</h3>
        <p class="article-card-excerpt">${article.excerpt}</p>
        <button class="article-read-btn" aria-label="Read article">
          Read Full Note <span>→</span>
        </button>
      `;
      container.appendChild(card);
    });
  }

  /* -------------------------------------------------------------
     READER MODAL CONTROLLER
     ------------------------------------------------------------- */
  const readerModal = document.getElementById('article-reader-modal');
  const readerTitle = document.getElementById('article-reader-title');
  const readerMeta = document.getElementById('article-reader-meta');
  const readerBody = document.getElementById('article-reader-body');
  const readerClose = document.getElementById('article-reader-close');

  function openArticleReader(articleId) {
    const articles = getArticlesList();
    const article = articles.find(a => a.id === articleId);
    if (!article || !readerModal) return;

    readerTitle.textContent = article.title;
    readerMeta.textContent = `${article.category} // Published: ${article.date} // ${article.readTime}`;
    readerBody.innerHTML = article.content;

    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleReader() {
    if (!readerModal) return;
    readerModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (readerClose) readerClose.addEventListener('click', closeArticleReader);
  if (readerModal) {
    readerModal.addEventListener('click', (e) => {
      if (e.target === readerModal) closeArticleReader();
    });
  }

  /* -------------------------------------------------------------
     INTERACTIVE ARTICLE COMPOSER & CODE GENERATOR
     ------------------------------------------------------------- */
  const composerModal = document.getElementById('article-composer-modal');
  const composerClose = document.getElementById('composer-close');
  const composerTextarea = document.getElementById('composer-content');
  const toastNotice = document.getElementById('toast-notice');

  window.openComposer = function () {
    if (!composerModal) return;
    composerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeComposer = function () {
    if (!composerModal) return;
    composerModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (composerClose) composerClose.addEventListener('click', window.closeComposer);
  if (composerModal) {
    composerModal.addEventListener('click', (e) => {
      if (e.target === composerModal) window.closeComposer();
    });
  }

  // Insert helper tag into textarea
  window.insertTag = function (tagType) {
    if (!composerTextarea) return;
    const start = composerTextarea.selectionStart;
    const end = composerTextarea.selectionEnd;
    const selected = composerTextarea.value.substring(start, end);
    let snippet = '';

    switch (tagType) {
      case 'h2':
        snippet = `<h2>${selected || 'Section Heading'}</h2>\n`;
        break;
      case 'p':
        snippet = `<p>${selected || 'Your explanatory text here.'}</p>\n`;
        break;
      case 'code':
        snippet = `<pre><code>${selected || '// Insert C, Verilog, or Python code here'}</code></pre>\n`;
        break;
      case 'ul':
        snippet = `<ul>\n  <li>${selected || 'First key item'}</li>\n  <li>Second key item</li>\n</ul>\n`;
        break;
      case 'img':
        snippet = `<img src="${selected || 'images/EPDM_Board_top.jpeg'}" alt="Figure description" style="width: 100%; border-radius: 6px; margin: 1rem 0;">\n`;
        break;
      case 'video':
        snippet = `<video controls style="width: 100%; border-radius: 6px; margin: 1rem 0;">\n  <source src="${selected || 'video/CW_GMSK.mp4'}" type="video/mp4">\n</video>\n`;
        break;
      default:
        snippet = selected;
    }

    composerTextarea.setRangeText(snippet, start, end, 'end');
    composerTextarea.focus();
  };

  function showToast(msg) {
    if (!toastNotice) return;
    toastNotice.textContent = msg || 'Action completed successfully!';
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  // Preview Draft in real Reader Modal
  window.previewDraft = function () {
    const title = document.getElementById('composer-title')?.value || 'Untitled Draft';
    const category = document.getElementById('composer-category')?.value || 'Technical Note';
    const date = document.getElementById('composer-date')?.value || 'Today';
    const readTime = document.getElementById('composer-readtime')?.value || '5 min read';
    const content = composerTextarea?.value || '<p>No content written yet.</p>';

    if (!readerModal) return;
    readerTitle.textContent = title;
    readerMeta.textContent = `${category} // Preview Draft // ${date} · ${readTime}`;
    readerBody.innerHTML = content;

    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Generate JS object code and copy to clipboard
  window.copyDraftCode = function () {
    const title = document.getElementById('composer-title')?.value || 'Untitled Draft';
    const category = document.getElementById('composer-category')?.value || 'Technical Note';
    const date = document.getElementById('composer-date')?.value || 'Aug 2026';
    const readTime = document.getElementById('composer-readtime')?.value || '5 min read';
    const excerpt = document.getElementById('composer-excerpt')?.value || 'Executive summary.';
    const content = composerTextarea?.value || '<p>Article content.</p>';

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-note';

    const jsCode = `  {
    id: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    category: '${category}',
    date: '${date}',
    readTime: '${readTime}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    content: \`
${content}
    \`
  },`;

    navigator.clipboard.writeText(jsCode).then(() => {
      showToast('✓ Code copied! Now paste into articles-data.js');
    }).catch(() => {
      prompt('Copy your article code:', jsCode);
    });
  };

  // Instantly add draft to the active live page
  window.addLiveDraft = function () {
    const title = document.getElementById('composer-title')?.value || 'Untitled Draft';
    const category = document.getElementById('composer-category')?.value || 'Technical Note';
    const date = document.getElementById('composer-date')?.value || 'Aug 2026';
    const readTime = document.getElementById('composer-readtime')?.value || '5 min read';
    const excerpt = document.getElementById('composer-excerpt')?.value || 'Executive summary.';
    const content = composerTextarea?.value || '<p>Content.</p>';
    const slug = 'draft-' + Date.now();

    if (!window.ARTICLES_DATABASE) window.ARTICLES_DATABASE = [];

    window.ARTICLES_DATABASE.unshift({
      id: slug,
      title: title,
      category: category,
      date: date,
      readTime: readTime,
      excerpt: excerpt,
      content: content
    });

    renderArticles();
    window.closeComposer();
    showToast('✓ Article added to live page! Click it to read.');

    const target = document.getElementById('articles');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  // Download draft as .js file
  window.downloadDraft = function () {
    const title = document.getElementById('composer-title')?.value || 'article-draft';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'article';
    const category = document.getElementById('composer-category')?.value || 'Technical Note';
    const date = document.getElementById('composer-date')?.value || 'Aug 2026';
    const readTime = document.getElementById('composer-readtime')?.value || '5 min read';
    const excerpt = document.getElementById('composer-excerpt')?.value || 'Executive summary.';
    const content = composerTextarea?.value || '<p>Content.</p>';

    const fileContent = `// Article: ${title}
// Generated for Prem Bahadur Rana's Portfolio (premrana.com.np)

const NEW_ARTICLE = {
  id: '${slug}',
  title: '${title.replace(/'/g, "\\'")}',
  category: '${category}',
  date: '${date}',
  readTime: '${readTime}',
  excerpt: '${excerpt.replace(/'/g, "\\'")}',
  content: \`
${content}
  \`
};
`;

    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${slug}.js`;
    link.click();
    showToast('✓ Downloaded ' + slug + '.js');
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (composerModal && composerModal.classList.contains('open')) window.closeComposer();
      if (readerModal && readerModal.classList.contains('open')) closeArticleReader();
    }
  });

  // Expose global methods
  window.openArticleReader = openArticleReader;
  window.renderArticles = renderArticles;

  document.addEventListener('DOMContentLoaded', renderArticles);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderArticles();
  }
})();
