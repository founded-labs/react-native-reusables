import { CliOptions } from "@cli/contexts/cli-options.js"
import { PROJECT_MANIFEST } from "@cli/project-manifest.js"
import { Doctor } from "@cli/services/commands/doctor.js"
import { ProjectConfig } from "@cli/services/project-config.js"
import { Template } from "@cli/services/template.js"
import { Prompt } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { Effect, Layer } from "effect"
import logSymbols from "log-symbols"

type InitOptions = {
  cwd: string
  template: string
}

class Init extends Effect.Service<Init>()("Init", {
  dependencies: [Template.Default],
  effect: Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const doctor = yield* Doctor
    const template = yield* Template

    return {
      run: (options: InitOptions) =>
        Effect.gen(function* () {
          yield* Effect.logDebug(`Init options: ${JSON.stringify(options, null, 2)}`)

          const packageJsonExists = yield* fs.exists(path.join(options.cwd, "package.json"))

          yield* Effect.logDebug(`Does package.json exist: ${packageJsonExists ? "yes" : "no"}`)

          if (packageJsonExists) {
            yield* Effect.logWarning(`${logSymbols.warning} A project already exists in this directory.`)
            const choice = yield* Prompt.select({
              message: "How would you like to proceed?",
              choices: [
                { title: "Initialize a new project here anyway", value: "init-new" },
                { title: "Inspect project configuration", value: "doctor" },
                { title: "Cancel and exit", value: "cancel" }
              ]
            })
            yield* Effect.logDebug(`Init choice: ${choice}`)
            if (choice === "cancel") {
              return yield* Effect.succeed(true)
            }
            if (choice === "doctor") {
              console.log("")
              return yield* doctor.run({ ...options, summary: false, yes: false })
            }
          }

          const projectName = yield* Prompt.text({
            message: "What is the name of your project? (e.g. my-app)",
            default: "my-app"
          })

          const templateFromFlag = PROJECT_MANIFEST.templates.find((t) => t.subPath === options.template)

          const selectedTemplate = templateFromFlag
            ? templateFromFlag
            : yield* Prompt.select({
                message: "Select a template",
                choices: PROJECT_MANIFEST.templates.map((template) => ({
                  title: template.name,
                  value: template
                }))
              })

          yield* template.clone({
            cwd: options.cwd,
            name: projectName,
            repo: selectedTemplate
          })
        })
    }
  })
}) {}

function make(options: InitOptions) {
  const optionsLayer = Layer.succeed(CliOptions, { ...options, yes: true, stylingLibrary: undefined })
  return Effect.gen(function* () {
    const init = yield* Init

    return yield* init.run(options)
  }).pipe(
    Effect.provide(Init.Default),
    Effect.provide(Doctor.Default),
    Effect.provide(ProjectConfig.Default),
    Effect.provide(optionsLayer)
  )
}

export { make }
