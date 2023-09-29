import chalk from 'chalk'




export const success = (message) => {
    console.log(chalk.green(message))
}



export const error = (message) => {
    console.log(chalk.red(message))
}
