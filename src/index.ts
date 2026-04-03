import * as tailwindcss from "tailwindcss";
import { Instrumentation } from "./instrumentation";
import index from "tailwindcss/index.css?raw";
import preflight from "tailwindcss/preflight.css?raw";
import theme from "tailwindcss/theme.css?raw";
import utilities from "tailwindcss/utilities.css?raw";

export type CompilerOptions = {
  useLayer?: boolean;
  usePreflight?: boolean;
};

const I = new Instrumentation();

async function createCompiler({
  usePreflight = false,
  useLayer = false,
}: CompilerOptions) {
  I.start("Create compiler");
  let css = "";

  if (usePreflight && useLayer) {
    css += index;
  } else {
    css += useLayer
      ? `@layer properties; @layer theme, base, components, utilities;\n`
      : "";
    css += usePreflight ? `${preflight}\n` : "";
    css += useLayer ? `@layer theme {${theme}}\n` : `${theme}\n`;
    css += useLayer ? `@layer utilities {${utilities}}\n` : `${utilities}\n`;
  }

  I.start("Compile CSS");
  try {
    return await tailwindcss.compile(css);
  } finally {
    I.end("Compile CSS");
    I.end(`Create compiler`);
  }
}

export async function compiler(options?: CompilerOptions) {
  const { useLayer, usePreflight } = options ?? {};

  const classesSet = new Set<string>();

  const compiler = await createCompiler({
    useLayer,
    usePreflight,
  });

  let lastContent: string | undefined = undefined;

  let queue = Promise.resolve<string | undefined>(undefined);

  async function build(classes: string[]) {
    return (queue = queue.then(() => {
      if (classes.length === 0) {
        return lastContent;
      }

      I.start(`Collect classes`);

      const newClasses: string[] = [];
      if (classes.length) {
        classes.forEach((c) => {
          if (!classesSet.has(c)) {
            classesSet.add(c);
            newClasses.push(c);
          }
        });
      }

      I.end(`Collect classes`, {
        count: newClasses.length,
      });

      if (newClasses.length === 0) {
        return lastContent;
      }

      I.start(`Build utilities`);
      lastContent = compiler.build(newClasses);
      I.end(`Build utilities`);
      return lastContent;
    }));
  }

  return build;
}
