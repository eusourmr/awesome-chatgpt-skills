# Releasing ChatGPT Skills

This project uses npm for CLI distribution and GitHub Actions trusted publishing for releases after the initial package claim.

## First npm publication: v0.3.0

The package name `chatgpt-skills` was checked against the npm registry on 2026-09-08 and returned `E404`, meaning the name was unclaimed at that moment. Re-check immediately before publishing because registry state can change.

Requirements:

- an npm account with two-factor authentication enabled;
- Node.js 24 recommended;
- a clean checkout of the tagged release commit.

Run:

```bash
npm login
npm run validate
npm pack --dry-run
npm publish
```

This first publication creates the package in the registry. Do not create the release tag before the package has been successfully claimed.

## Enable trusted publishing

After `chatgpt-skills` exists on npm, configure GitHub Actions as a trusted publisher for the package.

Use these values:

- Provider: GitHub Actions
- GitHub user/organization: `eusourmr`
- Repository: `chatgpt-skills`
- Workflow filename: `publish-npm.yml`
- Allow action: `npm publish`

The same relationship can be configured with a recent npm CLI:

```bash
npm trust github chatgpt-skills \
  --file publish-npm.yml \
  --repo eusourmr/chatgpt-skills \
  --allow-publish
```

Trusted publishing requires an npm CLI and Node version that support OIDC. The workflow deliberately uses Node 24 and grants only `contents: read` plus `id-token: write`.

## Subsequent releases

1. Update `package.json` to the next semantic version.
2. Update `CHANGELOG.md`.
3. Run `npm run validate` and `npm run pack:check`.
4. Merge the release PR to `main`.
5. Create a tag matching the package version exactly, for example `v0.3.1`.
6. Push the tag.

The `Publish npm package` workflow verifies that the Git tag and `package.json` version match before publishing.

## Release safety rules

- Never store a long-lived npm write token in the repository.
- Never publish from an unreviewed branch.
- Never reuse a version already published to npm.
- Keep npm 2FA enabled even when trusted publishing is configured.
- Treat a failed package smoke test as a release blocker.
