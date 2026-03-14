import { all, cwd, overwrite, path, stylingLibrary, summary, template, yes } from "@cli/contexts/cli-options.js"
import * as Add from "@cli/services/commands/add.js"
import * as Doctor from "@cli/services/commands/doctor.js"
import * as Init from "@cli/services/commands/init.js"
import { Args, Command, Prompt } from "@effect/cli"
import { Effect, pipe } from "effect"

const addArgs = Args.all({
  components: Args.text({ name: "components" }).pipe(Args.repeated)
})

const AddCommand = Command.make("add", { args: addArgs, cwd, yes, overwrite, all, path, stylingLibrary })
  .pipe(Command.withDescription("Add React Native components to your project"))
  .pipe(Command.withHandler(Add.make))

const DoctorCommand = Command.make("doctor", { cwd, summary, yes })
  .pipe(Command.withDescription("Check your project setup and diagnose issues"))
  .pipe(Command.withHandler(Doctor.make))

const InitCommand = Command.make("init", { cwd, template })
  .pipe(Command.withDescription("Initialize a new React Native project with reusables"))
  .pipe(Command.withHandler(Init.make))

const Cli = Command.make("react-native-reusables/cli", { cwd })
  .pipe(Command.withDescription("React Native Reusables CLI - A powerful toolkit for React Native development"))
  .pipe(
    Command.withHandler((options) =>
      Effect.gen(function* () {
        yield* Effect.log("React Native Reusables CLI - A powerful toolkit for React Native development")
        const choice = yield* Prompt.select({
          message: "What would you like to do?",
          choices: [
            { title: "Add a component", value: "add" },
            { title: "Inspect project configuration", value: "doctor" },
            { title: "Initialize a new project", value: "init" }
          ]
        })

        if (choice === "add") {
          yield* Add.make({
            cwd: options.cwd,
            yes: true,
            overwrite: false,
            all: false,
            path: "",
            stylingLibrary: undefined,
            args: { components: [] }
          })
        } else if (choice === "doctor") {
          yield* Doctor.make({ cwd: options.cwd, summary: false, yes: false })
        } else if (choice === "init") {
          yield* Init.make({ cwd: options.cwd, template: "" })
        }
      })
    )
  )
  .pipe(Command.withSubcommands([AddCommand, DoctorCommand, InitCommand]))

export const run = () =>
  pipe(
    process.argv,
    Command.run(Cli, {
      name: "@react-native-reusables/cli",
      version: "1.0.0"
    })
  )
