import { CliOptions } from "@cli/cli-options.js"
import { RequiredFilesChecker } from "@cli/lib/required-files-checker.js"
import { type CustomFileCheck, type FileCheck, type MissingInclude, PROJECT_MANIFEST } from "@cli/project-manifest.js"
import { Prompt } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { Data, Effect, Layer, Schema } from "effect"

const packageJsonSchema = Schema.Struct({
  dependencies: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
  devDependencies: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String }))
})

class PackageJsonError extends Data.TaggedError("PackageJsonError")<{
  cause?: unknown
  message?: string
}> {}

type DoctorOptions = {
  cwd: string
  quiet: boolean
  essentials: boolean
  fix: boolean
}

class Doctor extends Effect.Service<Doctor>()("Doctor", {
  dependencies: [RequiredFilesChecker.Default],
  effect: Effect.gen(function* () {
    const options = yield* CliOptions
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const requiredFileChecker = yield* RequiredFilesChecker

    const getPackageJson = () =>
      Effect.gen(function* () {
        const packageJsonExists = yield* fs.exists(path.join(options.cwd, "package.json"))
        if (!packageJsonExists) {
          return yield* Effect.fail(new PackageJsonError({ message: "A package.json was not found and is required." }))
        }

        return yield* fs.readFileString(path.join(options.cwd, "package.json")).pipe(
          Effect.flatMap(Schema.decodeUnknown(Schema.parseJson())),
          Effect.flatMap(Schema.decodeUnknown(packageJsonSchema)),
          Effect.catchTags({
            ParseError: () => Effect.fail(new PackageJsonError({ message: "Failed to parse package.json" }))
          })
        )
      })

    const checkRequiredDependencies = ({
      dependencies,
      devDependencies
    }: {
      dependencies: Array<string>
      devDependencies: Array<string>
    }) =>
      Effect.gen(function* () {
        const packageJson = yield* getPackageJson()
        const uninstalledDependencies: Array<string> = []
        const uninstalledDevDependencies: Array<string> = []

        for (const dependency of dependencies) {
          if (!packageJson.dependencies?.[dependency]) {
            uninstalledDependencies.push(dependency)
            continue
          }
          yield* Effect.logDebug(`✅ ${dependency}@${packageJson.dependencies[dependency]} is installed`)
        }

        for (const devDependency of devDependencies) {
          if (!packageJson.devDependencies?.[devDependency] && !packageJson.dependencies?.[devDependency]) {
            uninstalledDevDependencies.push(devDependency)
            continue
          }
          yield* Effect.logDebug(`✅ ${devDependency}@${packageJson.devDependencies?.[devDependency]} is installed`)
        }

        return { uninstalledDependencies, uninstalledDevDependencies }
      })

    return {
      run: (options: DoctorOptions) =>
        Effect.gen(function* () {
          const { uninstalledDependencies, uninstalledDevDependencies } = yield* checkRequiredDependencies({
            dependencies: PROJECT_MANIFEST.dependencies,
            devDependencies: PROJECT_MANIFEST.devDependencies
          })

          if (uninstalledDependencies.includes("expo")) {
            return yield* Effect.fail(new Error("Expo is not installed and is required for the CLI to work."))
          }

          const { customFileResults, deprecatedFileResults, fileResults } = yield* requiredFileChecker.run({
            customFileChecks: PROJECT_MANIFEST.customFileChecks,
            deprecatedFromLib: PROJECT_MANIFEST.deprecatedFromLib,
            fileChecks: PROJECT_MANIFEST.fileChecks
          })

          const result = {
            missingFiles: [...fileResults.missingFiles, ...customFileResults.missingFiles],
            uninstalledDependencies,
            uninstalledDevDependencies,
            missingIncludes: [...fileResults.missingIncludes, ...customFileResults.missingIncludes],
            deprecatedFileResults
          }

          const total = Object.values(result).reduce((sum, cat) => sum + cat.length, 0)

          if (total === 0) {
            yield* Effect.log("Everything looks good!")
            return yield* Effect.succeed(true)
          }

          for (const missingFile of result.missingFiles) {
            const prompt = options.fix
              ? true
              : yield* Prompt.confirm({
                  message: `The ${missingFile.name} file is missing. Do you want to create it?`,
                  initial: true
                })

            if (prompt) {
              result.missingFiles = result.missingFiles.filter((f) => f.name !== missingFile.name)
              yield* Effect.logDebug(`Creating ${missingFile.name} file`)
            }
          }

          const dependenciesToInstall: Array<string> = []
          for (const dep of result.uninstalledDependencies) {
            const prompt = options.fix
              ? true
              : yield* Prompt.confirm({
                  message: `The ${dep} dependency is missing. Do you want to install it?`,
                  initial: true
                })
            if (prompt) {
              yield* Effect.logDebug(`Adding ${dep} to dependencies to install`)
              dependenciesToInstall.push(dep)
              result.uninstalledDependencies = result.uninstalledDependencies.filter((d) => d !== dep)
            }
          }

          const devDependenciesToInstall: Array<string> = []
          for (const dep of result.uninstalledDevDependencies) {
            const prompt = options.fix
              ? true
              : yield* Prompt.confirm({
                  message: `The ${dep} dependency is missing. Do you want to install it?`,
                  initial: true
                })
            if (prompt) {
              yield* Effect.logDebug(`Adding ${dep} to devDependencies to install`)
              devDependenciesToInstall.push(dep)
              result.uninstalledDevDependencies = result.uninstalledDevDependencies.filter((d) => d !== dep)
            }
          }

          if (dependenciesToInstall.length > 0) {
            yield* Effect.logDebug(`Installing ${dependenciesToInstall.join(", ")}`)
          }

          if (devDependenciesToInstall.length > 0) {
            yield* Effect.logDebug(`Installing ${devDependenciesToInstall.join(", ")}`)
          }

          const analysis = analyzeResult(result)
          if (options.quiet) {
            console.log(
              `⚠️  ${total} Potential issue${
                total > 1 ? "s" : ""
              } found. For more info, run \`npx @react-native-reusables/cli doctor\``
            )
          } else {
            console.log("\n🔎 Diagnosis")
            for (const item of analysis) {
              console.group(`\n${item.title}`)
              item.logs.forEach((line) => console.log(line))
              console.groupEnd()
            }
            console.log(`\n`)
          }
        })
    }
  })
}) {}

