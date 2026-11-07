import assert from 'node:assert/strict';
import test from 'node:test';
import { selectStartupContent } from './startupRotation';

test('startup rotation alternates verses and adhkar without repeating the last item', () => {
  const monday = new Date(2026, 10, 9);
  const first = selectStartupContent({
    mode: 'both',
    lastContentId: null,
    lastContentKind: null,
    date: monday,
    random: () => 0,
  });
  const second = selectStartupContent({
    mode: 'both',
    lastContentId: first.id,
    lastContentKind: first.kind,
    date: monday,
    random: () => 0,
  });

  assert.notEqual(first.id, second.id);
  assert.notEqual(first.kind, second.kind);
});

test('startup rotation avoids an immediate repeat when the content mode is fixed', () => {
  const monday = new Date(2026, 10, 9);
  const first = selectStartupContent({
    mode: 'verse',
    lastContentId: null,
    lastContentKind: null,
    date: monday,
    random: () => 0,
  });
  const second = selectStartupContent({
    mode: 'verse',
    lastContentId: first.id,
    lastContentKind: first.kind,
    date: monday,
    random: () => 0,
  });

  assert.notEqual(first.id, second.id);
});

test('Friday prioritizes Friday adhkar when dhikr is enabled', () => {
  const friday = new Date(2026, 10, 6);
  const content = selectStartupContent({
    mode: 'both',
    lastContentId: null,
    lastContentKind: null,
    date: friday,
    random: () => 0,
  });

  assert.equal(content.kind, 'dhikr');
  assert.equal(content.category, 'vendredi');
});
