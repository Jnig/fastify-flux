import path from 'path';
import fs from 'fs-extra';

async function updatePackageJson(file: string, options: { name: string }) {
  const content = await fs.readJSON(file);

  if (options.name) {
    content.name = options.name;
  }

  const version = process.env.version;
  content.dependencies['@fluxapi/common'] = version;
  content.dependencies['@fluxapi/plugins'] = version;
  content.devDependencies['@fluxapi/cli'] = version;

  await fs.writeJSON(file, content, { spaces: 2 });
}

export async function actionHandler(options: {
  name: string;
  template: string;
}) {
  let source = path.join(__dirname, `/template-${options.template}/`);
  if (!(await fs.pathExists(source))) {
    source = path.join(
      __dirname,
      `/../../../playground/template-${options.template}/`,
    );
  }

  const target = path.join(process.cwd(), options.name);
  await fs.copy(source, target, {
    recursive: true,
  });

  await updatePackageJson(path.join(target, 'package.json'), options);

  console.log(`
Creating project in ${target}...

Done. Now run:

  cd ${options.name}
  npm install
  npm run prisma migrate deploy
  npm run dev
`);
}
