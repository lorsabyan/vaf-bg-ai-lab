import { API_CONFIG } from '../utils/constants';

class ArticleService {
  async searchArticles(searchTerm, accessToken, pageSize = 20, pageNumber = 0) {
    try {
      const response = await fetch(
        `${API_CONFIG.INDEXING_BASE_URL}/Map/Search?Term=${encodeURIComponent(searchTerm)}&PageSize=${pageSize}&PageNumber=${pageNumber}&LanguageId=1`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        return {
          success: false,
          error: 'Ձեր սեսիան սպառվել է։',
          unauthorized: true,
        };
      }

      const result = await response.json();

      if (response.ok && result.accepted) {
        return {
          success: true,
          data: result.data?.[0]?.items || [],
        };
      } else {
        return {
          success: false,
          error: result.errorMessages?.join(', ') || 'Որոնումը ձախողվեց։',
        };
      }
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: 'Որոնման ժամանակ տեղի ունեցավ սխալ։',
      };
    }
  }

  extractPlainText(htmlContent) {
    // Create a temporary div to extract text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  formatArticleContent(article) {
    if (!article) return null;

    // Use the article's ID, or generate one if not available
    const articleId = article.id || article.nodeId || 'default-article';
    
    let contentHtml = `<h3 class="text-xl font-bold text-sky-800 mb-4">${article.mainTitle || article.shortTitle}</h3>`;
    
    let articleFormattedText = '<p class="text-slate-500">Այս հոդվածի համար մանրամասն բովանդակություն չկա։</p>';
    
    if (article.content?.length > 0) {
      const armenianContent = article.content.find(c => c.languageId === 1);
      if (armenianContent?.formattedText) {
        articleFormattedText = armenianContent.formattedText;
      } else if (article.content[0]?.formattedText) {
        articleFormattedText = article.content[0].formattedText;
      }
    } else if (article.formattedText) {
      articleFormattedText = article.formattedText;
    }
    
    contentHtml += articleFormattedText;
    
    if (article.featuredImageResized || article.featuredImage) {
      contentHtml += `<div class="my-4"><img src="${article.featuredImageResized || article.featuredImage}" alt="${article.mainTitle || 'Հոդվածի նկար'}" class="rounded-md shadow-md max-w-full h-auto mx-auto" onerror="this.onerror=null; this.src='https://placehold.co/600x400/E2E8F0/4A5568?text=Պատկեր+չկա'; this.alt='Պատկերը հասանելի չէ';"></div>`;
    }

    // Wrap the entire content in an article tag with the ID attribute
    const wrappedContent = `<article id="${articleId}">${contentHtml}</article>`;

    return {
      html: wrappedContent,
      plainText: this.extractPlainText(contentHtml),
    };
  }
}

export default new ArticleService();
