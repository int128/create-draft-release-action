import assert from 'node:assert'
import { Octokit } from '@octokit/action'
import { retry } from '@octokit/plugin-retry'

export const getOctokit = () => new (Octokit.plugin(retry))()

export type Context = {
  repo: {
    owner: string
    repo: string
  }
  ref: string
  sha: string
}

export const getContext = async (): Promise<Context> => {
  // https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
  return {
    repo: getRepo(),
    ref: getEnv('GITHUB_REF'),
    sha: getEnv('GITHUB_SHA'),
  }
}

const getRepo = () => {
  const [owner, repo] = getEnv('GITHUB_REPOSITORY').split('/')
  assert(owner, 'GITHUB_REPOSITORY must have an owner part')
  assert(repo, 'GITHUB_REPOSITORY must have a repo part')
  return { owner, repo }
}

const getEnv = (name: string): string => {
  assert(process.env[name], `${name} is required`)
  return process.env[name]
}
