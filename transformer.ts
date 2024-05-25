import * as ts from 'typescript';

const PRE = '\n\n\n// *** typescript *** //\n\n';

function addSourceCodeAsComment(context: ts.TransformationContext) {
    return (sourceFile: ts.SourceFile) => {
        const sourceText = sourceFile.text;
        const commentText =
            PRE +
            sourceText
                .split('\n')
                .map((line) => `// ${line}`)
                .join('\n');
        const comment = ts.addSyntheticTrailingComment(
            sourceFile.statements[sourceFile.statements.length - 1],
            ts.SyntaxKind.SingleLineCommentTrivia,
            `\n${commentText}\n`,
            true
        );
        const visitor: ts.Visitor = (node) => {
            return ts.visitEachChild(node, visitor, context);
        };
        return ts.visitNode(sourceFile, visitor);
    };
}

export default function transformer(program: ts.Program) {
    return (context: ts.TransformationContext) => {
        return addSourceCodeAsComment(context);
    };
}
