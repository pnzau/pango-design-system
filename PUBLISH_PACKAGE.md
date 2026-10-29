# Publish the package

This repository can be installed directly from GitHub, but it needs a small packaging fix first.

## Current status

The library build succeeds with:

```sh
npm run build:library
```

The `prepack` script builds the package before npm creates its tarball. npm also runs it when installing a Git dependency.

## Verify the package

Run these commands before the first release and after meaningful package changes:

```sh
npm run build:library
npm pack --dry-run
```

The package preview should contain at least:

```text
dist-lib/index.js
dist-lib/index.d.ts
dist-lib/styles.css
dist-lib/marketing.d.ts
dist-lib/workflows.d.ts
```

## First GitHub release

After making the packaging changes:

```sh
git add package.json tsconfig.lib.json
git commit -m "prepare library for GitHub installation"
git push origin main

git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

A Git tag is a permanent name for a specific commit. It lets consumers install the exact source snapshot used for a release instead of whatever happens to be on the current branch.

Consumers can install that release with:

```sh
npm install github:pnzau/cheza_ui#v0.1.0
```

The repository must be public, or the consumer must have GitHub access to it.

## Later releases

After adding library changes:

```sh
npm run build:library
npm pack --dry-run
npm version patch
git push origin main --follow-tags
```

`npm version patch` updates `package.json` and `package-lock.json`, creates a release commit, and creates the matching Git tag. The tag is pushed by `--follow-tags`.

Use the version increment that matches the change:

```text
patch   0.1.0 -> 0.1.1   bug fixes and compatible changes
minor   0.1.0 -> 0.2.0   new backwards-compatible features
major   0.1.0 -> 1.0.0   breaking API changes
```

Install a later release by replacing the tag:

```sh
npm install github:pnzau/cheza_ui#v0.1.1
```

Do not run a separate `git tag` after `npm version`; `npm version` already creates the tag.

## Optional: GitHub Packages

GitHub Packages is different from installing directly from the GitHub repository. It provides a package registry, but npm packages published there must use a scope.

Change the package metadata to something like:

```json
{
  "name": "@pnzau/pango-design-system",
  "private": false,
  "repository": "https://github.com/pnzau/cheza_ui",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

Configure npm authentication, then publish:

```sh
npm login --scope=@pnzau --auth-type=legacy --registry=https://npm.pkg.github.com
npm publish
```

Consumers configure the `@pnzau` scope for GitHub Packages and install with:

```sh
npm install @pnzau/pango-design-system
```

GitHub Packages requires authentication for package operations. See the [GitHub npm registry documentation](https://docs.github.com/en/enterprise-cloud%40latest/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
