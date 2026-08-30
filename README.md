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
          draft-release-name: next
```

## Specification

### Inputs

| Name                | Default | Description                                           |
| ------------------- | ------- | ----------------------------------------------------- |
| `release-name`      | (\*1)   | Name of release to create                             |
| `release-name-file` | (\*1)   | Path to file of release name                          |
| `dry-run`           | false   | If true, do not delete or create any release actually |

(\*1): Either `release-name` or `release-name-file` must be provided.

### Outputs

| Name           | Description                         |
| -------------- | ----------------------------------- |
| `release-name` | If created, the name of the release |
| `release-url`  | If created, the URL of the release  |
