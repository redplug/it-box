import { describe, expect, it } from 'vitest';
import { toolGuides } from './tool-guides';
import { tools } from '@/tools';

describe('tool guides coverage', () => {
  it('has a guide for every tool path', () => {
    const missing = tools.map(tool => tool.path).filter(path => !(path in toolGuides));
    expect(missing, `Tools without a guide (${missing.length}):\n${missing.join('\n')}`).toEqual([]);
  });
});
