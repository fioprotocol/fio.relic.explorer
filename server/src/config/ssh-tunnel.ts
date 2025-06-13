import { createTunnel } from 'tunnel-ssh';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

interface SSHTunnelConfig {
  host: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
  dstHost: string;
  dstPort: number;
  localHost?: string;
  localPort?: number;
}

/**
 * Utility function to detect and decode base64 encoded SSH keys
 * @param keyString - The SSH key string that might be base64 encoded
 * @returns The decoded SSH key string
 */
const decodeSSHKey = (keyString: string): string => {
  // If it's already a regular SSH key or file path, return as-is
  if (keyString.includes('-----BEGIN') || 
      keyString.includes('ssh-rsa') || 
      keyString.includes('ssh-ed25519') ||
      keyString.includes('/') ||  // likely a file path
      keyString.includes('\\')) { // Windows file path
    return keyString;
  }
  
  // Clean the string (remove whitespace and newlines)
  const cleanedKey = keyString.replace(/\s+/g, '');
  
  // Check if it looks like base64 (length divisible by 4, valid base64 characters)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  
  if (cleanedKey.length > 0 && cleanedKey.length % 4 === 0 && base64Regex.test(cleanedKey)) {
    try {
      const decoded = Buffer.from(cleanedKey, 'base64').toString('utf8');
      
      // Verify the decoded content looks like an SSH key
      if (decoded.includes('-----BEGIN') || 
          decoded.includes('ssh-rsa') || 
          decoded.includes('ssh-ed25519')) {
        console.log('Successfully decoded base64 SSH key');
        return decoded;
      } else {
        console.log('Decoded base64 but content doesn\'t look like SSH key, using original');
        return keyString;
      }
    } catch (error) {
      console.warn('Failed to decode as base64, using key as-is:', error);
      return keyString;
    }
  }
  
  // If it doesn't look like base64, return as-is
  return keyString;
};

class SSHTunnel {
  private tunnel: any = null;
  private config: SSHTunnelConfig;
  private localPort: number = 0;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = Infinity; // unlimited reconnection attempts
  private reconnectDelay: number = 2000; // Start with 2 seconds
  private maxReconnectDelay: number = 30000; // Max 30 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isDestroyed: boolean = false;

  constructor(config: SSHTunnelConfig) {
    this.config = config;
  }

