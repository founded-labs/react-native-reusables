# React Native Reusables CLI

A command-line toolkit to streamline the integration, setup, and maintenance of reusable React Native components in your projects.

## Features

- **Add**: Quickly add reusable React Native components to your project, with style and path options.
- **Doctor**: Diagnose your project for missing files, misconfigurations, and required dependencies. Optionally auto-install missing dependencies.
- **Init**: Bootstrap a new React Native project pre-configured for reusables, or inspect/repair an existing setup.

## Getting Started

### Installation

You can run the CLI directly with your favorite package manager:

```sh
npx @react-native-reusables/cli@latest <command>
pnpm dlx @react-native-reusables/cli@latest <command>
yarn dlx @react-native-reusables/cli@latest <command>
bunx --bun @react-native-reusables/cli@latest <command>
```

## Commands

---

### `@react-native-reusables/cli@latest add [options] [components...]`

Add one or more React Native components to your project.

| Argument   | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| components | Name of component(s) to add. (e.g. `button`, `input`, `card`, `avatar`, etc.) |

| Option              | Description                          | Default         |
| ------------------- | ------------------------------------ | --------------- |
| `-y, --yes`         | Skip confirmation prompts.           | false           |
| `-o, --overwrite`   | Overwrite existing files.            | false           |
| `-c, --cwd <cwd>`   | The working directory.               | . (current dir) |
| `-a, --all`         | Add all available components.        | false           |
| `-p, --path <path>` | The path to add the component(s) to. |                 |
| `--styling-library <styling-library>` | Override detected styling library (`nativewind` or `uniwind`). | auto-detect |
| `-h, --help`        | Display help for command.            |                 |

---

### `rnr doctor [options]`

Check your project setup and diagnose issues.

| Option            | Description                                            | Default         |
| ----------------- | ------------------------------------------------------ | --------------- |
| `-y, --yes`       | Skip confirmation prompts for installing dependencies. | false           |
| `-c, --cwd <cwd>` | The working directory.                                 | . (current dir) |
| `--summary`       | Output a summary only.                                 | false           |
| `-h, --help`      | Display help for command.                              |                 |

---

### `rnr init [options]`

Initialize a new React Native project with reusables.

| Option            | Description               | Default         |
| ----------------- | ------------------------- | --------------- |
| `-c, --cwd <cwd>` | The working directory.    | . (current dir) |
| `-h, --help`      | Display help for command. |                 |

---

## Development

### Scripts

- `pnpm build` – Build the CLI for production.
- `pnpm dev` – Run the CLI in development mode.

> **Note:** If you are developing locally and want to use the `add` command in development mode, you must have the `apps/docs` app running. Start it from the root with:
>
> ```sh
> pnpm dev:docs
> ```
>
> This serves the component registry required for local development.

### Structure

- `src/cli.ts` – Main CLI entrypoint and command definitions.
- `src/bin.ts` – Node boot-strapper.
- `src/services/commands/` – Command implementations (`add`, `doctor`, `init`).
- `src/contexts/` – CLI option/context definitions.
- `src/utils/` – Utility functions.

## Contributing

See the [main repo README](../../README.md) for guidelines.
