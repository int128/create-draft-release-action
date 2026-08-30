import * as fs from 'node:fs/promises'
import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type { Context } from './github.js'
import { bumpVersion } from './semver.js'

type Inputs = {
  releaseName: string
  releaseNameFile: string
  dryRun: boolean
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  if (inputs.releaseName) {
    return await createRelease(inputs.releaseName, inputs.dryRun, octokit, context)
  }
  if (inputs.releaseNameFile) {
    const releaseName = await fs.readFile(inputs.releaseNameFile, 'utf8')
    return await createRelease(releaseName.trim(), inputs.dryRun, octokit, context)
  }
  const releaseName = await inferNextReleaseName(octokit, context)
  return await createRelease(releaseName, inputs.dryRun, octokit, context)
}

const inferNextReleaseName = async (octokit: Octokit, context: Context) => {
  const { data: latestRelease } = await octokit.repos.getLatestRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
  })
  const latestReleaseName = latestRelease.tag_name
  core.info(`Found the latest release ${latestReleaseName}`)
  const nextReleaseName = bumpVersion(latestReleaseName)
  if (!nextReleaseName) {
    return 'next'
  }
  return nextReleaseName
}

const createRelease = async (releaseName: string, dryRun: boolean, octokit: Octokit, context: Context) => {
  core.info(`Finding release: ${releaseName}`)
  const { data: releases } = await octokit.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  })

  const existingReleases = releases.filter((release) => release.name === releaseName)
  for (const existingRelease of existingReleases) {
    if (existingRelease.draft) {
      if (dryRun) {
        core.info(`[dry-run] Deleting the existing draft release: ${existingRelease.html_url}`)
        continue
      }
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

  if (dryRun) {
    core.info(`[dry-run] Creating a draft release: ${releaseName}`)
    return
  }
  core.info(`Creating a draft release: ${releaseName}`)
  const { data: release } = await octokit.repos.createRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: releaseName,
    tag_name: releaseName,
    target_commitish: context.sha,
    draft: true,
  })
  core.info(`Created a draft release: ${release.html_url}`)
  core.setOutput('release-name', release.name)
  core.setOutput('release-url', release.html_url)
}
