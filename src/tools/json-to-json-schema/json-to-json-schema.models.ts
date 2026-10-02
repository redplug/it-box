import { isRecord, parseJson } from '../_shared/local-tool';

type Schema = Record<string, unknown>;

function inferSchema(value: unknown, depth = 0): Schema {
  if (depth > 64) {
    throw new Error('tools.json-to-json-schema.errors.tooDeep');
  }
  if (value === null) {
    return { type: 'null' };
  }
  if (Array.isArray(value)) {
    const schemas = [...new Set(value.map(item => JSON.stringify(inferSchema(item, depth + 1))))].map(schema =>
      JSON.parse(schema),
    );
    return { type: 'array', items: !schemas.length ? {} : schemas.length === 1 ? schemas[0] : { anyOf: schemas } };
  }
  if (isRecord(value)) {
    return {
      type: 'object',
      properties: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, inferSchema(item, depth + 1)])),
      required: Object.keys(value),
    };
  }
  return { type: typeof value };
}

export function jsonToSchema(text: string): string {
  return JSON.stringify(
    { $schema: 'https://json-schema.org/draft/2020-12/schema', ...inferSchema(parseJson(text)) },
    null,
    2,
  );
}
