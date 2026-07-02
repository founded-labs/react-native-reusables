## Quality control checklist

The `quality_control` field in the output JSON must follow this structure:

```json
{
  "linting": { "eslint": bool, "eslint_config": "path", "run_command": "cmd", "fix_command": "cmd" },
  "formatting": { "prettier": bool, "prettier_config": "path", "run_command": "cmd" },
  "type_checking": { "typescript": bool, "strict_mode": bool, "run_command": "cmd" },
  "unit_tests": { "jest": bool, "jest_config": "path", "run_command": "cmd", "watch_command": "cmd", "coverage_command": "cmd" },
  "e2e_tests": { "detox": bool, "maestro": bool, "xctest": bool, "flutter_integration_test": bool },
  "feedback_loop_tools": { "metro_hot_reload": bool, "flutter_hot_reload": bool, "react_devtools": bool, "flipper": bool, "storybook": bool, "notes": "string" }
}
```

Look for these beyond the obvious lint/test configs, regardless of project type:

**Immediate feedback tools (agent can trigger during a task):**

- `tsc --noEmit` — instant type error feedback after edits (TypeScript projects)
- `eslint --fix` / `swiftlint` / `ktlint` — auto-fixable lint errors
- `jest --testPathPattern <file>` — single test file (JS/TS projects)
- `dart analyze` — static analysis (Flutter projects)
- `flutter test <file>` — single test file (Flutter projects)
- `yarn test --watch` / `flutter test --watch` — reactive test runner
- Metro hot reload (via `debugger-reload-metro` Argent tool, RN only)
- Flutter hot reload / hot restart

**Slower validation tools (agent runs at end of a task):**

- Full test suite run (`jest`, `flutter test`, `xcodebuild test`, `gradle test`)
- E2E: Detox, Maestro, XCUITest, Espresso, Flutter integration tests
- `eas build --local` / `flutter build` / `xcodebuild` for native validation

**Indicators to check (all project types):**

- `scripts/` directory at project root — often contains custom validation scripts
- `Makefile` / `Fastfile` targets — look for `lint`, `test`, `typecheck`, `check`, `validate`
- `package.json` scripts named `check`, `verify`, `ci`, `precommit`, `prepush`
- `.husky/` directory — which hooks run and what they execute
- `lint-staged` config — what runs on commit
- CI config files — the CI steps are ground truth for what "passing" means
- `Podfile` / `Package.swift` — iOS dependency management
- `build.gradle` / `build.gradle.kts` / `settings.gradle` / `settings.gradle.kts` — Android build config and flavor definitions (Groovy or Kotlin DSL)
- `pubspec.yaml` / `analysis_options.yaml` — Flutter project config and lint rules
