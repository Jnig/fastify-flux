// schemas without properties cause fastify-swagger to fail
export function addProperties(definitions: Record<string, any>) {
  Object.keys(definitions).forEach((key: string) => {
    const definition = definitions[key];
    if (definition.type === 'object' && !definition.properties) {
      definition.properties = {};
    }
  });

  return definitions;
}
