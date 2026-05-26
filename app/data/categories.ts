export interface CategoryNode {
    id: string;
    name: string;
    children?: CategoryNode[];
}

export const categories: CategoryNode[] = [];

export interface PostNode {
    title?: string;
    sourceUrl: string;
    sourceId: string;
    content: string;
    categoryPath?: string[];
    votes: number;
    images: {
        thumbnail: string;
        before: string;
        after: string;
    },
    maxSeconds?: number;
}