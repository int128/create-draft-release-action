# create-draft-release-action [![ts](https://github.com/int128/create-draft-release-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/create-draft-release-action/actions/workflows/ts.yaml)

This is an action to create a draft release.

## Getting Started

Here is an example workflow to create a draft release `next` when main branch is updated.
If the draft release `next` already exists, this action recreates it.

```yaml
name: release

on:
  push:
    branches:
      - main

jobs:
  draft:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/create-draft-release-action@v1
        with:
          release-name: next
```

If the release name is not given, this action infers the next release name by incrementing the patch version of the latest release name.
For example, if the latest release is `v1.2.3`, this action creates a draft release as `v1.2.4`.

```yaml
jobs:
  draft:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/create-draft-release-action@v1
```

When this action is run on a tag, it creates a release for the tag name regardless of inputs.

## Specification

### Inputs

| Name                | Default | Description                                           |
| ------------------- | ------- | ----------------------------------------------------- |
| `release-name`      | -       | The name of release to create                         |
| `release-name-file` | -       | The path to file of release name                      |
| `body`              | -       | The body of release                                   |
| `dry-run`           | false   | If true, do not delete or create any release actually |

You can specify the release name by either `release-name` or `release-name-file`.

### Outputs

| Name           | Description                         |
| -------------- | ----------------------------------- |
| `release-name` | If created, the name of the release |
| `release-url`  | If created, the URL of the release  |
