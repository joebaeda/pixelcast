// Define a specific type for Ethereum provider
interface EthereumProvider {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTrustWallet?: boolean;
    isBraveWallet?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (event: string, handler: (...args: any[]) => void) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
}

// Extend the global Window interface to include the Ethereum provider
declare global {
    interface Window {
        ethereum: EthereumProvider; // Use EthereumProvider type instead of 'any'
    }
}

// This is necessary to make the file a module and allow declaration merging
export {};
