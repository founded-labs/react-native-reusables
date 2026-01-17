import { CliOptions } from "@cli/contexts/cli-options.js"
import { type CustomFileCheck, type FileCheck, type MissingInclude, PROJECT_MANIFEST } from "@cli/project-manifest.js"
import { ProjectConfig } from "@cli/services/project-config.js"
import { RequiredFilesChecker } from "@cli/services/required-files-checker.js"
import { Spinner } from "@cli/services/spinner.js"
import { runCommand } from "@cli/utils/run-command.js"
import { Prompt } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { Data, Effect, Layer, Schema } from "effect"
import logSymbols from "log-symbols"

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
  summary: boolean
  yes: boolean
}

class Doctor extends Effect.Service<Doctor>()("Doctor", {
  dependencies: [RequiredFilesChecker.Default, Spinner.Default],
  effect: Effect.gen(function* () {
    const options = yield* CliOptions
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const requiredFileChecker = yield* RequiredFilesChecker
    const spinner = yield* Spinner
    const projectConfig = yield* ProjectConfig

    const stylingLibrary = yield* projectConfig.getStylingLibrary()

    if (stylingLibrary !== "unknown"){
      console.log(
        `\x1b[2m${logSymbols.info} Styling Library: ${stylingLibrary === "uniwind" ? "Uniwind" : "Nativewind"}\x1b[0m`
      )
    } 


    const checkRequiredDependencies = ({
      dependencies,
      devDependencies
    }: {
      dependencies: Array<string>
      devDependencies: Array<string>
    }) =>
      Effect.gen(function* () {
        const packageJsonExists = yield* fs.exists(path.join(options.cwd, "package.json"))
        if (!packageJsonExists) {
          return yield* Effect.fail(new PackageJsonError({ message: "A package.json was not found and is required." }))
        }

        const packageJson = yield* fs.readFileString(path.join(options.cwd, "package.json")).pipe(
          Effect.flatMap(Schema.decodeUnknown(Schema.parseJson())),
          Effect.flatMap(Schema.decodeUnknown(packageJsonSchema)),
          Effect.catchTags({
            ParseError: () => Effect.fail(new PackageJsonError({ message: "Failed to parse package.json" }))
          })
        )

        const uninstalledDependencies: Array<string> = []
        const uninstalledDevDependencies: Array<string> = []

        for (const dependency of dependencies) {
          if (
            !packageJson.dependencies?.[dependency.split("@")[0]] &&
            !packageJson.devDependencies?.[dependency.split("@")[0]]
          ) {
            uninstalledDependencies.push(dependency)
            continue
          }
          yield* Effect.logDebug(
            `${logSymbols.success} ${dependency}@${packageJson.dependencies?.[dependency.split("@")[0]]} is installed`
          )
        }

        for (const devDependency of devDependencies) {
          if (
            !packageJson.devDependencies?.[devDependency.split("@")[0]] &&
            !packageJson.dependencies?.[devDependency.split("@")[0]]
          ) {
            uninstalledDevDependencies.push(devDependency)
            continue
          }
          yield* Effect.logDebug(
            `${logSymbols.success} ${devDependency}@${packageJson.devDependencies?.[devDependency]} is installed`
          )
        }

        return { uninstalledDependencies, uninstalledDevDependencies }
      })

    const registry = stylingLibrary === "uniwind" ? "uniwind" : "nativewind"

    return {
      run: (options: DoctorOptions) =>
        Effect.gen(function* () {
          yield* Effect.logDebug(`Doctor options: ${JSON.stringify(options, null, 2)}`)
          const { uninstalledDependencies, uninstalledDevDependencies } = yield* checkRequiredDependencies({
            dependencies: PROJECT_MANIFEST.dependencies[registry],
            devDependencies: PROJECT_MANIFEST.devDependencies
          })

          const { customFileResults, deprecatedFileResults, fileResults } = yield* requiredFileChecker.run({
            customFileChecks: PROJECT_MANIFEST.customFileChecks,
            deprecatedFromLib: PROJECT_MANIFEST.deprecatedFromLib,
            deprecatedFromUi: PROJECT_MANIFEST.deprecatedFromUi,
            fileChecks: PROJECT_MANIFEST.fileChecks,
            stylingLibrary: registry 
          })

          const result = {
            missingFiles: [...fileResults.missingFiles, ...customFileResults.missingFiles],
            uninstalledDependencies,
            uninstalledDevDependencies,
            missingIncludes: [...fileResults.missingIncludes, ...customFileResults.missingIncludes],
            deprecatedFileResults
          }

          let total = Object.values(result).reduce((sum, cat) => sum + cat.length, 0)
          if (!options.summary) {
            const dependenciesToInstall: Array<string> = []
            for (const dep of result.uninstalledDependencies) {
              const confirmsInstall = options.yes
                ? true
                : yield* Prompt.confirm({
                    message: `The ${dep} dependency is missing. Do you want to install it?`,
                    initial: true
                  })
              if (confirmsInstall) {
                if (uninstalledDependencies.includes("expo")) {
                  continue
                }
                total--
                yield* Effect.logDebug(`Adding ${dep} to dependencies to install`)
                dependenciesToInstall.push(dep)
                result.uninstalledDependencies = result.uninstalledDependencies.filter((d) => d !== dep)
              }
            }

            if (dependenciesToInstall.length > 0) {
              yield* Effect.logDebug(`Installing ${dependenciesToInstall.join(", ")}`)
              if (process.env.INTERNAL_ENV !== "development") {
                spinner.start("Installing dependencies")
                yield* runCommand("npx", ["expo", "install", ...dependenciesToInstall], {
                  cwd: options.cwd
                })
                spinner.stop()
              }
            }

            const devDependenciesToInstall: Array<string> = []
            for (const dep of result.uninstalledDevDependencies) {
              const confirmsInstall = options.yes
                ? true
                : yield* Prompt.confirm({
                    message: `The ${dep} dependency is missing. Do you want to install it?`,
                    initial: true
                  })
              if (confirmsInstall) {
                if (uninstalledDependencies.includes("expo")) {
                  continue
                }
                total--
                yield* Effect.logDebug(`Adding ${dep} to devDependencies to install`)
                devDependenciesToInstall.push(dep)
                result.uninstalledDevDependencies = result.uninstalledDevDependencies.filter((d) => d !== dep)
              }
            }

            if (devDependenciesToInstall.length > 0) {
              yield* Effect.logDebug(`Installing ${devDependenciesToInstall.join(", ")}`)
              if (process.env.INTERNAL_ENV !== "development") {
                spinner.start("Installing dev dependencies")
                yield* runCommand("npx", ["expo", "install", ...devDependenciesToInstall], {
                  cwd: options.cwd
                })
                spinner.stop()
              }
            }
          }

          if (total === 0) {
            console.log(`\x1b[2m${logSymbols.success} All checks passed.\x1b[0m\n`)
            return yield* Effect.succeed(true)
          }

          const analysis = analyzeResult(result)
          if (options.summary) {
            console.log(
              `\x1b[2m${logSymbols.warning} ${total} Potential issue${
                total > 1 ? "s" : ""
              } found. For more info, run: 'npx @react-native-reusables/cli doctor${
                options.cwd !== "." ? ` -c ${options.cwd}` : ""
              }'\x1b[0m\n`
            )
          } else {
            yield* Effect.log("\n\n🩺 Diagnosis")
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
  }).pipe(Effect.provide(Doctor.Default), Effect.provide(ProjectConfig.Default), Effect.provide(optionsLayer))
}

export { Doctor, make }

interface Result {
  missingFiles: Array<FileCheck | CustomFileCheck>
  missingIncludes: Array<MissingInclude>
  uninstalledDependencies: Array<string>
  uninstalledDevDependencies: Array<string>
  deprecatedFileResults: Array<Omit<FileCheck, "docs" | "stylingLibraries">>
}

function analyzeResult(result: Result) {
  const categories: Array<{ title: string; logs: Array<string>; count: number }> = []

  if (result.missingFiles.length > 0) {
    categories.push({
      title: `${logSymbols.error} Missing Files (${result.missingFiles.length})`,
      count: result.missingFiles.length,
      logs: result.missingFiles.flatMap((f) => [`• ${f.name}`, `  📘 Docs: ${f.docs}`])
    })
  }

  if (result.missingIncludes.length > 0) {
    categories.push({
      title: `${logSymbols.error} Potentially Misconfigured Files (${result.missingIncludes.length})`,
      count: result.missingIncludes.length,
      logs: result.missingIncludes.flatMap((inc) => [
        `• ${inc.fileName}`,
        `  ↪ ${inc.message}`,
        `  📘 Docs: ${inc.docs}`
      ])
    })
  }

  if (result.uninstalledDependencies.length > 0) {
    categories.push({
      title: `${logSymbols.error} Missing Dependencies (${result.uninstalledDependencies.length})`,
      count: result.uninstalledDependencies.length,
      logs: ["• Install with:", `  ↪ npx expo install ${result.uninstalledDependencies.join(" ")}`]
    })
  }

  if (result.uninstalledDevDependencies.length > 0) {
    categories.push({
      title: `${logSymbols.error} Missing Dev Dependencies (${result.uninstalledDevDependencies.length})`,
      count: result.uninstalledDevDependencies.length,
      logs: ["• Install with:", `  ↪ npx expo install -- -D ${result.uninstalledDevDependencies.join(" ")}`]
    })
  }

  if (result.deprecatedFileResults.length > 0) {
    categories.push({
      title: `${logSymbols.warning} Deprecated (${result.deprecatedFileResults.length})`,
      count: result.deprecatedFileResults.length,
      logs: result.deprecatedFileResults.flatMap((deprecatedFile) => [
        `• ${deprecatedFile.name}`,
        ...deprecatedFile.includes.map((item) => `  ↪ ${item.message}\n  📘 Docs: ${item.docs}`)
      ])
    })
  }

  return categories
}