  async connect(): Promise<number> {
    if (this.isDestroyed) {
      throw new Error('SSH tunnel has been destroyed');
    }

    if (this.tunnel) {
      console.log('SSH tunnel already established on port', this.localPort);
      return this.localPort;
    }

    if (this.isConnecting) {
      console.log('SSH tunnel connection already in progress, waiting...');
      while (this.isConnecting && !this.isDestroyed) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.localPort;
    }

    try {
      this.isConnecting = true;
      console.log(`Establishing SSH tunnel... (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      // Decode the private key if it's base64 encoded
      const decodedPrivateKey = decodeSSHKey(this.config.privateKey);
      
      // Read private key from file or use the key directly
      let privateKey: Buffer;
      try {
        // Try to read as file path first
        privateKey = readFileSync(decodedPrivateKey);
      } catch (error) {
        // If reading as file fails, treat it as the key content itself
        privateKey = Buffer.from(decodedPrivateKey, 'utf8');
      }

      // Tunnel options (first argument)
      const tunnelOptions = {
        autoClose: false, // Keep tunnel alive
      };

      // Server options (second argument) - local server configuration
      const serverOptions = {
        host: this.config.localHost || '127.0.0.1',
        port: this.config.localPort || 0, // 0 means auto-assign
      };

      // SSH options (third argument) - SSH connection configuration
      const sshOptions = {
        host: this.config.host,
        port: this.config.port,
        username: this.config.username,
        privateKey: privateKey,
        passphrase: this.config.passphrase,
        keepaliveInterval: 5000,
        keepaliveCountMax: 3,
        readyTimeout: 20000, // Increased timeout
      };

      // Forward options (fourth argument) - forwarding configuration
      const forwardOptions = {
        srcAddr: this.config.localHost || '127.0.0.1',
        srcPort: this.config.localPort || 0, // Will be auto-assigned if 0
        dstAddr: this.config.dstHost,
        dstPort: this.config.dstPort,
      };

      const [server, conn] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
      this.tunnel = { server, conn };
      
      // Get the actual local port that was assigned
      this.localPort = (server.address() as any)?.port || this.config.localPort || 0;
      
      console.log(`SSH tunnel established successfully on local port ${this.localPort}`);
      console.log(`Forwarding localhost:${this.localPort} -> ${this.config.host}:${this.config.port} -> ${this.config.dstHost}:${this.config.dstPort}`);
      
      // Reset reconnection state on successful connection
      this.reconnectAttempts = 0;
      this.reconnectDelay = 2000;
      
      // Clear any pending reconnection timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      
      // Handle tunnel events
      server.on('error', (err: Error) => {
        console.error('SSH tunnel server error:', err);
        this.handleConnectionError(err);
      });

      server.on('close', () => {
        console.log('SSH tunnel server closed');
        this.handleConnectionClose();
      });

      conn.on('error', (err: Error) => {
        console.error('SSH tunnel connection error:', err);
        this.handleConnectionError(err);
      });

      conn.on('end', () => {
        console.log('SSH tunnel connection ended');
        this.handleConnectionClose();
      });

      conn.on('close', () => {
        console.log('SSH tunnel connection closed');
        this.handleConnectionClose();
      });

      return this.localPort;
    } catch (error) {
      console.error('Failed to establish SSH tunnel:', error);
      this.handleConnectionError(error as Error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  private handleConnectionError(error: Error): void {
    if (this.isDestroyed) return;
    
    console.error('SSH tunnel connection error, will attempt to reconnect:', error.message);
    this.cleanup();
    this.scheduleReconnect();
  }

  private handleConnectionClose(): void {
    if (this.isDestroyed) return;
    
    console.log('SSH tunnel connection closed, will attempt to reconnect');
    this.cleanup();
    this.scheduleReconnect();
  }

  private cleanup(): void {
    if (this.tunnel) {
      try {
        if (this.tunnel.server && !this.tunnel.server.destroyed) {
          this.tunnel.server.close();
        }
        if (this.tunnel.conn && !this.tunnel.conn.destroyed) {
          this.tunnel.conn.end();
        }
      } catch (error) {
        console.warn('Error during tunnel cleanup:', error);
      }
      this.tunnel = null;
    }
    this.localPort = 0;
  }

  private scheduleReconnect(): void {
    if (this.isDestroyed || this.isConnecting || this.reconnectTimer) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. SSH tunnel will not reconnect automatically.`);
      return;
    }

    this.reconnectAttempts++;
    
    console.log(`Scheduling SSH tunnel reconnection in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection attempt failed:', error);
        
        // Exponential backoff with jitter
        this.reconnectDelay = Math.min(
          this.maxReconnectDelay,
          this.reconnectDelay * 2 + Math.random() * 1000
        );
        
        // Schedule next attempt
        this.scheduleReconnect();
      }
    }, this.reconnectDelay);
  }

  async disconnect(): Promise<void> {
    this.isDestroyed = true;
    
    // Clear any pending reconnection
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (!this.tunnel) {
      return;
    }

    try {
      console.log('Closing SSH tunnel...');
      
      // Set a timeout for the disconnect operation
      const disconnectPromise = new Promise<void>((resolve) => {
        if (this.tunnel.server) {
          this.tunnel.server.close(() => {
            console.log('SSH tunnel server closed');
            resolve();
          });
        } else {
          resolve();
        }
        
        if (this.tunnel.conn) {
          this.tunnel.conn.end();
        }
      });

      // Wait for disconnect with a 5-second timeout
      await Promise.race([
        disconnectPromise,
        new Promise<void>((resolve) => setTimeout(() => {
          console.log('SSH tunnel disconnect timeout, forcing close');
          resolve();
        }, 5000))
      ]);
      
      this.cleanup();
      
      console.log('SSH tunnel closed successfully');
    } catch (error) {
      console.error('Error closing SSH tunnel:', error);
      this.cleanup(); // Ensure cleanup even if there's an error
      throw error;
    }
  }

  isConnected(): boolean {
    return this.tunnel !== null && !this.isDestroyed;
  }

  getLocalPort(): number {
    return this.localPort;
  }

  // Method to manually trigger reconnection
  async reconnect(): Promise<number> {
    console.log('Manual reconnection requested');
    this.cleanup();
    this.reconnectAttempts = 0;
    this.reconnectDelay = 2000;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    return this.connect();
  }
}

// Create and export SSH tunnel instance if SSH configuration is provided
let sshTunnel: SSHTunnel | null = null;

export const createSSHTunnel = (): SSHTunnel | null => {
  if (!process.env.SSH_HOST || (!process.env.SSH_KEY_URL && !process.env.SSH_TUNNEL_KEY)) {
    console.log('SSH configuration not provided, skipping SSH tunnel setup');
    return null;
  }

  if (!sshTunnel) {
    const privateKey = process.env.SSH_KEY_URL || process.env.SSH_TUNNEL_KEY || '';
    
    if (!privateKey) {
      console.log('SSH private key not provided, skipping SSH tunnel setup');
      return null;
    }

    const config: SSHTunnelConfig = {
      host: process.env.SSH_HOST,
      port: parseInt(process.env.SSH_PORT || '22'),
      username: process.env.SSH_USER || 'root',
      privateKey,
      passphrase: process.env.SSH_KEY_PASSPHRASE,
      dstHost: process.env.DB_HOST_REMOTE || process.env.DB_HOST || 'localhost',
      dstPort: parseInt(process.env.DB_PORT_REMOTE || process.env.DB_PORT || '5432'),
      localHost: '127.0.0.1',
      localPort: parseInt(process.env.SSH_LOCAL_PORT || '0'), // 0 for auto-assign
    };

    sshTunnel = new SSHTunnel(config);
  }

  return sshTunnel;
};

export default sshTunnel; 
