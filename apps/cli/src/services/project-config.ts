import { CliOptions } from "@cli/contexts/cli-options.js"
import { retryWith } from "@cli/utils/retry-with.js"
import { Prompt } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { Effect, Schema } from "effect"
import { Git } from "./git.js"
import { type ConfigLoaderSuccessResult, createMatchPath, loadConfig as loadTypescriptConfig } from "tsconfig-paths"
import { PROJECT_MANIFEST } from "@cli/project-manifest.js"

const componentJsonSchema = Schema.Struct({
  $schema: Schema.optional(Schema.String),
  style: Schema.String,
  rsc: Schema.Boolean,
  tsx: Schema.Boolean,
  tailwind: Schema.Struct({
    config: Schema.optional(Schema.String),
    css: Schema.String,
    baseColor: Schema.String,
    cssVariables: Schema.Boolean,
    prefix: Schema.optional(Schema.String)
  }),
  aliases: Schema.Struct({
    components: Schema.String,
    utils: Schema.String,
    ui: Schema.optional(Schema.String),
    lib: Schema.optional(Schema.String),
    hooks: Schema.optional(Schema.String)
  }),
  iconLibrary: Schema.optional(Schema.String)
})

const supportedExtensions = [".ts", ".tsx", ".jsx", ".js", ".css"]

