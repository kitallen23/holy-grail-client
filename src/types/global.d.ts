declare global {
    interface UmamiTrackingProperties {
        hostname?: string;
        language?: string;
        referrer?: string;
        screen?: string;
        title?: string;
        url?: string;
        website?: string;
        [key: string]: any;
    }
    interface Window {
        umami: {
            track: {
                (): void;
                (payload: object): void;
                (event_name: string): void;
                (event_name: string, data?: object): void;
                (fn: (props: UmamiTrackingProperties) => UmamiTrackingProperties): void;
            };
        };
    }
}

export {};
