# Security policy

Skills and plugins can contain executable scripts, request credentials, or call external services. Catalog inclusion is not a security guarantee.

Before installing an entry:

- inspect `SKILL.md`, scripts, manifests, hooks, and dependency files;
- confirm the repository and publisher are the intended ones;
- review requested data access and tool permissions;
- test unfamiliar code in an isolated environment;
- never paste secrets into instructions or commit them to a repository.

For a vulnerability in this repository, use GitHub private vulnerability reporting when available. If unavailable, contact the maintainer through the GitHub profile without publishing exploit details. Report vulnerabilities in linked projects to their respective maintainers.