class ProjectConfig extends Effect.Service<ProjectConfig>()("ProjectConfig", {
  dependencies: [Git.Default],
  effect: Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const options = yield* CliOptions
    const git = yield* Git

    let componentJsonConfig: typeof componentJsonSchema.Type | null = null
    let tsConfig: ConfigLoaderSuccessResult | null = null

    const getComponentJson = () =>
      Effect.gen(function* () {
        if (componentJsonConfig) {
          return componentJsonConfig
        }

        const componentJsonExists = yield* fs.exists(path.join(options.cwd, "components.json"))
        if (!componentJsonExists) {
          return yield* handleInvalidComponentJson(false)
        }
        const config = yield* fs.readFileString(path.join(options.cwd, "components.json")).pipe(
          Effect.flatMap(Schema.decodeUnknown(Schema.parseJson())),
          Effect.flatMap(Schema.decodeUnknown(componentJsonSchema)),
          Effect.catchTags({
            ParseError: () => handleInvalidComponentJson(true)
          })
        )

        componentJsonConfig = config

        yield* Effect.logDebug(`componentJsonConfig: ${JSON.stringify(componentJsonConfig, null, 2)}`)
        return config
      })

    const getUniwindDtsPath = () =>
      Effect.gen(function* () {
        const metroConfigPaths = ["metro.config.js", "metro.config.ts"].map((p) => path.join(options.cwd, p)) as [
          string,
          ...Array<string>
        ]

        const metroContent = yield* retryWith((filePath: string) => fs.readFileString(filePath), metroConfigPaths).pipe(
          Effect.catchAll(() => Effect.succeed(null))
        )

        if (!metroContent?.includes("withUniwindConfig")) {
          return null
        }

        const dtsFileMatch = metroContent.match(/dtsFile\s*:\s*["']([^"']+)["']/)
        if (dtsFileMatch?.[1]) {
          const dtsPath = dtsFileMatch[1].replace(/^\.\//, "")
          return path.join(options.cwd, dtsPath)
        }

        return path.join(options.cwd, PROJECT_MANIFEST.uniwindTypesFile)
      })

    const getStylingLibrary = () =>
      Effect.gen(function* () {
        const metroConfigPaths = ["metro.config.js", "metro.config.ts"].map((p) => path.join(options.cwd, p)) as [
          string,
          ...Array<string>
        ]

        const metroContent = yield* retryWith((filePath: string) => fs.readFileString(filePath), metroConfigPaths).pipe(
          Effect.catchAll(() => Effect.succeed(null))
        )

        if (metroContent?.includes("withUniwindConfig")) {
          return "uniwind" as const
        }

        // v4 uses withNativeWind
        // v5 uses withNativewind
        if (metroContent?.toLowerCase().includes("withnativewind")) {
          return "nativewind" as const
        }

        return "unknown" as const 
      })

    const handleInvalidComponentJson = (exists: boolean) =>
      Effect.gen(function* () {
        yield* Effect.logWarning(
          `${exists ? "Invalid components.json" : "Missing components.json"}${" (required to continue)"}`
        )
        const agreeToWrite =  yield* Prompt.confirm({
              message: `Would you like to ${exists ? "update the" : "write a"} components.json file?`,
              label: { confirm: "y", deny: "n" },
              initial: true,
              placeholder: { defaultConfirm: "y/n" }
            })
        if (!agreeToWrite) {
          return yield* Effect.fail(new Error("Unable to continue without a valid components.json file."))
        }

        const baseColor = options.yes
          ? "neutral"
          : yield* Prompt.select({
              message: "Which color would you like to use as the base color?",
              choices: [
                { title: "neutral", value: "neutral" },
                { title: "stone", value: "stone" },
                { title: "zinc", value: "zinc" },
                { title: "gray", value: "gray" },
                { title: "slate", value: "slate" }
              ] as const
            })

        const hasRootGlobalCss = yield* fs.exists(path.join(options.cwd, "global.css"))

        const hasSrcGlobalCss = hasRootGlobalCss ? false : yield* fs.exists(path.join(options.cwd, "src/global.css"))

        const detectedCss = hasRootGlobalCss ? "global.css" : hasSrcGlobalCss ? "src/global.css" : ""

        const css =
          options.yes && detectedCss
            ? detectedCss
            : yield* Prompt.text({
                message: "What is the name of the CSS file and path to it? (e.g. global.css or src/global.css)",
                default: detectedCss
              })
        
        const stylingLibrary = yield* getStylingLibrary()

        const hasTailwindConfig = yield* fs.exists(path.join(options.cwd, "tailwind.config.js"))
        const tailwindConfig = stylingLibrary === "uniwind" ? "" :
          options.yes && hasTailwindConfig
            ? "tailwind.config.js"
            : yield* Prompt.text({
                message:
                  "What is the name of the Tailwind config file and path to it? (e.g. tailwind.config.js or src/tailwind.config.js)",
                default: "tailwind.config.js"
              })

        const tsConfig = yield* getTsConfig()

        const aliasSymbol = `${(Object.keys(tsConfig.paths ?? {})[0] ?? "@/*").split("/*")[0]}`

        const detectedAliases = {
          components: `${aliasSymbol}/components`,
          utils: `${aliasSymbol}/lib/utils`,
          ui: `${aliasSymbol}/components/ui`,
          lib: `${aliasSymbol}/lib`,
          hooks: `${aliasSymbol}/hooks`
        }

        let aliases = detectedAliases

        if (!options.yes) {
          const useDetectedAliases = yield* Prompt.confirm({
            message: `Use detected alias (${aliasSymbol}/*) in your setup?`,
            initial: true
          })

          if (!useDetectedAliases) {
            const [componentsAlias, utilsAlias, uiAlias, libAlias, hooksAlias] = yield* Prompt.all([
              Prompt.text({
                message: "What is the name of the components alias?",
                default: detectedAliases.components
              }),
              Prompt.text({
                message: "What is the name of the utils alias?",
                default: detectedAliases.utils
              }),
              Prompt.text({
                message: "What is the name of the ui alias?",
                default: detectedAliases.ui
              }),
              Prompt.text({
                message: "What is the name of the lib alias?",
                default: detectedAliases.lib
              }),
              Prompt.text({
                message: "What is the name of the hooks alias?",
                default: detectedAliases.hooks
              })
            ])

            aliases = {
              components: componentsAlias,
              utils: utilsAlias,
              ui: uiAlias,
              lib: libAlias,
              hooks: hooksAlias
            }
          }
        }

        const newComponentJson = yield* Schema.encode(componentJsonSchema)({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "new-york",
          aliases,
          rsc: false,
          tsx: true,
          tailwind: {
            css,
            baseColor,
            cssVariables: true,
            config: tailwindConfig
          }
        })

        yield* git.promptIfDirty()
        yield* fs.writeFileString(path.join(options.cwd, "components.json"), JSON.stringify(newComponentJson, null, 2))
        yield* Effect.logDebug(`newComponentJson: ${JSON.stringify(newComponentJson, null, 2)}`)
        return newComponentJson
      })

    const getTsConfig = () =>
      Effect.try({
        try: () => {
          if (tsConfig) {
            return tsConfig
          }
          const configResult = loadTypescriptConfig(options.cwd)
          if (configResult.resultType === "failed") {
            throw new Error("Error loading tsconfig.json", { cause: configResult.message })
          }
          tsConfig = configResult
          return configResult
        },
        catch: (error) => new Error("Error loading {ts,js}config.json", { cause: String(error) })
      })

    const resolvePathFromAlias = (aliasPath: string) =>
      Effect.gen(function* () {
        const config = yield* getTsConfig()
        return yield* Effect.try({
          try: () => {
            const matchPath = createMatchPath(config.absoluteBaseUrl, config.paths)(
              aliasPath,
              undefined,
              () => true,
              supportedExtensions
            )
            if (!matchPath) {
              throw new Error("Path not found", { cause: aliasPath })
            }
            return matchPath
          },
          catch: (error) => new Error("Path not found", { cause: String(error) })
        })
      })

    return {
      getComponentJson,
      getTsConfig,
      resolvePathFromAlias,
      getStylingLibrary,
      getUniwindDtsPath
    }
  })
}) {}

export { ProjectConfig }
