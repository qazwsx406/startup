const WebSocket = require('ws');

async function testConnection(url, name) {
    console.log(`Testing connection to ${name} (${url})...`);
    return new Promise((resolve) => {
        const ws = new WebSocket(url);

        ws.on('open', () => {
            console.log(`[SUCCESS] Connected to ${name}`);
            ws.close();
            resolve(true);
        });

        ws.on('error', (err) => {
            console.log(`[FAILURE] Could not connect to ${name}:`, err.message);
            resolve(false);
        });
    });
}

(async () => {
    // Test direct backend connection
    await testConnection('ws://localhost:3000', 'Direct Backend');

    // Test via Vite Proxy (Note: This might fail if Vite isn't proxying correctly or if headers are missing)
    // We can't easily test the proxy with 'ws' library if it depends on browser-specific behavior, 
    // but it should work for a standard websocket handshake.
    await testConnection('ws://localhost:5173/ws', 'Vite Proxy');
})();
