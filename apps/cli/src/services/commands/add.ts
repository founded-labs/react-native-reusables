import { CliOptions } from "@cli/contexts/cli-options.js"
import { PROJECT_MANIFEST } from "@cli/project-manifest.js"
import { Doctor } from "@cli/services/commands/doctor.js"
import { runCommand } from "@cli/utils/run-command.js"
import { Prompt } from "@effect/cli"
import { Effect, Layer } from "effect"
import { PackageManager } from "../package-manager.js"
import { ProjectConfig } from "../project-config.js"

type AddOptions = {
  cwd: string
  args: { components: Array<string> }
  yes: boolean
  overwrite: boolean
  all: boolean
  path: string
}

class Add extends Effect.Service<Add>()("Add", {
  dependencies: [PackageManager.Default],
  effect: Effect.gen(function* () {
    const doctor = yield* Doctor
    const projectConfig = yield* ProjectConfig
    const packageManager = yield* PackageManager

    return {
      run: (options: AddOptions) =>
        Effect.gen(function* () {
          yield* Effect.logDebug(`Add options: ${JSON.stringify(options, null, 2)}`)

          yield* projectConfig.getComponentJson() // ensure components.json config is valid and prompt if not

          const components = options.all ? PROJECT_MANIFEST.components : (options.args?.components ?? [])

          if (components.length === 0) {
            const selectedComponents = yield* Prompt.multiSelect({
              message: "Select components to add",
              choices: PROJECT_MANIFEST.components.map((component) => ({
                title: component,
                value: component
              }))
            })
            for (const component of selectedComponents) {
              components.push(component)
            }
          }

          if (components.length === 0) {
            yield* Effect.fail(new Error("No components selected."))
          }

          yield* Effect.logDebug(`Selected components: ${components.join(", ")}`)

          const stylingLibrary = yield* projectConfig.getStylingLibrary()

          const registry = stylingLibrary === "uniwind" ? "uniwind" : "nativewind"

          const baseUrl =
            process.env.INTERNAL_ENV === "development"
              ? `http://localhost:3000/local/r/${registry}`
              : `https://reactnativereusables.com/r/${registry}`

          const componentUrls = components.map((component) => {
            const lowerCaseComponent = component.toLocaleLowerCase()
            return lowerCaseComponent.startsWith("http") ? lowerCaseComponent : `${baseUrl}/${lowerCaseComponent}.json`
          })

          const shadcnOptions = toShadcnOptions(options)

          const binaryRunner = yield* packageManager.getBinaryRunner(options.cwd)

          const commandArgs = [
            ...binaryRunner.slice(1),
            "shadcn@latest",
            "add",
            ...shadcnOptions,
            ...componentUrls
          ].filter((option) => option !== undefined)

          yield* Effect.logDebug(`Running command: ${binaryRunner[0]} ${commandArgs.join(" ")}`)

          yield* runCommand(binaryRunner[0], commandArgs, {
            cwd: options.cwd,
            stdio: "inherit"
          })

          yield* doctor.run({ ...options, summary: true })
        })
    }
  })
}) {}

function make(options: AddOptions) {
  const optionsLayer = Layer.succeed(CliOptions, { ...options, yes: true }) // For the project config
  return Effect.gen(function* () {
    const add = yield* Add

    return yield* add.run(options)
  }).pipe(
    Effect.provide(Add.Default),
    Effect.provide(Doctor.Default),
    Effect.provide(ProjectConfig.Default),
    Effect.provide(optionsLayer)
  )
}

export { make }

function toShadcnOptions(options: AddOptions) {
  const shadcnOptions = []

  if (options.overwrite) {
    shadcnOptions.push("--overwrite")
  }

  if (options.yes) {
    shadcnOptions.push("--yes")
  }

  if (options.path) {
    shadcnOptions.push("--path")
    shadcnOptions.push(options.path)
  }

  return shadcnOptions
}
