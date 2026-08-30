import assert from 'node:assert'

export const bumpVersion = (version: string) => {
  const matcher = version.match(/^(v?\d+)\.(\d+)\.(\d+)(.*)$/)
  if (!matcher) {
    return
  }
  const [, major, minor, patch, suffix] = matcher
  assert(major, `semver must have the major part`)
  assert(minor, `semver must have the minor part`)
  assert(patch, `semver must have the patch part`)
  return `${major}.${minor}.${Number.parseInt(patch, 10) + 1}${suffix}`
}
