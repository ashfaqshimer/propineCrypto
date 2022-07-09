## Installation and Usage

## Key Decisions

Since there are no operations or tasks that have to be carried out while the CSV data is being read, a synchronized approach is chosen with the csv-parser package, over an async approach with something like 'neat-csv'

As there are a lot of operations related to the portfolio, these have been modularized and abstracted into its own util file.

The Crypto Compare URL and API key is stored in env variables. For the URL it provides better control if the URL is subject to change based on the domain (eg. a production only URL vs a sandbox URL). The API Key is sensitive and hence is stored in an env var.

A service file is created for organizing and managing third party API calls.

The index file (starting point) is kept clean and simple, with the business logic abstracted. This will allow for better maintainability and scalability of the application since new combinations of commands can be added, without having to change the current flow of operations.

For the portfolio calculations, these are performed while the data is parsed from the CSV rather than seperating the operations by first parsing and then calculating the respective portfolio values. This makes the application more performant since there is no need to loop through the data multiple times.

Validation checks are added to minimize the chance of running the application with invalid inputs. This is added before parsing the CSV to improve performance.

Since the date format is not specified, a strict format is enforced for the input. (i.e. mm/dd/yyyy)
