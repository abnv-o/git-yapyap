import Conf from "conf";

const config = new Conf({
  projectName: "git-yap",
  schema: {
    githubToken: {
      type: "string",
      default: "",
    },
    aiProvider: {
      type: "string",
      enum: ["openai", "gemini", "claude", "groq", "local"],
      default: "openai",
    },
    aiApiKey: {
      type: "string",
      default: "",
    },
    aiModel: {
      type: "string",
      default: "",
    },
    aiBaseUrl: {
      type: "string",
      default: "",
    },
  },
});

export function getConfig() {
  return {
    githubToken: config.get("githubToken"),
    aiProvider: config.get("aiProvider"),
    aiApiKey: config.get("aiApiKey"),
    aiModel: config.get("aiModel"),
    aiBaseUrl: config.get("aiBaseUrl"),
  };
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function isConfigured() {
  const cfg = getConfig();
  return !!(
    cfg.githubToken &&
    cfg.aiProvider &&
    (cfg.aiApiKey || cfg.aiProvider === "local")
  );
}

export function clearConfig() {
  config.clear();
}
