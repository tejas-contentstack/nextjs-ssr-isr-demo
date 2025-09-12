// Global state to track total concurrent requests
const activeRequests = new Set();
const MAX_CONCURRENT_REQUESTS = 2;

export default async function handler(request, context) {
  // Check if we've exceeded the concurrent request limit
  if (activeRequests.size >= MAX_CONCURRENT_REQUESTS) {
    console.log(`Rate limit exceeded. Active requests: ${activeRequests.size}`);
    return new Response(JSON.stringify({
      error: 'Too many concurrent requests',
      message: `Maximum concurrent request limit of ${MAX_CONCURRENT_REQUESTS} reached`,
      activeRequests: activeRequests.size,
      maxAllowed: MAX_CONCURRENT_REQUESTS
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '1',
        'X-RateLimit-Limit': MAX_CONCURRENT_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0'
      }
    });
  }
  
  // Create a unique request ID for tracking
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add this request to active tracking
  activeRequests.add(requestId);
  
  console.log(`Processing request ${requestId}. Active requests: ${activeRequests.size}`);
  
  try {
    // Process the request - forward to origin or handle custom logic
    const response = await processRequest(request, context);
    
    return response;
  } catch (error) {
    console.error(`Error processing request ${requestId}:`, error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request',
      requestId: requestId
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    // Always clean up the request from active tracking
    activeRequests.delete(requestId);
    

    console.log(`Completed request ${requestId}. Remaining active requests: ${activeRequests.size}`);
  }
}

async function processRequest(request, context) {
  // Add custom logic here based on your needs
  
  // Example: Handle specific paths differently
  const url = new URL(request.url);
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Example: Add custom headers to all requests
  const modifiedRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      'X-Edge-Processed': 'true',
      'X-Processing-Time': new Date().toISOString()
    }
  });
  
  // Forward the request to the origin server
  const response = await fetch(modifiedRequest);
  
  // Optionally modify the response
  const modifiedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'X-Edge-Response': 'true',
      'X-Concurrent-Limit': MAX_CONCURRENT_REQUESTS.toString()
    }
  });
  
  return modifiedResponse;
}