function make(options: DoctorOptions) {
  const optionsLayer = Layer.succeed(CliOptions, options)
  return Effect.gen(function* () {
    const doctor = yield* Doctor
    return yield* doctor.run(options)
  }).pipe(Effect.provide(Doctor.Default), Effect.provide(optionsLayer))
}

export { Doctor, make }

interface Result {
  missingFiles: Array<FileCheck | CustomFileCheck>
  missingIncludes: Array<MissingInclude>
  uninstalledDependencies: Array<string>
  uninstalledDevDependencies: Array<string>
  deprecatedFileResults: Array<{
    file: string
    exists: boolean
  }>
}

function analyzeResult(result: Result) {
  const categories: Array<{ title: string; logs: Array<string>; count: number }> = []

  if (result.missingFiles.length > 0) {
    categories.push({
      title: `❌ Missing Files (${result.missingFiles.length})`,
      count: result.missingFiles.length,
      logs: result.missingFiles.flatMap((f) => [`• ${f.name} → ${f.name}`, `  📘 Docs: ${f.docs}`])
    })
  }

  if (result.missingIncludes.length > 0) {
    categories.push({
      title: `❌ Potentially Misconfigured Files (${result.missingIncludes.length})`,
      count: result.missingIncludes.length,
      logs: result.missingIncludes.flatMap((inc) => [
        `• ${inc.fileName}`,
        `  ↪ ${inc.message}`,
        `  ✏️ Needed: ${inc.content.join(", ")}`,
        `  📘 Docs: ${inc.docs}`
      ])
    })
  }

  if (result.uninstalledDependencies.length > 0) {
    categories.push({
      title: `❌ Missing Dependencies (${result.uninstalledDependencies.length})`,
      count: result.uninstalledDependencies.length,
      logs: result.uninstalledDependencies.map((dep) => `• ${dep}`)
    })
  }

  if (result.uninstalledDevDependencies.length > 0) {
    categories.push({
      title: `❌ Missing Dev Dependencies (${result.uninstalledDevDependencies.length})`,
      count: result.uninstalledDevDependencies.length,
      logs: result.uninstalledDevDependencies.map((dep) => `• ${dep}`)
    })
  }

  if (result.deprecatedFileResults.length > 0) {
    categories.push({
      title: `⚠️  Deprecated Files (${result.deprecatedFileResults.length})`,
      count: result.deprecatedFileResults.length,
      logs: result.deprecatedFileResults.map((f) => `• ${f.file} → ${f.exists ? "Exists" : "Missing"}`)
    })
  }

  return categories
}
