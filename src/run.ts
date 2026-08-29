import * as fs from 'node:fs/promises'
import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type { Context } from './github.js'

type Inputs = {
  releaseName: string
  releaseNameFile: string
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  if (inputs.releaseName) {
    return await createRelease(inputs.releaseName, octokit, context)
  }
  if (inputs.releaseNameFile) {
    const releaseName = await fs.readFile(inputs.releaseNameFile, 'utf8')
    return await createRelease(releaseName.trim(), octokit, context)
  }
  throw new Error('Either releaseName or releaseNameFile must be provided')
}

const createRelease = async (releaseName: string, octokit: Octokit, context: Context) => {
  core.info(`Finding release ${releaseName}`)
  const { data: releases } = await octokit.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  })

  const existingReleases = releases.filter((release) => release.name === releaseName)
  for (const existingRelease of existingReleases) {
    if (existingRelease.draft) {
      core.info(`Deleting the existing draft release: ${existingRelease.html_url}`)
      await octokit.repos.deleteRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        release_id: existingRelease.id,
      })
    } else {
      core.info(`Release ${releaseName} is already published: ${existingRelease.html_url}`)
      return
    }
  }

  core.info(`Creating a draft release ${releaseName}`)
  const { data: release } = await octokit.repos.createRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: releaseName,
    tag_name: releaseName,
    target_commitish: context.sha,
    draft: true,
  })
  core.info(`Created a draft release: ${release.html_url}`)
}
