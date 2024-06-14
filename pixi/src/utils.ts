import { Container, DisplayObject } from "pixi.js";

export function treeSize(tree: DisplayObject): number {
    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + treeSize(child);
        }, 1);
    } else {
        return 1;
    }
}

export function renderSize(tree: DisplayObject): number {
    if (!tree.visible) {
        return 0;
    }

    if ((tree as any).cacheAsBitmap) {
        return 1;
    }

    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + renderSize(child);
        }, 1);
    } else {
        return 1;
    }
}
