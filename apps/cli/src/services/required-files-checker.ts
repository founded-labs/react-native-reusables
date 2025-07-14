import { CliOptions } from "@cli/contexts/cli-options.js"
import { NATIVEWIND_ENV_FILE } from "@cli/project-manifest.js"
import { ProjectConfig } from "@cli/services/project-config.js"
import { retryWith } from "@cli/utils/retry-with.js"
import { FileSystem, Path } from "@effect/platform"
import { Data, Effect } from "effect"
import logSymbols from "log-symbols"
import type { CustomFileCheck, FileCheck, FileWithContent, MissingInclude } from "../project-manifest.js"

class RequiredFileError extends Data.TaggedError("RequiredFileError")<{
  file: string
  message?: string
}> {}

class RequiredFilesChecker extends Effect.Service<RequiredFilesChecker>()("RequiredFilesChecker", {
  effect: Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const options = yield* CliOptions
    const projectConfig = yield* ProjectConfig

    const checkFiles = (fileChecks: Array<FileCheck>) =>
      Effect.gen(function* () {
        const missingFiles: Array<FileCheck> = []
        const missingIncludes: Array<MissingInclude> = []

        const filesWithContent = yield* Effect.forEach(
          fileChecks,
          (file) =>
            retryWith(
              (filePath: string) =>
                Effect.gen(function* () {
                  const fileContents = yield* fs.readFileString(filePath)
                  yield* Effect.logDebug(`${logSymbols.success} ${file.name} found`)
                  return { ...file, content: fileContents } as FileWithContent
                }),
              file.fileNames.map((p) => path.join(options.cwd, p)) as [string, ...Array<string>]
            ).pipe(
              Effect.catchAll(() => {
                missingFiles.push(file)
                return Effect.logDebug(`${logSymbols.error} ${file.name} not found`).pipe(() => Effect.succeed(null))
              })
            ),
          { concurrency: "unbounded" }
        ).pipe(Effect.map((files) => files.filter((file): file is FileWithContent => file !== null)))

        yield* Effect.forEach(filesWithContent, (file) =>
          Effect.gen(function* () {
            const { content, includes, name } = file
            for (const include of includes) {
              if (include.content.every((str) => content.includes(str))) {
                yield* Effect.logDebug(`${logSymbols.success} ${name} has ${include.content.join(", ")}`)
                continue
              }
              yield* Effect.logDebug(`${logSymbols.error} ${name} missing ${include.content.join(", ")}`)
              missingIncludes.push({ ...include, fileName: name })
            }
          })
        )

        return { missingFiles, missingIncludes }
      })

    const checkDeprecatedFiles = (deprecatedFromLib: Array<Omit<FileCheck, "docs">>) =>
      Effect.gen(function* () {
        const componentJson = yield* projectConfig.getComponentJson()
        const aliasForLib = componentJson.aliases.lib ?? `${componentJson.aliases.utils}/lib`

        const existingDeprecatedFromLibs = yield* Effect.forEach(
          deprecatedFromLib,
          (file) =>
            projectConfig.resolvePathFromAlias(`${aliasForLib}/${file.fileNames[0]}`).pipe(
              Effect.flatMap((fullPath) =>
                Effect.gen(function* () {
                  const exists = yield* fs.exists(fullPath)
                  if (!exists) {
                    yield* Effect.logDebug(`${logSymbols.success} Deprecated lib/${file.fileNames[0]} not found`)
                  } else {
                    yield* Effect.logDebug(`${logSymbols.error} Deprecated lib/${file.fileNames[0]} found`)
                  }
                  return { ...file, exists }
                })
              )
            ),
          { concurrency: "unbounded" }
        ).pipe(
          Effect.map((results) =>
            results.filter((result) => result.exists).map(({ exists: _exists, ...result }) => result)
          )
        )

        return existingDeprecatedFromLibs
      })

    const checkCustomFiles = (customFileChecks: Record<string, CustomFileCheck>) =>
      Effect.gen(function* () {
        const componentJson = yield* projectConfig.getComponentJson()
        const aliasForLib = componentJson.aliases.lib ?? `${componentJson.aliases.utils}/lib`
        const missingFiles: Array<CustomFileCheck> = []
        const missingIncludes: Array<MissingInclude> = []

        // Check CSS files
        const cssPaths = [componentJson.tailwind.css, "global.css", "src/global.css"].filter((p) => p != null)
        const cssContent = yield* retryWith(
          (filePath: string) =>
            Effect.gen(function* () {
              const content = yield* fs.readFileString(filePath)
              yield* Effect.logDebug(`${logSymbols.success} ${customFileChecks.css.name} found`)
              return content
            }),
          cssPaths.map((p) => path.join(options.cwd, p)) as [string, ...Array<string>]
        ).pipe(
          Effect.catchAll(() =>
            Effect.fail(
              new RequiredFileError({
                file: "CSS",
                message:
                  "CSS file not found. Please follow the instructions at https://www.nativewind.dev/docs/getting-started/installation#installation-with-expo"
              })
            )
          )
        )

        for (const include of customFileChecks.css.includes) {
          if (include.content.every((str) => cssContent.includes(str))) {
            yield* Effect.logDebug(
              `${logSymbols.success} ${customFileChecks.css.name} has ${include.content.join(", ")}`
            )
            continue
          }
          yield* Effect.logDebug(
            `${logSymbols.error} ${customFileChecks.css.name} missing ${include.content.join(", ")}`
          )
          missingIncludes.push({ ...include, fileName: customFileChecks.css.name })
        }

        // Check NativeWind env file
        if (componentJson.tsx !== false) {
          const nativewindEnvContent = yield* fs.readFileString(path.join(options.cwd, NATIVEWIND_ENV_FILE)).pipe(
            Effect.catchAll(() => {
              missingFiles.push(customFileChecks.nativewindEnv)
              return Effect.succeed(null)
            })
          )

          if (nativewindEnvContent) {
            for (const include of customFileChecks.nativewindEnv.includes) {
              if (include.content.every((str) => nativewindEnvContent.includes(str))) {
                yield* Effect.logDebug(
                  `${logSymbols.success} ${customFileChecks.nativewindEnv.name} has ${include.content.join(", ")}`
                )
                continue
              }
              yield* Effect.logDebug(
                `${logSymbols.error} ${customFileChecks.nativewindEnv.name} missing ${include.content.join(", ")}`
              )
              missingIncludes.push({ ...include, fileName: customFileChecks.nativewindEnv.name })
            }
          } else {
            yield* Effect.logDebug(`${logSymbols.error} ${customFileChecks.nativewindEnv.name} not found`)
          }
        }

        // Check Tailwind config
        const tailwindConfigPaths = [componentJson.tailwind.config, "tailwind.config.js", "tailwind.config.ts"].filter(
          (p) => p != null
        )
        const tailwindConfigContent = yield* retryWith(
          (filePath: string) =>
            Effect.gen(function* () {
              const content = yield* fs.readFileString(filePath)
              yield* Effect.logDebug(`${logSymbols.success} ${customFileChecks.tailwindConfig.name} found`)
              return content
            }),
          tailwindConfigPaths.map((p) => path.join(options.cwd, p)) as [string, ...Array<string>]
        ).pipe(
          Effect.catchAll(() =>
            Effect.fail(
              new RequiredFileError({
                file: "Tailwind config",
                message:
                  "Tailwind config not found, Please follow the instructions at https://www.nativewind.dev/docs/getting-started/installation#installation-with-expo"
              })
            )
          )
        )

        for (const include of customFileChecks.tailwindConfig.includes) {
          if (include.content.every((str) => tailwindConfigContent.includes(str))) {
            yield* Effect.logDebug(
              `${logSymbols.success} ${customFileChecks.tailwindConfig.name} has ${include.content.join(", ")}`
            )
            continue
          }
          yield* Effect.logDebug(
            `${logSymbols.error} ${customFileChecks.tailwindConfig.name} missing ${include.content.join(", ")}`
          )
          missingIncludes.push({ ...include, fileName: customFileChecks.tailwindConfig.name })
        }

        // Check theme file
        const themeAliasPath = yield* projectConfig.resolvePathFromAlias(`${aliasForLib}/theme.ts`)
        const themeContent = yield* fs.readFileString(themeAliasPath).pipe(
          Effect.catchAll(() => {
            missingFiles.push(customFileChecks.theme)
            return Effect.succeed(null)
          })
        )

        if (themeContent) {
          for (const include of customFileChecks.theme.includes) {
            if (include.content.every((str) => themeContent.includes(str))) {
              yield* Effect.logDebug(
                `${logSymbols.success} ${customFileChecks.theme.name} has ${include.content.join(", ")}`
              )
              continue
            }
            yield* Effect.logDebug(
              `${logSymbols.error} ${customFileChecks.theme.name} missing ${include.content.join(", ")}`
            )
            missingIncludes.push({ ...include, fileName: customFileChecks.theme.name })
          }
        } else {
          yield* Effect.logDebug(`${logSymbols.error} ${customFileChecks.theme.name} not found`)
        }

        // Check utils file
        const utilsPath = yield* projectConfig.resolvePathFromAlias(`${aliasForLib}/utils.ts`)
        const utilsContent = yield* fs.readFileString(utilsPath).pipe(
          Effect.catchAll(() => {
            missingFiles.push(customFileChecks.utils)
            return Effect.succeed(null)
          })
        )

        if (utilsContent) {
          for (const include of customFileChecks.utils.includes) {
            if (include.content.every((str) => utilsContent.includes(str))) {
              yield* Effect.logDebug(
                `${logSymbols.success} ${customFileChecks.utils.name} has ${include.content.join(", ")}`
              )
              continue
            }
            yield* Effect.logDebug(
              `${logSymbols.error} ${customFileChecks.utils.name} missing ${include.content.join(", ")}`
            )
            missingIncludes.push({ ...include, fileName: customFileChecks.utils.name })
          }
        } else {
          yield* Effect.logDebug(`${logSymbols.error} ${customFileChecks.utils.name} not found`)
          missingFiles.push(customFileChecks.utils)
        }

        return { missingFiles, missingIncludes }
      })

    return {
      run: ({
        customFileChecks,
        deprecatedFromLib,
        fileChecks
      }: {
        fileChecks: Array<FileCheck>
        customFileChecks: Record<string, CustomFileCheck>
        deprecatedFromLib: Array<Omit<FileCheck, "docs">>
      }) =>
        Effect.gen(function* () {
          const [fileResults, customFileResults, deprecatedFileResults] = yield* Effect.all([
            checkFiles(fileChecks),
            checkCustomFiles(customFileChecks),
            checkDeprecatedFiles(deprecatedFromLib)
          ])

          return { fileResults, customFileResults, deprecatedFileResults }
        })
    }
  })
}) {}

export { RequiredFilesChecker }
