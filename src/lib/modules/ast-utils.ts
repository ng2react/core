import type {Node} from 'typescript';

export function getSourceDir(node: Node): string {
    return node.getSourceFile().fileName.split('/').slice(0, -1).join('/')
}