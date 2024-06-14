import { Container, DisplayObject } from "pixi.js";

export function treeNodes(tree: DisplayObject): number {
    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + treeNodes(child);
        }, 1);
    }

    return 1;
}

export function renderables(tree: DisplayObject): number {
    if (!tree.visible) {
        return 0;
    }

    if ((tree as any).cacheAsBitmap) {
        return 1;
    }

    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + renderables(child);
        }, 1);
    }

    return 1;
}
