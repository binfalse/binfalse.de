---
title: "Automagically add Accessibility Modifiers to Typescript Projects"
layout: post
published: true
date: 2025-05-16 11:10:28 +0200
categories:
  - uncategorized
tags:
  - untagged
lang: en
ref: automagically-add-accessibility-modifiers-to-typescript-projects
---

{% include image.html align='alignright' url='/assets/media/pics/2025/eslint-explicit-accessibility.png' img='/assets/media/pics/2025/eslint-explicit-accessibility.png' title='AI generated title image...' caption='AI generated title image...' maxwidth='250px' %}

Today, I want to share a powerful tool that can help you introducing the eslint rule `@typescript-eslint/explicit-member-accessibility` into your projects.
This rule ensures that all class members (methods, properties, accessors) have explicit accessibility modifiers (`public`, `private`, or `protected`).
If you have a large codebase, manually adding these modifiers will be quite a daunting task.
But fear not, for this script is there to help! :D

## The Challenge

Enabling [eslint's](https://eslint.org/) [`@typescript-eslint/explicit-member-accessibility` rule](@typescript-eslint/explicit-member-accessibility) in a large codebase very likely unleashes a lot of linter errors.
Manually fixing these errors will drain your time and energy.

The script I’m sharing today automates this process.
The core of it goes through all matching scripts in your project. It uses [ts-morph](https://ts-morph.com/) to traverse the AST of a script and adds an explicit accessibility modifier (can be specified with <abbr title="command line interface">cli</abbr> arguments) if they do not already have one:

```ts
sourceFiles.forEach((sourceFile) => {
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
        ["public", "protected", "private"].includes(modifier.getText())
      );

      if (!hasAccessibilityModifier) {
        declaration.toggleModifier(accessibilityModifier);
      }
    }
  });
});
```

You will find the complete script at [add-accessibility-modifier.ts](/assets/resources/stuff/add-accessibility-modifier.ts) or check the corresponding [Gist](https://gist.github.com/binfalse/b9d71f39fa4cffb269270e4d41a22791).

## Howtouse

First ensure you have `ts-morph` and `ts-node` installed in your project.

```
npm install ts-morph ts-node
```

Then you can invoke the script using [npx](https://docs.npmjs.com/cli/v8/commands/npx), specifying desired options:

```
npx ts-node add-public-modifier.js -s "src/**/*.ts" -t "tsconfig.json" -a "private"
```

Options are:

- `-s`, `--sources` `GLOB`: Specify the source files glob pattern (default: `src/**/*.ts`).
- `-t`, `--tsconfig` `PATH` Specify the path to the `tsconfig.json` file of your project (default: `tsconfig.json`).
- `-a`, `--accessibility` `MODIFIER`: Specify the accessibility modifier to add (`public`, `private`, `protected`) (defaults to `public`).

I hope you find this script as powerful and helpful as I do.
Happy hacking, and may the clean code be with you!
