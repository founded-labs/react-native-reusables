import { Effect } from "effect"
import { detect } from "package-manager-detector"

const PACKAGE_MANAGERS = ["npm", "bun", "pnpm", "yarn@berry", "yarn"] as const

const BINARY_RUNNERS = {
  npm: ["npx"],
  bun: ["bunx", "--bun"],
  pnpm: ["pnpm", "dlx"],
  yarn: ["npx"],
  "yarn@berry": ["npx"]
} as const

const detectPackageManager = (cwd: string) =>
  Effect.tryPromise({
    try: () => {
      return detect({
        cwd,
        strategies: ["install-metadata", "lockfile", "packageManager-field", "devEngines-field"]
      })
    },
    catch: () => new Error("Failed to get package manager")
  })

const getPackageManager = (cwd: string) =>
  Effect.gen(function* () {
    const pm = yield* detectPackageManager(cwd)
    if (!pm) {
      return "npm"
    }
    const name = PACKAGE_MANAGERS.find((name) => pm.agent.startsWith(name) || pm.name.startsWith(name)) ?? "npm"
    return name
  })
const getBinaryRunner = (cwd: string) =>
  Effect.gen(function* () {
    const pm = yield* getPackageManager(cwd)
    return BINARY_RUNNERS[pm]
  })

class PackageManager extends Effect.Service<PackageManager>()("PackageManager", {
  succeed: {
    detectPackageManager,
    getPackageManager,
    getBinaryRunner
  }
}) {}

export { PackageManager }
