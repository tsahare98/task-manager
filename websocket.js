class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
    this.reconnectTimer = null;
    this.isAuthenticated = false;
  }
  connect(token) {
    if (this.socket) {
      this.disconnect();
    }
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    this.socket = new WebSocket(wsUrl);
    this.socket.onopen = () => {
      console.log('WebSocket connection opened. Sending AUTH packet...');
      this.send({
        type: 'AUTH',
        payload: { token }
      });
    };
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event.reason);
      this.isAuthenticated = false;
      
      // Auto-reconnect after 3 seconds if a token still exists
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        this.reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          this.connect(currentToken);
        }, 3000);
      }
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isAuthenticated = false;
  }
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
  handleMessage(message) {
    if (message.type === 'AUTH_SUCCESS') {
      this.isAuthenticated = true;
      console.log('WebSocket authenticated successfully');
      return;
    }
    if (message.type === 'AUTH_ERROR') {
      console.error('WebSocket auth error:', message.payload?.error);
      this.disconnect();
      return;
    }
    // Pass custom events (e.g. TASK_CREATED, TASK_UPDATED, TASK_DELETED) to context listeners
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('Listener callback failed:', err);
      }
    });
  }
  // Register listener for server updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
export const wsService = new WebSocketService();
export default wsService;
