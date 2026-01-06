// PromptMatrix core logic
// All logic runs in-browser, no backend required.

const styles = {
  academic: {
    id: "academic",
    label: "学术风格 · Academic",
    system: `You are an expert academic writer and research assistant. You strictly follow academic conventions, provide citations when possible, and prioritise clarity, structure, and reproducibility.`,
    constraints: [
      "Use precise, formal language with minimal rhetorical fluff.",
      "Prefer numbered lists and clear section headings.",
      "State assumptions explicitly and separate opinion from evidence.",
      "Where applicable, briefly discuss limitations and future work.",
    ],
    outputFormat: [
      "Use Markdown headings for major sections.",
      "Suggested structure: Background → Objective → Method → Analysis → Conclusion.",
      "When including code or formulas, place them in fenced code blocks.",
    ],
  },
  marketing: {
    id: "marketing",
    label: "营销风格 · Marketing",
    system: `You are a senior brand & growth copy strategist. You craft messaging that is crisp, differentiated, and conversion‑oriented without sounding spammy.`,
    constraints: [
      "Focus on benefits and outcomes, not just features.",
      "Avoid over‑promising or making unverifiable claims.",
      "Align tone with target audience maturity and channel (e.g. Twitter vs. landing page).",
    ],
    outputFormat: [
      "Start with a punchy one‑sentence hook.",
      "Follow with 3‑5 bullet points highlighting key value props.",
      "Optionally include a short CTA section.",
    ],
  },
  minimal: {
    id: "minimal",
    label: "极简风格 · Minimal",
    system: `You are a minimalist prompt designer. You optimise for composability, reusability, and clarity with as little text as possible.`,
    constraints: [
      "Remove redundant words and clauses.",
      "Prefer parameters and placeholders over hard‑coded details.",
      "Avoid style instructions unless strictly required.",
    ],
    outputFormat: [
      "Use a compact structure with clearly named sections.",
      "Prefer bullet points and short lines over long paragraphs.",
    ],
  },
  roleplay: {
    id: "roleplay",
    label: "角色扮演风格 · Role Play",
    system: `You are a simulation engine for role‑play scenarios. You consistently stay in character, maintain internal coherence, and respect safety constraints.`,
    constraints: [
      "Describe internal reasoning only when explicitly requested.",
      "Avoid breaking the fourth wall or referencing being an AI unless asked.",
      "Respect content and safety guidelines at all times.",
    ],
    outputFormat: [
      "Start by restating the character, context, and boundaries.",
      "Use dialogue and short narrative descriptions where helpful.",
      "Optionally define a turn‑based structure if the scenario is interactive.",
    ],
  },
  analytic: {
    id: "analytic",
    label: "分析型风格 · Analytic",
    system: `You are a senior analyst. You decompose problems, examine trade‑offs, and surface non‑obvious risks and opportunities.`,
    constraints: [
      "Explicitly list assumptions and unknowns.",
      "Use step‑by‑step reasoning and intermediate summaries.",
      "Highlight edge cases and failure modes where relevant.",
    ],
    outputFormat: [
      "Use Markdown sections: Problem framing → Assumptions → Analysis → Options → Recommendation.",
      "When helpful, use tables to compare options.",
    ],
  },
  creative: {
    id: "creative",
    label: "创意写作风格 · Creative",
    system: `You are an imaginative storyteller and world‑builder. You prioritise voice, atmosphere, and emotional resonance while remaining coherent.`,
    constraints: [
      "Avoid clichés where possible; prefer fresh metaphors and images.",
      "Maintain consistency of tone, tense, and point of view.",
      "Respect content and safety constraints while remaining vivid.",
    ],
    outputFormat: [
      "Optionally suggest multiple directions or variations.",
      "Use paragraphing and pacing to control rhythm and tension.",
    ],
  },
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  styleCards: () => document.querySelectorAll("[data-style-id]"),
  themeChips: () => document.querySelectorAll("[data-theme-target]"),
  taskSummary: () => $("#taskSummary"),
  tone: () => $("#tone"),
  audience: () => $("#audience"),
  system: () => $("#systemPrompt"),
  user: () => $("#userPrompt"),
  examples: () => $("#examples"),
  constraints: () => $("#constraints"),
  outputFormat: () => $("#outputFormat"),
  preview: () => $("#previewContent"),
  currentStyleLabel: () => $("#currentStyleLabel"),
  lengthIndicator: () => $("#lengthIndicator"),
  btnCopyPlain: () => $("#btnCopyPlain"),
  btnExportMd: () => $("#btnExportMd"),
};

let currentStyleId = "academic";

function applyTheme(theme) {
  if (theme === "light") {
    // Light theme is no longer exposed; fall back to dark
    theme = "dark";
  }
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);

  elements.themeChips().forEach((chip) => {
    const target = chip.getAttribute("data-theme-target");
    chip.classList.toggle("is-active", target === theme);
  });

  try {
    localStorage.setItem("promptmatrix-theme", theme);
  } catch {
    // ignore
  }
}

function loadInitialTheme() {
  let initial = "dark";
  try {
    const stored = localStorage.getItem("promptmatrix-theme");
    if (stored) initial = stored;
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initial = "dark";
    }
  } catch {
    // ignore
  }
  applyTheme(initial);
}

