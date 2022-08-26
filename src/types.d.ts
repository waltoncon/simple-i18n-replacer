export interface Translation {
    '!id': string;
    [key: string]: string;
}

export type Renderer = (value: string) => string;
