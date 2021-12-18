import chalk from 'chalk';

export function log(options: {
  component: string;
  success?: string;
  warning?: string;
  error?: string;
  details?: string;
  logFunction?: (message: string) => void;
}) {
  let logFunction = console.log;

  if (options && options.logFunction) {
    logFunction = options.logFunction;
  }

  let output = `${chalk.dim(new Date().toLocaleTimeString())} `;
  output += chalk.cyan.bold(`[${options.component}]`.padEnd(7, ' ')) + ' ';

  const { success, error, warning } = options;
  if (success) {
    output += `${chalk.green(success)} `;
  } else if (error) {
    output += `${chalk.red(error)} `;
  } else if (warning) {
    output += `${chalk.magenta(warning)} `;
  }

  if (options.details) {
    output += chalk.dim(options.details);
  }

  logFunction(output);
}
