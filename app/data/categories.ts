export interface CategoryNode {
    id: string;
    name: string;
    children?: CategoryNode[];
}

export const categories: CategoryNode[] = [];

export interface PostNode {
    title?: string;
    sourceUrl: string;
    content: string;
    categoryPath?: string[];
    votes: number;
    image: {
        before: string;
        after: string;
    }
}