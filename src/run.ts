import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type { Context } from './github.js'

type Inputs = {
  draftReleaseName: string
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  const existingRelease = await findReleaseByTag(octokit, context, inputs.draftReleaseName)
  if (existingRelease?.draft === false) {
    core.info(`Release ${inputs.draftReleaseName} is already published`)
    return
  }
  if (existingRelease?.draft === true) {
    core.info(`Deleting the existing draft release ${inputs.draftReleaseName}`)
    await octokit.repos.deleteRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      release_id: existingRelease.id,
    })
  }

  core.info(`Creating a draft release ${inputs.draftReleaseName}`)
  const { data: release } = await octokit.repos.createRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: inputs.draftReleaseName,
    tag_name: inputs.draftReleaseName,
    target_commitish: context.sha,
    draft: true,
  })
  core.info(`Created a draft release: ${release.html_url}`)
}

const findReleaseByTag = async (octokit: Octokit, context: Context, tag: string) => {
  try {
    const { data: release } = await octokit.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag,
    })
    return release
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      return undefined
    }
    throw error
  }
}
