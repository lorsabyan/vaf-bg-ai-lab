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

  async searchImages(query, language = 'hy', maxResults = 3) {
    console.log('searchImages called:', { query, language, maxResults });
    if (!this.apiKey || !this.searchEngineId) {
      const missingItems = [];
      if (!this.apiKey) missingItems.push('API Key');
      if (!this.searchEngineId) missingItems.push('Search Engine ID');
      console.error('Google Search API not configured. Missing:', missingItems.join(', '));
      throw new Error(`Google Search API not configured. Missing: ${missingItems.join(', ')}`);
    }

    try {
      const searchQuery = encodeURIComponent(`${query} ${language === 'hy' ? 'հայերեն' : ''}`);
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${searchQuery}&searchType=image&num=${maxResults}&safe=active&lr=lang_${language}`;
      
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
          thumbnailLink: item.image?.thumbnailLink,
          contextLink: item.image?.contextLink,
          displayLink: item.displayLink
        })) || []
      };
    } catch (error) {
      console.error('Google Images search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async searchWeb(query, language = 'hy', maxResults = 3) {
    if (!this.apiKey || !this.searchEngineId) {
      const missingItems = [];
      if (!this.apiKey) missingItems.push('API Key');
      if (!this.searchEngineId) missingItems.push('Search Engine ID');
      throw new Error(`Google Search API not configured. Missing: ${missingItems.join(', ')}`);
    }

    try {
      const searchQuery = encodeURIComponent(`${query} ${language === 'hy' ? 'հայերեն' : ''} site:*.edu OR site:*.org OR site:*.gov OR site:wikipedia.org`);
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
      // Focus on academic and reliable sources
      const academicQuery = encodeURIComponent(`"${query}" ${language === 'hy' ? 'հայերեն' : ''} site:*.edu OR site:scholar.google.com OR site:jstor.org OR site:*.ac.* OR site:researchgate.net`);
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

  async searchAll(query, language = 'hy') {
    console.log('GoogleSearchService.searchAll called with:', { query, language });
    try {
      const [images, webLinks, citations] = await Promise.allSettled([
        this.searchImages(query, language, 2),
        this.searchWeb(query, language, 3),
        this.searchCitations(query, language, 2)
      ]);

      const result = {
        success: true,
        data: {
          images: images.status === 'fulfilled' && images.value.success ? images.value.data : [],
          webLinks: webLinks.status === 'fulfilled' && webLinks.value.success ? webLinks.value.data : [],
          citations: citations.status === 'fulfilled' && citations.value.success ? citations.value.data : []
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
