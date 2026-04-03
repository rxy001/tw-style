export class Instrumentation {
  start(label: string) {
    performance.mark(`${label} (start)`);
  }

  end(label: string, detail?: any) {
    performance.mark(`${label} (end)`);

    performance.measure(label, {
      start: `${label} (start)`,
      end: `${label} (end)`,
      detail,
    });
  }
}
