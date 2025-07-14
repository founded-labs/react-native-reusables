import { CliOptions } from "@cli/contexts/cli-options.js"
import { Prompt } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { Effect, Schema } from "effect"
import { Git } from "./git.js"
import { type ConfigLoaderSuccessResult, createMatchPath, loadConfig as loadTypescriptConfig } from "tsconfig-paths"

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
        return config
      })

    const handleInvalidComponentJson = (exists: boolean) =>
      Effect.gen(function* () {
        yield* Effect.logWarning(exists ? "Invalid components.json" : "Missing components.json")
        const agreeToWrite = yield* Prompt.confirm({
          message: `Would you like to ${
            exists ? "update the" : "write a"
          } components.json file (required to continue)?`,
          label: { confirm: "y", deny: "n" },
          initial: true,
          placeholder: { defaultConfirm: "y/n" }
        })
        if (!agreeToWrite) {
          return yield* Effect.fail(new Error("Unable to continue without a valid components.json file."))
        }

        const baseColor = exists
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

        const css = hasRootGlobalCss
          ? "global.css"
          : hasSrcGlobalCss
          ? "src/global.css"
          : yield* Prompt.text({
              message: "What is the name of the CSS file and path to it? (e.g. global.css or src/global.css)",
              default: "./global.css"
            })

        const hasTailwindConfig = yield* fs.exists(path.join(options.cwd, "tailwind.config.js"))
        const tailwindConfig = hasTailwindConfig
          ? "tailwind.config.js"
          : yield* Prompt.text({
              message:
                "What is the name of the Tailwind config file and path to it? (e.g. tailwind.config.js or src/tailwind.config.js)",
              default: "./tailwind.config.js"
            })

        const tsConfig = yield* getTsConfig()

        const aliasSymbol = `${(Object.keys(tsConfig.paths ?? {})[0] ?? "@/*").split("/*")[0]}`

        const newComponentJson = yield* Schema.encode(componentJsonSchema)({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          aliases: {
            components: `${aliasSymbol}/components`,
            utils: `${aliasSymbol}/utils`,
            ui: `${aliasSymbol}/components/ui`,
            lib: `${aliasSymbol}/lib`,
            hooks: `${aliasSymbol}/hooks`
          },
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
      resolvePathFromAlias
    }
  })
}) {}

export { ProjectConfig }
