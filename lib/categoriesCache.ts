import { CategoryNode } from "@/app/api/categories/route";

let cache: CategoryNode[] | null = null;

export const categoriesCache = {
    get: () => cache,
    set: (data: CategoryNode[]) => { cache = data; },
    clear: () => { cache = null; },
};