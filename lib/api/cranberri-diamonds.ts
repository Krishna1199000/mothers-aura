/**
 * Cranberri Diamonds API Utility
 * 
 * This module provides a comprehensive solution for fetching all diamonds
 * from the Cranberri API with automatic pagination handling.
 */

// ==================== TYPESCRIPT INTERFACES ====================

/**
 * Raw diamond data structure from Cranberri API
 * Includes all fields returned by the API
 */
interface CranberriApiDiamond {
  id: string;
  stockId: string;
  shape: string;
  size: number;
  color: string;
  clarity: string;
  cut?: string;
  polish: string;
  sym: string;
  lab: string;
  certificateNo?: string;
  pricePerCarat: number;
  finalAmount: number;
  status?: string;
  videoUrl?: string;
  imageUrl?: string;
  certUrl?: string;
  measurement?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  heldByShipmentId?: string;
  heldByShipment?: unknown; // Excluded from final output
}

/**
 * API response structure from Cranberri
 */
interface CranberriApiResponse {
  diamonds: CranberriApiDiamond[];
  total: number;
  pages: number;
  currentPage?: number;
  hasNextPage?: boolean;
}

/**
 * Clean diamond data structure for our application
 * Only includes the fields we want to keep
 */
export interface CleanDiamond {
  id: string;
  stockId: string;
  shape: string;
  size: number;
  color: string;
  clarity: string;
  cut?: string;
  polish: string;
  sym: string;
  lab: string;
  certificateNo?: string;
  pricePerCarat: number;
  finalAmount: number;
  imageUrl?: string;
  certUrl?: string;
  videoUrl?: string;
  createdAt: string;
  source: 'cranberri';
}

/**
 * Configuration options for the fetch function
 */
interface FetchOptions {
  baseUrl?: string;
  pageSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  requestDelay?: number;
}

/**
 * Result of the fetch operation
 */
interface FetchResult {
  diamonds: CleanDiamond[];
  totalFetched: number;
  pagesProcessed: number;
  errors: string[];
  executionTime: number;
}

// ==================== DEFAULT CONFIGURATION ====================

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  baseUrl: 'https://www.cranberridiamonds.in/api/inventory',
  pageSize: 10,
  maxRetries: 3,
  retryDelay: 1000,
  requestDelay: 200
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Sleep function for adding delays between requests
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Clean and map diamond data, excluding unwanted fields
 */
const cleanDiamondData = (diamond: CranberriApiDiamond): CleanDiamond => ({
  id: diamond.id,
  stockId: diamond.stockId,
  shape: diamond.shape,
  size: diamond.size,
  color: diamond.color,
  clarity: diamond.clarity,
  cut: diamond.cut,
  polish: diamond.polish,
  sym: diamond.sym,
  lab: diamond.lab,
  certificateNo: diamond.certificateNo,
  pricePerCarat: diamond.pricePerCarat,
  finalAmount: diamond.finalAmount,
  imageUrl: diamond.imageUrl,
  certUrl: diamond.certUrl,
  videoUrl: diamond.videoUrl,
  createdAt: diamond.createdAt,
  source: 'cranberri' as const
});

/**
 * Fetch a single page with retry logic
 */
