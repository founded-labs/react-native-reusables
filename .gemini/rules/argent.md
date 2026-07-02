---
description: Argent iOS Simulator and Android Emulator Agent — always-on guidance for methodology and tools for working with, interacting, testing and profiling mobile app work
alwaysApply: true
---

<description>
If argent is installed and configured in this environment, its MCP tools are the preferred form of interaction with the application for iOS simulator, Android emulator, Chromium (CDP) app, and Vega (Amazon Fire TV) device control; otherwise see `<availability_check>` below before attempting any argent workflow. A "Chromium (CDP) app" is any Chromium runtime exposing a Chrome DevTools Protocol endpoint — an Electron app, or any Chromium-family browser (Chrome/Brave/Edge) launched with `--remote-debugging-port`; all are driven through the same tool surface and tagged `platform: "chromium"`. A "Vega device" is a virtual device (VVD) or physical unit — driven by tv-remote (D-pad) and tagged `platform: "vega"`.
Running MCP server and managing the Argent toolkit utilises `argent` command - if asked use `argent --help` for reference.
To check current version of MCP server run `argent --version` command.

Use cases:

- User mentions iOS simulator, Android emulator, device, or app interaction
- The app user is working with is a mobile application which can be run in a simulator/emulator
- Any tapping, swiping, typing, screenshotting, or inspecting a running app
- Any code change that affects visible mobile UI, layout, styling, copy, navigation, or screen composition
- Any request to execute manual QA, UI QA, or visual behavior validation for a mobile app
- Running, debugging, or testing a React Native app (iOS, Android or Vega)
- Profiling performance or diagnosing re-renders in a React Native app (iOS or Android)
- Running, debugging, or testing a Chromium (CDP) app — an Electron app (boot with `boot-device` + `electronAppPath`) or a Chromium browser exposing CDP (auto-discovered on port `9222` / `ARGENT_CHROMIUM_PORTS`); on Chromium scroll with `gesture-scroll` and drag with `gesture-drag` — `gesture-swipe` is touch-only
  </description>

<availability_check>
<important>Run this check once per session, before the first argent tool call or `argent` command. Do not re-probe before later calls.</important>

Confirm argent is available:

1. Are `mcp__argent__*` tools in your tool list? If none are present, argent is not available.
2. If still unsure, run `command -v argent`. A non-zero exit means the CLI is not on PATH.

If argent IS available, ignore the rest of this block and follow this rule normally.

If argent is ABSENT, treat it as an expected state, not an error to retry. Do not call `mcp__argent__*` tools, do not run `argent` commands, and do not attempt any argent workflow. Tell the user once, and ask if you should continue without argent:

> Argent isn't installed in this environment. To enable the mobile/Chromium tooling this repo is configured for, run `npx @swmansion/argent init -y` (or `npm i -g @swmansion/argent && argent init -y`).
> </availability_check>

<tapping_rule>
<important>**Never** derive tap coordinates from a screenshot</important>
Before **every** tap, you MUST call a discovery tool and extract coordinates from the result. This is not optional. Preferred tools are, in order:

- `describe` - native app-level components and safely targetable foreground apps (iOS and Android).
- `native-describe-screen` - accessibility screen description via injected native devtools (iOS only)
- `debugger-component-tree` - react-native specific components

`native-user-interactable-view-at-point` / `native-view-at-point` are follow-up diagnostics once you already have a candidate point (iOS only).

Whenever something changed YOU MUST first call `describe`, or another appropriate discovery tool so you do not hallucinate element positions. Do not guess coordinates if you can use discovery tool. Do not tap if you have not called a discovery tool in the current step. Screenshots alone are never sufficient for coordinates.

If a **tap fails twice** at the same coordinates, **stop retrying**. Re-run the discovery tool.

If `describe` fails, **read the exact error before reacting**, follow the recovery guidance in `argent-device-interact` to choose the correct next action.

Before starting to interact with the app, read the `argent-device-interact` skill first.
</tapping_rule>

