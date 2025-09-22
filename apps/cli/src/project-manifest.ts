interface FileCheck {
  name: string
  fileNames: Array<string>
  docs: string
  includes: Array<{
    content: Array<string>
    message: string
    docs: string
  }>
}

type CustomFileCheck = Omit<FileCheck, "fileNames"> & { defaultFileNames?: ReadonlyArray<string> }

interface FileWithContent extends FileCheck {
  content: string
}

interface MissingInclude {
  fileName: string
  content: ReadonlyArray<string>
  message: string
  docs: string
}

const DEPENDENCIES = [
  "expo",
  "nativewind",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge"
]

const DEV_DEPENDENCIES = ["tailwindcss@^3.4.17"]

const FILE_CHECKS: Array<FileCheck> = [
  {
    name: "Babel Config",
    fileNames: ["babel.config.js", "babel.config.ts"],
    docs: "https://www.nativewind.dev/docs/getting-started/installation#3-add-the-babel-preset",
    includes: [
      {
        content: ["nativewind/babel", "jsxImportSource"],
        message: "jsxImportSource or nativewind/babel is missing",
        docs: "https://www.nativewind.dev/docs/getting-started/installation#3-add-the-babel-preset"
      }
    ]
  },
  {
    name: "Metro Config",
    fileNames: ["metro.config.js", "metro.config.ts"],
    docs: "https://www.nativewind.dev/docs/getting-started/installation#4-create-or-modify-your-metroconfigjs",
    includes: [
      {
        content: ["withNativeWind("],
        message: "The withNativeWind function is missing",
        docs: "https://www.nativewind.dev/docs/getting-started/installation#4-create-or-modify-your-metroconfigjs"
      },
      {
        content: ["inlineRem", "16"],
        message: "The 'inlineRem: 16' is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#update-the-default-inlined-rem-value"
      }
    ]
  },
  {
    name: "Root Layout",
    fileNames: ["app/_layout.tsx", "src/app/_layout.tsx"],
    docs: "https://reactnativereusables.com/docs/installation/manual#add-the-portal-host-to-your-root-layout", //
    includes: [
      {
        content: [".css"],
        message: "The css file import is missing",
        docs: "https://www.nativewind.dev/docs/getting-started/installation#5-import-your-css-file"
      },
      {
        content: ["<PortalHost"],
        message: "The PortalHost component is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#add-the-portal-host-to-your-root-layout"
      }
    ]
  }
]

const DEPRECATED_FROM_LIB = [
  {
    name: "Icons",
    fileNames: ["icons/iconWithClassName.ts"],
    includes: [
      {
        content: ["iconWithClassName"],
        message: "lib/icons and its contents are deprecated. Use the new icon wrapper from components/ui/icon.",
        docs: "https://reactnativereusables.com/docs/changelog#august-2025-deprecated"
      }
    ]
  },
  {
    name: "Constants",
    fileNames: ["constants.ts"],
    includes: [
      {
        content: ["NAV_THEME"],
        message: "Usage of lib/constants for NAV_THEME is deprecated. Use lib/theme instead.",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      }
    ]
  },
  {
    name: "useColorScheme",
    fileNames: ["useColorScheme.tsx"],
    includes: [
      {
        content: ["useColorScheme"],
        message: "lib/useColorScheme is deprecated. Use Nativewind's color scheme hook instead.",
        docs: "https://www.nativewind.dev/docs/api/use-color-scheme"
      }
    ]
  }
]

const DEPRECATED_FROM_UI = [
  {
    name: "Typography",
    fileNames: ["typography.tsx"],
    includes: [
      {
        content: [
          "function H1({",
          "function H2({",
          "function H3({",
          "function H4({",
          "function P({",
          "function BlockQuote({",
          "function Code({",
          "function Lead({",
          "function Large({",
          "function Small({",
          "function Muted({"
        ],
        message:
          "Typography is deprecated. Instead, use the Text component with its variant prop (e.g. <Text variant='h1'>Title</Text>)",
        docs: "https://reactnativereusables.com/docs/components/text#typography"
      }
    ]
  }
]

