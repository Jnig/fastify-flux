import Enquirer from 'enquirer';
import { actionHandler } from './action';

(async () => {
  const enquirer = new Enquirer<{ template: string; name: string }>();
  const response = await enquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
    },
    {
      type: 'select',
      name: 'template',
      message: 'Which template should be used?',
      choices: ['prisma'],
    },
  ]);

  await actionHandler(response);
})();
