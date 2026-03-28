import { Biome, Distribution } from '@biomejs/js-api';

export async function formatWithBiome(content: string): Promise<string> {
  const biome = await Biome.create({ distribution: Distribution.NODE });
  const project = biome.openProject();

  biome.applyConfiguration(project.projectKey, {
    files: { maxSize: Number.MAX_SAFE_INTEGER },
    formatter: { indentStyle: 'space' },
    javascript: {
      formatter: {
        quoteStyle: 'single',
      },
    },
  });

  const result = biome.formatContent(project.projectKey, content, {
    filePath: 'generated.ts',
  });

  return result.content;
}