// Excludes foreground colors since it is formatted differently in all 3 styling files (tailwind config, global.css, theme.ts)
const CSS_VARIABLE_NAMES = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "input",
  "ring",
  "radius"
]

const CUSTOM_FILE_CHECKS = {
  tailwindConfig: {
    name: "Tailwind Config",
    defaultFileNames: ["tailwind.config.js", "tailwind.config.ts"],
    docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles",
    includes: [
      {
        content: ["nativewind/preset"],
        message: "The nativewind preset is missing",
        docs: "https://www.nativewind.dev/docs/getting-started/installation#2-setup-tailwind-css"
      },
      {
        content: CSS_VARIABLE_NAMES,
        message: "At least one of the color css variables is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      }
    ]
  },
  theme: {
    name: "Theme",
    defaultFileNames: ["lib/theme.ts"],
    docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles",
    includes: [
      {
        content: CSS_VARIABLE_NAMES,
        message: "At least one of the color variables is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      },
      {
        content: ["NAV_THEME"],
        message: "The NAV_THEME is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      }
    ]
  },
  nativewindEnv: {
    name: "Nativewind Env",
    docs: "https://www.nativewind.dev/docs/getting-started/installation#7-typescript-setup-optional",
    includes: [
      {
        content: ["nativewind/types"],
        message: "The nativewind types are missing",
        docs: "https://www.nativewind.dev/docs/getting-started/installation#7-typescript-setup-optional"
      }
    ]
  },
  utils: {
    name: "Utils",
    defaultFileNames: ["lib/utils.ts"],
    docs: "https://reactnativereusables.com/docs/installation/manual#add-a-cn-helper",
    includes: [
      {
        content: ["function cn("],
        message: "The cn function is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#add-a-cn-helper"
      }
    ]
  },
  css: {
    name: "CSS",
    defaultFileNames: ["globals.css", "src/global.css"],
    docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles",
    includes: [
      {
        content: ["@tailwind base", "@tailwind components", "@tailwind utilities"],
        message: "The tailwind layer directives are missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      },
      {
        content: CSS_VARIABLE_NAMES,
        message: "At least one of the color css variables is missing",
        docs: "https://reactnativereusables.com/docs/installation/manual#configure-your-styles"
      }
    ]
  }
}

const NATIVEWIND_ENV_FILE = "nativewind-env.d.ts"

const COMPONENTS = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "button",
  "card",
  "checkbox",
  "collapsible",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "hover-card",
  "input",
  "label",
  "menubar",
  "popover",
  "progress",
  "radio-group",
  "select",
  "separator",
  "skeleton",
  "switch",
  "tabs",
  "text",
  "textarea",
  "toggle-group",
  "toggle",
  "tooltip"
]

const TEMPLATES = [
  {
    name: "Minimal",
    url: "https://github.com/founded-labs/react-native-reusables-templates.git",
    subPath: "minimal"
  },
  {
    name: "Clerk auth",
    url: "https://github.com/founded-labs/react-native-reusables-templates.git",
    subPath: "clerk-auth"
  }
]

const PROJECT_MANIFEST = {
  dependencies: DEPENDENCIES,
  devDependencies: DEV_DEPENDENCIES,
  fileChecks: FILE_CHECKS,
  deprecatedFromLib: DEPRECATED_FROM_LIB,
  deprecatedFromUi: DEPRECATED_FROM_UI,
  customFileChecks: CUSTOM_FILE_CHECKS,
  nativewindEnvFile: NATIVEWIND_ENV_FILE,
  components: COMPONENTS,
  templates: TEMPLATES
}

export { PROJECT_MANIFEST }
export type { FileCheck, CustomFileCheck, FileWithContent, MissingInclude }
