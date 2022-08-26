import chalk from 'chalk';

function abort(message: string): never {
    console.log(chalk.yellowBright(message));
    process.exit();
}

export default abort;