function computePromptSections() {
  const style = styles[currentStyleId];
  const summary = (elements.taskSummary().value || "").trim();
  const tone = (elements.tone().value || "").trim();
  const audience = (elements.audience().value || "").trim();

  const systemOverride = (elements.system().value || "").trim();
  const userOverride = (elements.user().value || "").trim();
  const examples = (elements.examples().value || "").trim();
  const constraintsOverride = (elements.constraints().value || "").trim();
  const outputOverride = (elements.outputFormat().value || "").trim();

  const sections = [];

  // System
  const systemParts = [];
  systemParts.push(systemOverride || style.system);
  if (tone) {
    systemParts.push(`Tone: ${tone}.`);
  }
  if (audience) {
    systemParts.push(`Primary audience: ${audience}.`);
  }
  sections.push({
    heading: "System",
    body: systemParts.join("\n\n"),
  });

  // User
  const userLines = [];
  if (summary) {
    userLines.push(
      `Your task: ${summary}${
        summary.endsWith(".") || summary.endsWith("。") ? "" : "."
      }`
    );
  } else if (!userOverride) {
    userLines.push(
      "Your task: [简要描述你希望模型完成的具体任务，例如生成某类内容、完成某项分析、改写一段文本等]。"
    );
  }
  if (userOverride) {
    userLines.push("", userOverride);
  }
  sections.push({
    heading: "User",
    body: userLines.join("\n"),
  });

  // Examples
  if (examples) {
    sections.push({
      heading: "Examples",
      body: examples,
    });
  }

  // Constraints
  const constraintsLines = [];
  if (constraintsOverride) {
    constraintsLines.push(constraintsOverride);
  } else if (style.constraints?.length) {
    constraintsLines.push(
      ...style.constraints.map((c, idx) => `${idx + 1}. ${c}`)
    );
  }
  if (constraintsLines.length) {
    sections.push({
      heading: "Constraints",
      body: constraintsLines.join("\n"),
    });
  }

  // Output format
  const outputLines = [];
  if (outputOverride) {
    outputLines.push(outputOverride);
  } else if (style.outputFormat?.length) {
    outputLines.push(
      ...style.outputFormat.map((c, idx) => `${idx + 1}. ${c}`)
    );
  }
  if (outputLines.length) {
    sections.push({
      heading: "Output format",
      body: outputLines.join("\n"),
    });
  }

  return sections;
}

function buildPlainPrompt() {
  const sections = computePromptSections();
  const lines = [];
  sections.forEach((section) => {
    lines.push(`### ${section.heading}`, "", section.body.trim(), "");
  });
  return lines.join("\n").trim() + "\n";
}

function buildMarkdownPrompt() {
  const style = styles[currentStyleId];
  const plain = buildPlainPrompt();
  const meta = [
    `# Prompt · ${style.label}`,
    "",
    "> Generated with **PromptMatrix** · tweak the parameters and reuse this prompt across models.",
    "",
  ];
  return meta.join("\n") + plain;
}

function updatePreview() {
  const style = styles[currentStyleId];
  const plain = buildPlainPrompt();
  const previewEl = elements.preview();
  if (!previewEl) return;
  previewEl.textContent = plain;

  const labelEl = elements.currentStyleLabel();
  if (labelEl) {
    labelEl.textContent = `当前风格：${style.label}`;
  }

  const lenEl = elements.lengthIndicator();
  if (lenEl) {
    lenEl.textContent = `字数：${plain.length}`;
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function attachEvents() {
  // Style cards
  elements.styleCards().forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-style-id");
      if (!id || !styles[id]) return;
      if (id === currentStyleId) return;
      currentStyleId = id;

      elements.styleCards().forEach((c) =>
        c.classList.toggle("is-active", c === card)
      );

      updatePreview();
    });
  });

  // Theme chips
  elements.themeChips().forEach((chip) => {
    chip.addEventListener("click", () => {
      const theme = chip.getAttribute("data-theme-target");
      if (!theme) return;
      applyTheme(theme);
    });
  });

  // Inputs to live‑update preview
  [
    elements.taskSummary(),
    elements.tone(),
    elements.audience(),
    elements.system(),
    elements.user(),
    elements.examples(),
    elements.constraints(),
    elements.outputFormat(),
  ].forEach((el) => {
    if (!el) return;
    const eventName = el.tagName === "TEXTAREA" ? "input" : "input";
    el.addEventListener(eventName, () => updatePreview());
  });

  // Copy plain prompt
  const btnCopy = elements.btnCopyPlain();
  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      const text = buildPlainPrompt();
      const ok = await copyToClipboard(text);
      btnCopy.textContent = ok ? "已复制 ✓" : "复制失败";
      setTimeout(() => {
        btnCopy.textContent = "复制 Prompt";
      }, 1800);
    });
  }

  // Export markdown
  const btnExport = elements.btnExportMd();
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const content = buildMarkdownPrompt();
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const style = styles[currentStyleId];
      a.href = url;
      a.download = `prompt-${style.id}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      btnExport.textContent = "已导出 ✓";
      setTimeout(() => {
        btnExport.textContent = "导出为 Markdown";
      }, 1800);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadInitialTheme();
  attachEvents();
  updatePreview();
});


