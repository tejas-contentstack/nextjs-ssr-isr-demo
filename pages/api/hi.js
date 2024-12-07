export default async function handler(req, res) {
    if(process.env.BREAK == 'true'){ 
    throw new Error('throwing an error');
  }
  // Check the HTTP method
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from Next.js API!' });
  } else if (req.method === 'POST') {
    // Parse the request body
    const { name } = req.body;

    // Respond with a message
    if (name) {
      res.status(200).json({ message: `Hello, ${name}!` });
    } else {
      res.status(400).json({ error: 'Name is required' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
