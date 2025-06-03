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

class SSHTunnel {
  private tunnel: any = null;
  private config: SSHTunnelConfig;
  private localPort: number = 0;
  private isConnecting: boolean = false;

  constructor(config: SSHTunnelConfig) {
    this.config = config;
  }

  async connect(): Promise<number> {
    if (this.tunnel) {
      console.log('SSH tunnel already established on port', this.localPort);
      return this.localPort;
    }

    if (this.isConnecting) {
      console.log('SSH tunnel connection already in progress, waiting...');
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.localPort;
    }

    try {
      this.isConnecting = true;
      console.log('Establishing SSH tunnel...');
      
      // Read private key from file or use the key directly
      let privateKey: Buffer;
      try {
        // Try to read as file path first
        privateKey = readFileSync(this.config.privateKey);
      } catch (error) {
        // If reading as file fails, treat it as the key content itself
        privateKey = Buffer.from(this.config.privateKey, 'utf8');
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
      
      // Handle tunnel events
      server.on('error', (err: Error) => {
        console.error('SSH tunnel server error:', err);
      });

      conn.on('error', (err: Error) => {
        console.error('SSH tunnel connection error:', err);
      });

      conn.on('end', () => {
        console.log('SSH tunnel connection ended');
        this.tunnel = null;
      });

      return this.localPort;
    } catch (error) {
      console.error('Failed to establish SSH tunnel:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect(): Promise<void> {
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
      
      this.tunnel = null;
      this.localPort = 0;
      
      console.log('SSH tunnel closed successfully');
    } catch (error) {
      console.error('Error closing SSH tunnel:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.tunnel !== null;
  }

  getLocalPort(): number {
    return this.localPort;
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
