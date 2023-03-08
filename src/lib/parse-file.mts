import { Node, ScriptTarget, createSourceFile, isVariableDeclaration } from 'typescript';

export default function parseFile(fileContent: string) {

    const sourceFile = createSourceFile('test.ts', fileContent, ScriptTarget.Latest);

    function visitNode(node: Node) {
        if (isVariableDeclaration(node)) {
            console.log(node.getText());
        }
        // forEachChild(node, visitNode);
    }

    visitNode(sourceFile);

    console.log(sourceFile)

}

