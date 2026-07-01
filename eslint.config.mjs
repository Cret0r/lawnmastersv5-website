import nextConfig from "eslint-config-next/core-web-vitals"

const config = [
  ...nextConfig,
  {
    settings: {
      react: { version: "19" },
    },
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
]

export default config
