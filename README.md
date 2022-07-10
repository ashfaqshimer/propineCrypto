## Installation

1. Install package dependencies by running the following command in the root directory.

```bash
npm install
```

2. Create a folder called `\_data` in the root directory and move the `transactions.csv` file into it.

3. Create a `.env` file and populate the values for the relevant keys. These can be obtained from the `.env.sample` file.

&nbsp;

## Usage

- Run the program using either

```bash
npm run portfolio
```

or

```bash
node index.js
```

- Pass the arguments by adding `--token=<tokenValue>` and/or `--date=<dateValue>`. If the `npm run portfolio` command is used, then an additional `--` should be inserted before passing the arguments.

  Example:

```bash
npm run portfolio -- --token=BTC --date=07/10/2022
```

- Note that the date should be entered in the format `mm/dd/yyyy`. The token is case sensitive.

&nbsp;

## Key Decisions

- Since there are no operations or tasks that have to be carried out while the CSV data is being read, a synchronized approach is chosen with the csv-parser package, over an async approach with something like 'neat-csv'

- As there are a lot of operations related to the portfolio, these have been modularized and abstracted into its own util file.

- The API Key is sensitive and hence is stored in an env var.

- The Crypto Compare URL and API key was initially stored in an env variable. For the URL it provides better control if the URL is subject to change based on the domain (eg. a production only URL vs a sandbox URL). However, since there is no requirement for this at the moment, it is hard coded in the service request.

- A service file is created for organizing and managing third party API calls.

- The index file (starting point) is kept clean and simple, with the business logic abstracted. This will allow for better maintainability and scalability of the application since new combinations of commands can be added, without having to change the current flow of operations.

- For the portfolio calculations, these are performed while the data is parsed from the CSV rather than seperating the operations by first parsing and then calculating the respective portfolio values. This makes the application more performant since there is no need to loop through the data multiple times.

- Validation checks are added to minimize the chance of running the application with invalid inputs. This is added before parsing the CSV to improve the performance by avoiding unnecessary file parsing.

- Since the date format is not specified, a strict format is enforced for the input. (i.e. mm/dd/yyyy)

- The path to the transaction file is maintained as a constant, which allows the path to only be updated once if the location of the file has to be changed.