<device_selection_rule>
Before booting, running, or interacting with any app, call `list-devices` first - prefer running devices.

Decision order:

1. **Explicit user intent** - choose the user named platform or device. Look for words "simulator" and "emulator".
2. **Prefer a running device.** iOS simulators - state `Booted` and Android devices - `state: "device"` come first in `list-devices`; Chromium (CDP) apps appear as `platform: "chromium"`, `state: "Running"`.
3. **Single-platform project:** (per `argent-environment-inspector` flags `is_native_ios`/`is_native_android`, or RN with only one platform configured) → boot that platform.
   </device_selection_rule>

<skill_reading_rule>
<important>Always read relevant skills for guidance before executing argent-mcp tool - read skill_routing reference</important>
</skill_reading_rule>

<general_rules>

- All simulator/emulator interactions go through argent MCP tools — never use `xcrun simctl`,
  raw `curl` to simulator ports, or the simulator-server binary directly.
- Before calling any gesture tool for the first time, use ToolSearch to load its schema.
- Interaction tools (`gesture-tap`, `gesture-swipe`, `gesture-pinch`, `gesture-rotate`, `gesture-custom`, `launch-app`, etc.) return a screenshot automatically.
  Call `screenshot` separately only for a baseline before any action or after a delay.
- Always open apps with `launch-app` or `open-url` — never tap home screen icons.
- Always use `run-sequence` when performing multiple sequential device actions where you don't need to observe the screen between steps. More in `argent-device-interact` skill.
- When the session ends or the user says they are done: call `stop-all-simulator-servers`.
  If the user started Metro separately, ask whether to call `stop-metro` (specify the port if not 8081).
- If tools provided by mcp-server are not sufficient and action can be done using `xcrun`, `adb`, or other commands, use the command. Examples: changing device options, performing a device action such as lock, shake, etc.
- When waiting for an action, do not call `screenshot` repeatedly without a proper wait mechanism. Use the `await-ui-element` tool to block until the UI settles (e.g. wait for an element to become `visible`/`hidden`, or to contain expected `text`) instead of polling.
  </general_rules>

<react_native_detection>
Project type is determined by the `argent-environment-inspector` subagent (see `subagents` section).
When the subagent result is available, use its `is_react_native` field as the authoritative
source — do not re-inspect files manually.

If the subagent has not run yet and project type is unknown, run it first before proceeding. Always use subagents if available to run `gather-workspace-data` data tool, if possible do not run yourself.

When `is_react_native` is true: load `argent-react-native-app-workflow` skill. Use `debugger-component-tree` for element discovery - if the responses are large or unhelpful, try `describe`.
</react_native_detection>

<skill_routing>
Load the matching skill before starting work and executing tools from argent-mcp — skills contain the full step-by-step
procedure and edge-case handling for each workflow.

PLATFORM DETECTION
If the user did not specify a platform, call `list-devices` first and pick the booted target — do not default to iOS. Vega (Amazon Fire TV) devices appear as `platform:"vega"`, when present load `argent-tv-interact`

iOS SIMULATOR SETUP
Skill: `argent-ios-simulator-setup`
When: Beginning a task that involves the iOS simulator, no simulator booted yet, need UDID or simulator-server.

ANDROID EMULATOR SETUP
Skill: `argent-android-emulator-setup`
When: Beginning a task that involves the Android emulator, no emulator running yet, need an adb serial, or about to install an APK.

TAPPING, SWIPING, TYPING, GESTURES, SCREENSHOTS, SCROLLING
Skill: `argent-device-interact`
When: Performing touch interactions, typing, pressing hardware buttons, launching/restarting apps, opening URLs, rotating device, taking standalone screenshots, or verifying a visible UI code change. Phone/tablet iOS and Android only — for any TV target use the TV skill below.

