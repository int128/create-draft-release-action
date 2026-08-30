# create-draft-release-action [![ts](https://github.com/int128/create-draft-release-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/create-draft-release-action/actions/workflows/ts.yaml)

This is an action to create a draft release.
If the draft release already exists, it recreates it.

## Getting Started

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

## Specification

### Inputs

| Name                | Default | Description                                           |
| ------------------- | ------- | ----------------------------------------------------- |
| `release-name`      | -       | The name of release to create                         |
| `release-name-file` | -       | The path to file of release name                      |
| `body`              | -       | The body of release                                   |
| `dry-run`           | false   | If true, do not delete or create any release actually |

### Outputs

| Name           | Description                         |
| -------------- | ----------------------------------- |
| `release-name` | If created, the name of the release |
| `release-url`  | If created, the URL of the release  |
