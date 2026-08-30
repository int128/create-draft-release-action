import * as core from '@actions/core'
import { getContext, getOctokit } from './github.js'
import { run } from './run.js'

try {
  await run(
    {
      releaseName: core.getInput('release-name'),
      releaseNameFile: core.getInput('release-name-file'),
      body: core.getInput('body'),
      dryRun: core.getBooleanInput('dry-run', { required: true }),
    },
    getOctokit(),
    await getContext(),
  )
} catch (e) {
  core.setFailed(e instanceof Error ? e : String(e))
  console.error(e)
}
