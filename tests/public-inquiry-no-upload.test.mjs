import assert from "node:assert/strict"
import {readFile} from "node:fs/promises"
import test from "node:test"

const guidance =
  "Have logo, reference design or size-chart files? Submit your inquiry first. After we reply, send the files by email or WhatsApp with your team or brand name."

const publicForms = [
  "components/forms/StructuredRfqForm.tsx",
  "components/forms/ContactForm.tsx",
]

for (const formPath of publicForms) {
  test(`${formPath} is text-only and preserves configured file follow-up paths`, async () => {
    const source = await readFile(new URL(`../${formPath}`, import.meta.url), "utf8")

    assert.doesNotMatch(source, /type\s*=\s*["']file["']/i)
    assert.doesNotMatch(source, /\b(?:logoFile|referenceFile|techPackFile)\b/)
    assert.match(source, new RegExp(guidance.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    assert.match(source, /\bpublicEmail\b/)
    assert.match(source, /\bwhatsappHref\b/)
  })
}

test("ContactForm does not append legacy Formspree attachment fields", async () => {
  const source = await readFile(
    new URL("../components/forms/ContactForm.tsx", import.meta.url),
    "utf8",
  )

  assert.doesNotMatch(
    source,
    /formData\.append\(\s*["'](?:logo_file|reference_design_file|size_chart_tech_pack_file)["']/,
  )
})
