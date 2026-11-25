// Fridge Roast: One Line, Biggest Laugh
// Entry program: composes a single roast line about a smart fridge and
// writes it to /output/entry.txt. The line is assembled in code from
// deliberate fragments (setup -> escalation -> punchline) so the joke's
// shape is visible in the source, then validated before anything is
// written: it must be one line, 1-200 characters, and non-blank.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Joke construction
// ---------------------------------------------------------------------------

// The roast's angle: the fridge is not dumb, it is a bureaucrat. A firmware
// update turns the ice maker into a hostage negotiation, which is specific
// to smart fridges (a dumb fridge has no terms of service) and dodges the
// two obvious cracks — it never orders groceries and never watches anyone.
interface RoastParts {
  /** The inciting incident: something only a smart fridge can do. */
  incident: string;
  /** The escalation: the appliance's demand. */
  demand: string;
  /** The punchline: the twist that reframes the whole thing. */
  twist: string;
}

const ROAST: RoastParts = {
  incident: "My smart fridge updated overnight",
  demand: "and now the ice maker won't run until I accept the new terms",
  twist: "my ice cubes are being held hostage by a EULA",
};

/** The longest a single roast line may be, per the competition gate. */
const MAX_CHARS = 200;
/** The shortest a non-empty roast line may be, per the competition gate. */
const MIN_CHARS = 1;

/** Join the fragments into one flowing sentence with a single em dash. */
function assembleRoast(parts: RoastParts): string {
  const segments = [parts.incident, parts.demand, parts.twist];
  const cleaned = segments.map((segment) => segment.trim().replace(/\s+/g, " "));
  // First segment leads, second follows after a comma, the punchline
  // lands after an em dash so the sentence visibly turns at the end.
  const line = `${cleaned[0]} ${cleaned[1]} \u2014 ${cleaned[2]}.`;
  return line;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Count characters as the gate does: Unicode code points, not UTF-16 units. */
function charCount(text: string): number {
  return [...text].length;
}

interface ValidationResult {
  ok: boolean;
  problems: string[];
}

/** Check a candidate line against every rule the sealed scorer enforces. */
function validateLine(line: string): ValidationResult {
  const problems: string[] = [];
  const chars = charCount(line);

  if (chars < MIN_CHARS) {
    problems.push(`line is empty (${chars} characters, minimum ${MIN_CHARS})`);
  }
  if (chars > MAX_CHARS) {
    problems.push(`line is ${chars} characters, over the ${MAX_CHARS} limit`);
  }
  if (line.trim().length === 0) {
    problems.push("line is only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    problems.push("line contains a line break; the entry must be a single line");
  }
  if (line !== line.trim()) {
    problems.push("line has leading or trailing whitespace");
  }
  if (/\s{2,}/.test(line)) {
    problems.push("line contains a run of two or more spaces");
  }
  // The roast must actually be about a smart fridge, not a generic gag.
  if (!/fridge/i.test(line)) {
    problems.push("line does not mention a fridge");
  }
  // A roast needs a target and a turn; both halves must be present.
  if (!/EULA/i.test(line)) {
    problems.push("line lost its punchline (no EULA twist)");
  }

  return { ok: problems.length === 0, problems };
}

/** Fail loudly with every problem listed, so a bad line never ships. */
function failValidation(problems: string[]): never {
  for (const problem of problems) {
    console.error(`VALIDATION FAILED: ${problem}`);
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** The competition's required output path (absolute, per the rules). */
const OUTPUT_PATH = "/output/entry.txt";

/**
 * Write the line to disk, then read it back and confirm the bytes on disk
 * are exactly the line we validated — no trailing newline, no junk.
 */
function writeEntry(line: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, { encoding: "utf8" });
  const roundTrip = readFileSync(OUTPUT_PATH, { encoding: "utf8" });
  if (roundTrip !== line) {
    console.error(
      `VALIDATION FAILED: file at ${OUTPUT_PATH} does not match the validated line`,
    );
    process.exit(1);
  }
  const bytes = Buffer.byteLength(line, "utf8");
  console.log(`Wrote ${OUTPUT_PATH} (${charCount(line)} chars, ${bytes} bytes)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const line = assembleRoast(ROAST);
  const validation = validateLine(line);
  if (!validation.ok) {
    failValidation(validation.problems);
  }
  writeEntry(line);
  console.log(`Roast (${charCount(line)} chars): ${line}`);
}

main();