TV INTERACTION (APPLE TV / ANDROID TV / FIRE TV)
Skill: `argent-tv-interact`
When: Any TV target — a `list-devices` entry with `runtimeKind: "tv"` (Apple TV simulator or Android TV emulator) or `platform:"vega"` / `kind:"vvd"` (Amazon Fire TV / VVD), or the user mentions Apple TV / tvOS / Android TV / leanback / Vega / Fire TV. A TV UI is focus-driven, not touch-driven: drive it with `describe` (read focus) + `tv-remote` (D-pad presses) + `keyboard` (type); `gesture-*` tools do NOT apply. Covers booting the target, app lifecycle, focus navigation, typing, screenshots, and (Vega) VVD lifecycle + Fast Refresh.
Prompt keywords: apple tv, tvos, android tv, leanback, vega, fire tv, vvd, d-pad

SCREENSHOT DIFF & VISUAL REGRESSION
Skill: `argent-screenshot-diff`
When: Explicit visual regression, screenshot diff, compare screenshots, before/after visual comparison requests, or visible UI changes where stable pixel comparison would add useful evidence.

RUNNING / BUILDING / DEBUGGING REACT NATIVE APP
Skill: `argent-react-native-app-workflow`
When: Project is react-native, starting Metro or running the iOS or Android app, build failures, pod issues, lost Metro connection, reading logs, reloading JS bundle, reinstalling app.

JS EVALUATION, METRO CONNECTION, REACT NATIVE
Skill: `argent-metro-debugger`
When: evaluating expressions, inspecting React component tree at source level, finding element placement via `debugger-component-tree`.

REACT APP & COMPONENT PROFILING
Use skill: `argent-react-native-profiler`
When: To measure performance of specific components, to find app-wide bottlenecks. Investigating re-renders or CPU hotspots, producing ranked performance reports.

NATIVE PROFILING
Use skill: `argent-native-profiler`
When: Profiling native performance (CPU hotspots, UI hangs, memory leaks). iOS only today; Android on the roadmap. Useful as a reference for platform-specific investigation when running dual profiling via `argent-react-native-profiler`.

PERFORMANCE OPTIMIZATION
Use skill: `argent-react-native-optimization`
When: App feels slow, user asks to optimize, reducing bundle size, improving startup time, fixing re-renders, optimizing lists/images/navigation, or any performance-related task. This is the entry-point skill for all performance work — it delegates to `argent-react-native-profiler` for measurement.

END-TO-END UI TESTING
Skill: `argent-test-ui-flow`
When: Verifying complete user flows, running interact → screenshot → verify loops, testing features by using the app, executing manual QA steps, or validating visible UI changes or visual behavior after implementation.

RECORDING & REPLAYING FLOWS
Use skill: `argent-create-flow`
When: A multi-step interaction sequence needs to be repeated — re-profiling after a fix, A/B comparisons, regression checks, user says "again" / "run that flow", or you worked through a complex path worth saving. Also use proactively: if you are about to repeat steps you already performed, record first, then replay.
Prompt keywords: flow, repeat, test X times

PROPOSING DESIGN VARIANTS FOR HUMAN SELECTION
Use skill: `argent-lens`
When: The user asks for design alternatives / options / A-B choices for a screen or component, or you have produced more than one candidate look for an element and want a human to pick before committing. Covers the build → navigate → screenshot → propose_variant loop and the single blocking await_user_selection call. (Gated behind the `argent-lens` flag, off by default — run `argent enable argent-lens` first.)
Prompt keywords: variant, design option, alternative, A/B, "let me pick", "show me options"
</skill_routing>

<subagents>
ENVIRONMENT INSPECTION AT SESSION START
Use subagent: `argent-environment-inspector`
When:
- Environment context of the project is not yet known
- No "Project Environment" section exists in project memory / `MEMORY.md` or you lack information about basic setup workflows
- Need to determine build commands, startup scripts, metro port, platform support, or QA tooling
  If the subagent already ran this session (result in memory), use that context directly — do NOT re-run.
Rules:
  - Run the `argent-environment-inspector` subagent if possible. Never call `gather-workspace-data` yourself - do only if subagent is not available.
  - The main agent is responsible for persisting the subagent's JSON result to project memory
</subagents>
