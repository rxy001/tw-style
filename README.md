# tw-style

A lightweight utility library built on the **Tailwind CSS v4** compiler, used to generate corresponding CSS for classes on demand, with support for incremental builds.

## Features

- ✅ Based on the official `tailwindcss` compiler (v4)
- ✅ Incremental compilation: no redundant rebuilding of classes

> `tw-style` uses `tailwindcss` as a peer dependency. Please install a compatible version in your project.

> ⚠️ **Runtime compatibility:** Vite only.

## Installation

```bash
pnpm add @x1ngyu/tw-style tailwindcss
```

## Quick Start

```ts
import { compiler } from "@x1ngyu/tw-style";

const build = await compiler({
  useLayer: false,
  usePreflight: false,
});

const css1 = await build(["text-red-500", "font-bold"]);
console.log(css1);

const css2 = await build(["text-red-500", "underline"]);
console.log(css2);
```

## API

### `compiler(options?)`

Creates a build function.

```ts
type CompilerOptions = {
  useLayer?: boolean;
  usePreflight?: boolean;
};

declare function compiler(
  options?: CompilerOptions,
): Promise<(classes: string[]) => Promise<string | undefined>>;
```

#### `options`

- `useLayer?: boolean`
  - Whether to wrap themes and utilities inside `@layer`.
  - Default: `false`
- `usePreflight?: boolean`
  - Whether to include Tailwind Preflight (base style reset).
  - Default: `false`

### `build(classes)`

The function returned by `compiler()`, used to generate CSS on demand.

```ts
declare function build(classes: string[]): Promise<string | undefined>;
```

- `classes: string[]`
  - List of Tailwind classes to build.

## License

MIT
