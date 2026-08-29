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
