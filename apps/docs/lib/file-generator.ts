import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Code, Paragraph } from 'mdast';
import { z } from 'zod';
import { DocGenerator } from 'fumadocs-docgen';

// This project uses code from fumadocs.
// The code is licensed under the MIT License.
// https://github.com/fuma-nama/fumadocs

const fileGeneratorSchema = z.object({
  file: z.string(),

  /**
   * Turn file content into a code block
   *
   * @defaultValue false
   */
  codeblock: z
    .union([
      z.object({
        lang: z.string().optional(),
        meta: z.string().optional(),
      }),
      z.boolean(),
    ])
    .default(false),
});

export function fileGenerator(): DocGenerator {
  return {
    name: 'file',
    async run(input, ctx) {
      const { file, codeblock = false } = fileGeneratorSchema.parse(input);

      const dest = path.resolve(ctx.cwd, file);
      const value = fixImports(await fs.readFile(dest).then((res) => res.toString()));

      if (codeblock === false) {
        return {
          type: 'paragraph',
          children: [{ type: 'text', value }],
        } as Paragraph;
      }

      const codeOptions = codeblock === true ? {} : codeblock;

      return {
        type: 'code',
        lang: codeOptions.lang ?? path.extname(dest).slice(1),
        meta: codeOptions.meta,
        value,
      } as Code;
    },
  };
}

function fixImports(value: string) {
  return value
    .replaceAll('@/registry/nativewind/', '@/')
    .replaceAll('@/registry/uniwind/', '@/')
    .replaceAll('@/registry/blocks/', '@/components/');
}
