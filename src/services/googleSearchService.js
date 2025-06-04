class GoogleSearchService {
  constructor() {
    this.apiKey = null;
    this.searchEngineId = null;
  }

  initializeAPI(apiKey, searchEngineId) {
    console.log('GoogleSearchService.initializeAPI called with:', {
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'null',
      searchEngineId: searchEngineId || 'null'
    });
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  async searchImages(query, language = 'hy', maxResults = 3, context = '') {
    console.log('🔍 searchImages called:', { query, language, maxResults, hasContext: !!context });
    if (!this.apiKey || !this.searchEngineId) {
      const missingItems = [];
      if (!this.apiKey) missingItems.push('API Key');
      if (!this.searchEngineId) missingItems.push('Search Engine ID');
      console.error('Google Search API not configured. Missing:', missingItems.join(', '));
      throw new Error(`Google Search API not configured. Missing: ${missingItems.join(', ')}`);
    }

    // Try multiple search strategies, starting with the simplest
    const searchStrategies = [
      {
        name: 'simple',
        query: query.trim(),
        params: ''
      },
      {
        name: 'enhanced',
        query: this.buildImageSearchQuery(query, language, context),
        params: '&imgSize=medium'
      },
      {
        name: 'minimal',
        query: query.trim(),
        params: '&imgSize=large'
      }
    ];

    for (const strategy of searchStrategies) {
      try {
        console.log(`🚀 Trying ${strategy.name} image search strategy:`, strategy.query);
        
        const searchQuery = encodeURIComponent(strategy.query);
        const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${searchQuery}&searchType=image&num=${maxResults}&safe=active${strategy.params}`;
        
        console.log(`📡 ${strategy.name} image search URL:`, url.replace(this.apiKey, 'API_KEY_HIDDEN'));
        
        const response = await fetch(url);
        const data = await response.json();

        console.log(`📊 ${strategy.name} API response status:`, response.status);
        console.log(`📋 ${strategy.name} API response:`, {
          totalResults: data.searchInformation?.totalResults,
          itemsCount: data.items?.length || 0,
          hasItems: !!data.items,
          error: data.error
        });

        if (!response.ok) {
          console.error(`❌ ${strategy.name} API error:`, data.error);
          continue; // Try next strategy
        }

        if (data.items && data.items.length > 0) {
          console.log(`✅ ${strategy.name} search succeeded with ${data.items.length} results`);
          return {
            success: true,
            data: data.items.map(item => ({
              title: item.title,
              link: item.link,
              thumbnailLink: item.image?.thumbnailLink,
              contextLink: item.image?.contextLink,
              displayLink: item.displayLink
            }))
          };
        } else {
          console.log(`⚠️ ${strategy.name} search returned no items`);
        }
      } catch (error) {
        console.error(`💥 ${strategy.name} search failed:`, error);
        continue; // Try next strategy
      }
    }
    
    // If all strategies failed
    console.error('🚫 All image search strategies failed');
    return {
      success: false,
      error: 'No images found with any search strategy'
    };
  }

  async searchWeb(query, language = 'hy', maxResults = 3) {
    if (!this.apiKey || !this.searchEngineId) {
      const missingItems = [];
      if (!this.apiKey) missingItems.push('API Key');
      if (!this.searchEngineId) missingItems.push('Search Engine ID');
      throw new Error(`Google Search API not configured. Missing: ${missingItems.join(', ')}`);
    }

    try {
      // Enhanced query for educational web content
      const enhancedQuery = this.buildWebSearchQuery(query, language);
      console.log('Enhanced web search query:', enhancedQuery);
      
      const searchQuery = encodeURIComponent(enhancedQuery);
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${searchQuery}&num=${maxResults}&safe=active&lr=lang_${language}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Search failed');
      }

      return {
        success: true,
        data: data.items?.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
          formattedUrl: item.formattedUrl
        })) || []
      };
    } catch (error) {
      console.error('Google Web search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async searchCitations(query, language = 'hy', maxResults = 3) {
    if (!this.apiKey || !this.searchEngineId) {
      const missingItems = [];
      if (!this.apiKey) missingItems.push('API Key');
      if (!this.searchEngineId) missingItems.push('Search Engine ID');
      throw new Error(`Google Search API not configured. Missing: ${missingItems.join(', ')}`);
    }

    try {
      // Enhanced query for academic citations
      const enhancedQuery = this.buildCitationSearchQuery(query, language);
      console.log('Enhanced citation search query:', enhancedQuery);
      
      const academicQuery = encodeURIComponent(enhancedQuery);
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${academicQuery}&num=${maxResults}&safe=active&lr=lang_${language}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Search failed');
      }

      return {
        success: true,
        data: data.items?.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
          formattedUrl: item.formattedUrl,
          // Extract potential citation info
          authors: this.extractAuthors(item.snippet),
          year: this.extractYear(item.snippet)
        })) || []
      };
    } catch (error) {
      console.error('Google Citations search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractAuthors(snippet) {
    // Simple regex to find author patterns
    const authorPattern = /([A-Z][a-z]+ [A-Z][a-z]+(?:,? [A-Z][a-z]+ [A-Z][a-z]+)*)/;
    const match = snippet.match(authorPattern);
    return match ? match[1] : null;
  }

  extractYear(snippet) {
    // Extract year patterns (1900-2099)
    const yearPattern = /(19|20)\d{2}/;
    const match = snippet.match(yearPattern);
    return match ? match[0] : null;
  }

  buildImageSearchQuery(query, language = 'hy', context = '') {
    // Clean and normalize the query
    const cleanQuery = query.trim();
    
    // Start with the original query for better relevance
    let enhancedQuery = cleanQuery;
    
    // Add simple educational context without overwhelming the search
    const simpleEnhancements = [];
    
    // Add language-specific term only for Armenian
    if (language === 'hy') {
      simpleEnhancements.push('հայերեն');
    }
    
    // Add one relevant educational term based on content
    const lowerQuery = cleanQuery.toLowerCase();
    if (lowerQuery.includes('armenia') || lowerQuery.includes('armenian')) {
      simpleEnhancements.push('armenian');
    } else if (lowerQuery.includes('history')) {
      simpleEnhancements.push('historical');
    } else if (lowerQuery.includes('culture')) {
      simpleEnhancements.push('cultural');
    } else if (lowerQuery.includes('science') || lowerQuery.includes('nature')) {
      simpleEnhancements.push('educational');
    } else {
      // Default educational context
      simpleEnhancements.push('educational');
    }
    
    // Only add 1-2 enhancement terms to keep query simple
    if (simpleEnhancements.length > 0) {
      enhancedQuery += ` ${simpleEnhancements.slice(0, 2).join(' ')}`;
    }
    
    console.log('Simplified image search query:', { original: cleanQuery, enhanced: enhancedQuery });
    return enhancedQuery;
  }

  buildWebSearchQuery(query, language = 'hy') {
    const cleanQuery = query.trim();
    
    // Language-specific terms
    const languagePrefix = language === 'hy' ? 'հայերեն' : '';
    
    // Site restrictions for educational content
    const siteRestrictions = 'site:*.edu OR site:*.org OR site:*.gov OR site:wikipedia.org OR site:britannica.com OR site:*.ac.* OR site:educational.com';
    
    return `${cleanQuery} ${languagePrefix} ${siteRestrictions}`.trim();
  }

  buildCitationSearchQuery(query, language = 'hy') {
    const cleanQuery = query.trim();
    
    // Use exact phrase search for better citation matching
    const phraseQuery = `"${cleanQuery}"`;
    
    // Language-specific terms
    const languagePrefix = language === 'hy' ? 'հայերեն' : '';
    
    // Academic site restrictions
    const academicSites = 'site:*.edu OR site:scholar.google.com OR site:jstor.org OR site:*.ac.* OR site:researchgate.net OR site:academia.edu OR site:arxiv.org OR site:pubmed.ncbi.nlm.nih.gov';
    
    return `${phraseQuery} ${languagePrefix} ${academicSites}`.trim();
  }

  // Extract contextual keywords from surrounding text to improve search relevance
  buildContextualQuery(selectedTerm, context = '', language = 'hy') {
    const cleanTerm = selectedTerm.trim();
    
    // Extract potential context keywords from the article text around the selected term
    const contextKeywords = this.extractContextKeywords(context, cleanTerm);
    
    // Build a more contextual query
    let contextualQuery = cleanTerm;
    
    if (contextKeywords.length > 0) {
      // Add up to 2 most relevant context keywords
      contextualQuery += ` ${contextKeywords.slice(0, 2).join(' ')}`;
    }
    
    return contextualQuery;
  }

  extractContextKeywords(text, selectedTerm) {
    if (!text || text.length < 50) return [];
    
    // Find the position of the selected term in the text
    const termIndex = text.toLowerCase().indexOf(selectedTerm.toLowerCase());
    if (termIndex === -1) return [];
    
    // Extract a window of text around the term (±200 characters)
    const start = Math.max(0, termIndex - 200);
    const end = Math.min(text.length, termIndex + selectedTerm.length + 200);
    const window = text.substring(start, end);
    
    // Extract meaningful words (longer than 3 characters, not common words)
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'was', 'were', 'is', 'are', 'have', 'has', 'had', 'will', 'would', 'could',
      'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'then',
      'also', 'very', 'just', 'even', 'more', 'most', 'some', 'any', 'all', 'each'
    ]);
    
    const words = window
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !commonWords.has(word) && 
        word !== selectedTerm.toLowerCase()
      );
    
    // Count word frequency and return most common contextual words
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);
  }

  async searchAll(query, language = 'hy', context = '') {
    console.log('GoogleSearchService.searchAll called with:', { query, language, hasContext: !!context });
    try {
      // Prioritize quality over quantity - reduce number of results but improve relevance
      const [images, webLinks, citations] = await Promise.allSettled([
        this.searchImages(query, language, 3, context), // Pass context to image search
        this.searchWeb(query, language, 3),    // 3 web links
        this.searchCitations(query, language, 2) // 2 citations for quality
      ]);

      const result = {
        success: true,
        data: {
          images: images.status === 'fulfilled' && images.value.success ? images.value.data : [],
          webLinks: webLinks.status === 'fulfilled' && webLinks.value.success ? webLinks.value.data : [],
          citations: citations.status === 'fulfilled' && citations.value.success ? citations.value.data : []
        },
        // Add metadata about search performance
        searchMetadata: {
          query: query,
          language: language,
          timestamp: new Date().toISOString(),
          resultsCount: {
            images: images.status === 'fulfilled' && images.value.success ? images.value.data.length : 0,
            webLinks: webLinks.status === 'fulfilled' && webLinks.value.success ? webLinks.value.data.length : 0,
            citations: citations.status === 'fulfilled' && citations.value.success ? citations.value.data.length : 0
          }
        }
      };
      
      console.log('GoogleSearchService.searchAll result:', result);
      return result;
    } catch (error) {
      console.error('Combined search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const googleSearchService = new GoogleSearchService();
export { GoogleSearchService };
export default googleSearchService;
