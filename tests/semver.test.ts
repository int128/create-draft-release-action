import { describe, expect, it } from 'vitest'
import { bumpVersion } from '../src/semver.js'

describe('bumpVersion', () => {
  it.each([
    { current: 'v0.0.0', next: 'v0.0.1' },
    { current: 'v1.2.3', next: 'v1.2.4' },
    { current: 'v1.2.3-1', next: 'v1.2.4-1' },
  ])('increments the patch part of $current', ({ current, next }) => {
    expect(bumpVersion(current)).toBe(next)
  })
})
