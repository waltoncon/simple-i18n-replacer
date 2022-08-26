export interface Translation {
    id: string;
    section: string;
    [key: string]: string;
}

export type Renderer = (value: string) => string;