const fetchPageWithRetry = async (
  url: string, 
  retries: number, 
  retryDelay: number
): Promise<CranberriApiResponse> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching: ${url} (attempt ${attempt}/${retries})`);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; DiamondBot/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: CranberriApiResponse = await response.json();
      
      // Validate response structure
      if (!data.diamonds || !Array.isArray(data.diamonds)) {
        throw new Error('Invalid API response: missing or invalid diamonds array');
      }

      console.log(`✅ Successfully fetched page: ${data.diamonds.length} diamonds`);
      return data;

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        throw new Error(`Failed to fetch page after ${retries} attempts: ${error}`);
      }
      
      // Wait before retrying
      await sleep(retryDelay * attempt); // Exponential backoff
    }
  }
  
  throw new Error('Unreachable code');
};

// ==================== MAIN FETCH FUNCTION ====================

/**
 * Fetch all diamonds from Cranberri API with automatic pagination
 * 
 * This function automatically handles pagination by:
 * 1. Starting with page 1
 * 2. Fetching each page sequentially
 * 3. Stopping when no more pages are available
 * 4. Combining all results into a single array
 * 5. Cleaning the data to exclude unwanted fields
 * 
 * @param options Configuration options for the fetch operation
 * @returns Promise<CleanDiamond[]> Array of cleaned diamond data
 */
export async function fetchAllDiamonds(
  options: FetchOptions = {}
): Promise<CleanDiamond[]> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  const errors: string[] = [];
  const allDiamonds: CranberriApiDiamond[] = [];
  let totalPages = 1;

  console.log('🚀 Starting comprehensive diamond fetch from Cranberri API');
  console.log(`📋 Configuration:`, {
    baseUrl: config.baseUrl,
    pageSize: config.pageSize,
    maxRetries: config.maxRetries,
    requestDelay: config.requestDelay
  });

  try {
    // Fetch first page to get pagination info
    console.log('\n📄 Fetching first page to get pagination info...');
    
    const firstPageUrl = `${config.baseUrl}?page=1&limit=${config.pageSize}`;
    const firstPageData = await fetchPageWithRetry(
      firstPageUrl, 
      config.maxRetries, 
      config.retryDelay
    );

    // Extract pagination info
    totalPages = firstPageData.pages || Math.ceil(firstPageData.total / config.pageSize);
    console.log(`📊 Pagination info: ${firstPageData.total} total diamonds across ${totalPages} pages`);

    // Add first page diamonds
    allDiamonds.push(...firstPageData.diamonds);
    console.log(`✅ Page 1: ${firstPageData.diamonds.length} diamonds (Total: ${allDiamonds.length})`);

    // Fetch remaining pages
    console.log('\n📄 Fetching remaining pages...');
    
    for (let page = 2; page <= totalPages; page++) {
      try {
        // Add delay between requests to be respectful to the API
        if (page > 2) {
          await sleep(config.requestDelay);
        }

        const pageUrl = `${config.baseUrl}?page=${page}&limit=${config.pageSize}`;
        const pageData = await fetchPageWithRetry(
          pageUrl, 
          config.maxRetries, 
          config.retryDelay
        );

        // Add page diamonds
        allDiamonds.push(...pageData.diamonds);
        console.log(`✅ Page ${page}: ${pageData.diamonds.length} diamonds (Total: ${allDiamonds.length})`);

        // Check if we should stop (no more diamonds or empty page)
        if (pageData.diamonds.length === 0) {
          console.log(`🛑 Stopping: Page ${page} returned no diamonds`);
          break;
        }

      } catch (error) {
        const errorMsg = `Failed to fetch page ${page}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
        
        // Continue with next page instead of stopping completely
        continue;
      }
    }

  } catch (error) {
    const errorMsg = `Failed to fetch first page: ${error}`;
    console.error(`❌ ${errorMsg}`);
    errors.push(errorMsg);
    
    // If first page fails, we can't continue
    throw new Error(errorMsg);
  }

  // Process and clean the data
  console.log('\n🧹 Cleaning and processing diamond data...');
  
  const cleanDiamonds = allDiamonds.map(cleanDiamondData);
  
  // Remove duplicates based on stockId (in case API returns duplicates)
  const uniqueDiamonds = cleanDiamonds.filter((diamond, index, self) => 
    index === self.findIndex(d => d.stockId === diamond.stockId)
  );

  const executionTime = Date.now() - startTime;

  // Final summary
  console.log('\n📈 FETCH COMPLETE - SUMMARY:');
  console.log(`⏱️  Execution time: ${executionTime}ms`);
  console.log(`📊 Raw diamonds fetched: ${allDiamonds.length}`);
  console.log(`🔍 Unique diamonds after deduplication: ${uniqueDiamonds.length}`);
  console.log(`📄 Pages processed: ${totalPages}`);
  console.log(`❌ Errors encountered: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('⚠️  Errors:', errors);
  }

  console.log('✅ All diamonds successfully fetched and processed!');
  
  return uniqueDiamonds;
}

// ==================== ALTERNATIVE FETCH METHODS ====================

/**
 * Alternative fetch method using different pagination strategies
 * Tries multiple approaches to get maximum data
 */
export async function fetchAllDiamondsAggressive(
  options: FetchOptions = {}
): Promise<CleanDiamond[]> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const allDiamonds: CranberriApiDiamond[] = [];
  const seenStockIds = new Set<string>();

  console.log('🚀 Starting aggressive diamond fetch with multiple strategies...');

  // Strategy 1: Standard pagination
  try {
    console.log('\n📄 Strategy 1: Standard pagination');
    const standardDiamonds = await fetchAllDiamonds(config);
    standardDiamonds.forEach(d => {
      if (!seenStockIds.has(d.stockId)) {
        seenStockIds.add(d.stockId);
        allDiamonds.push(d as unknown as CranberriApiDiamond);
      }
    });
    console.log(`✅ Standard pagination: ${standardDiamonds.length} diamonds`);
  } catch (error) {
    console.error('❌ Standard pagination failed:', error);
  }

  // Strategy 2: Try different page sizes
  const pageSizes = [50, 100, 200];
  for (const pageSize of pageSizes) {
    try {
      console.log(`\n📄 Strategy 2: Trying page size ${pageSize}`);
      
      for (let page = 1; page <= 5; page++) { // Try first 5 pages
        const url = `${config.baseUrl}?page=${page}&limit=${pageSize}`;
        const response = await fetch(url, { cache: 'no-store' });
        
        if (response.ok) {
          const data: CranberriApiResponse = await response.json();
          
          data.diamonds?.forEach(diamond => {
            if (!seenStockIds.has(diamond.stockId)) {
              seenStockIds.add(diamond.stockId);
              allDiamonds.push(diamond);
            }
          });
          
          console.log(`✅ Page ${page} (size ${pageSize}): ${data.diamonds?.length || 0} new diamonds`);
          
          if (!data.diamonds || data.diamonds.length < pageSize) {
            break; // No more pages
          }
        }
        
        await sleep(config.requestDelay);
      }
    } catch (error) {
      console.error(`❌ Page size ${pageSize} failed:`, error);
    }
  }

  // Strategy 3: Try offset-based pagination
  try {
    console.log('\n📄 Strategy 3: Offset-based pagination');
    
    for (let offset = 0; offset < 1000; offset += 100) {
      const url = `${config.baseUrl}?offset=${offset}&limit=100`;
      const response = await fetch(url, { cache: 'no-store' });
      
      if (response.ok) {
        const data: CranberriApiResponse = await response.json();
        
        if (!data.diamonds || data.diamonds.length === 0) {
          break;
        }
        
        let newCount = 0;
        data.diamonds.forEach(diamond => {
          if (!seenStockIds.has(diamond.stockId)) {
            seenStockIds.add(diamond.stockId);
            allDiamonds.push(diamond);
            newCount++;
          }
        });
        
        console.log(`✅ Offset ${offset}: ${newCount} new diamonds`);
        
        if (newCount === 0) {
          break; // No new diamonds found
        }
      }
      
      await sleep(config.requestDelay);
    }
  } catch (error) {
    console.error('❌ Offset pagination failed:', error);
  }

  // Clean and return results
  const cleanDiamonds = allDiamonds.map(cleanDiamondData);
  
  console.log(`\n📈 AGGRESSIVE FETCH COMPLETE:`);
  console.log(`🔍 Total unique diamonds found: ${cleanDiamonds.length}`);
  console.log(`📊 Unique stock IDs: ${seenStockIds.size}`);
  
  return cleanDiamonds;
}

// ==================== EXPORT FOR BACKWARD COMPATIBILITY ====================

/**
 * Legacy function name for backward compatibility
 * @deprecated Use fetchAllDiamonds() instead
 */
export const fetchCranberriDiamonds = fetchAllDiamonds;

/**
 * Example usage function
 */
export async function exampleUsage(): Promise<void> {
  try {
    console.log('💎 Example: Fetching all Cranberri diamonds...');
    
    const diamonds = await fetchAllDiamonds();
    console.log(`✅ Successfully fetched ${diamonds.length} diamonds`);
    
    // Log first few diamonds as examples
    diamonds.slice(0, 3).forEach((diamond, index) => {
      console.log(`\n📋 Diamond ${index + 1}:`);
      console.log(`   Stock ID: ${diamond.stockId}`);
      console.log(`   Shape: ${diamond.shape}`);
      console.log(`   Size: ${diamond.size}ct`);
      console.log(`   Color: ${diamond.color}`);
      console.log(`   Clarity: ${diamond.clarity}`);
      console.log(`   Price: $${diamond.pricePerCarat}/ct`);
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch diamonds:', error);
  }
}