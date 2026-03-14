import { Options } from "@effect/cli"
import { Context, Option } from "effect"

type StylingLibrary = "nativewind" | "uniwind"

class CliOptions extends Context.Tag("CommandOptions")<
  CliOptions,
  Readonly<{
    cwd: string
    yes: boolean
    stylingLibrary: StylingLibrary | undefined
  }>
>() { }

const cwd = Options.directory("cwd", { exists: "yes" }).pipe(Options.withDefault("."), Options.withAlias("c"))
const yes = Options.boolean("yes", { aliases: ["y"] })
const summary = Options.boolean("summary").pipe(Options.withAlias("s"))
const overwrite = Options.boolean("overwrite", { aliases: ["o"] })
const all = Options.boolean("all", { aliases: ["a"] })
const path = Options.text("path").pipe(Options.withDefault(""), Options.withAlias("p"))
const stylingLibrary = Options.choice("styling-library", ["nativewind", "uniwind"] as const).pipe(
  Options.optional,
  Options.map(Option.getOrUndefined),
  Options.withDescription("Override the detected styling library for this command"),
)
const template = Options.text("template").pipe(Options.withAlias("t"), Options.withDefault(""))

export { CliOptions, cwd, summary, yes, overwrite, all, path, stylingLibrary, template }
export type { StylingLibrary }
