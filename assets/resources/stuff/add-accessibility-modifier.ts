import { Project, SyntaxKind, MethodDeclaration, PropertyDeclaration, ModifierTexts } from 'ts-morph';

const args = process.argv.slice(2);
let tsConfigFilePath = 'tsconfig.json';
let sourceGlob = 'src/**/*.ts';
let accessibilityModifier: ModifierTexts = 'public';
const validModifiers = ['public', 'private', 'protected'];

function printUsage(exitCode: number): void {
    const log = exitCode === 0 ? console.log : console.error;
    log(`Usage: npx ts-node add-accessibility-modifier.js [options]
Options:
  -s, --sources <glob>           Specify the source files glob pattern (default: src/**/*.ts)
  -t, --tsconfig <path>          Specify the path to the tsconfig.json file (default: apps/pace-forms-for-evo/tsconfig.json)
  -a, --accessibility <modifier> Specify the accessibility modifier to add (public, private, protected) (default: public)
  -h, --help                     Show this help message and exit`);
    process.exit(exitCode);
}

args.forEach((arg, index) => {
    if ((arg === '-s' || arg === '--sources') && args[index + 1]) {
        sourceGlob = args[index + 1];
    }

    if ((arg === '-t' || arg === '--tsconfig') && args[index + 1]) {
        tsConfigFilePath = args[index + 1];
    }

    if ((arg === '-a' || arg === '--accessibility') && args[index + 1]) {
        const modifier = args[index + 1];
        if (validModifiers.includes(modifier)) {
            accessibilityModifier = modifier as ModifierTexts;
        } else {
            console.error(`⛔️ Invalid accessibility modifier: ${modifier}`);
            console.error(`Valid modifiers are: ${validModifiers.join(', ')}`);
            console.error();
            printUsage(1);
        }
    }

    if (arg === '-h' || arg === '--help') {
        printUsage(0);
    }
});

// End of boilerplate code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// and start of the actual logic

const project = new Project({ tsConfigFilePath });
const sourceFiles = project.getSourceFiles(sourceGlob);

let found = 0;
let modified = 0;
sourceFiles.forEach((sourceFile) => {
    found++;
    sourceFile.forEachDescendant((node) => {
        if (
            node.getKind() === SyntaxKind.MethodDeclaration ||
            node.getKind() === SyntaxKind.PropertyDeclaration ||
            node.getKind() === SyntaxKind.GetAccessor ||
            node.getKind() === SyntaxKind.SetAccessor
        ) {
            const declaration = node as MethodDeclaration | PropertyDeclaration;

            const modifiers = declaration.getModifiers();
            const hasAccessibilityModifier = modifiers.some((modifier) =>
                ['public', 'protected', 'private'].includes(modifier.getText()),
            );

            if (!hasAccessibilityModifier) {
                declaration.toggleModifier(accessibilityModifier);
                modified++;
            }
        }
    });
});

if (found > 0) {
    console.log('🚀 Modified ' + modified + ' declarations in ' + found + ' files ✅️');
} else {
    console.error('⚠️ No files found... Did you specify the correct path to the tsconfig and glob to source files?');
    console.error();
    printUsage(1);
}

project.saveSync();
