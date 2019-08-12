# electionSimulator

To set up environment run the following command

```sh
npm install --dev
```

To run unit tests run the following command

```sh
npm run test
```

To deploy to a spreadsheet, you must first ensure that you have installed [clasp](https://github.com/google/clasp)

Once clasp is installed run the following command

```sh
clasp login
```

Once you have logged in you can run one of the following commands to set up an apps project

```sh
clasp clone <sheet-id>               # if you wish to clone an existing apps script project, where <sheet-id> is the id of an the existing sheet
clasp create --type sheets           # if you want to create a new apps script project
clasp create --parent-id <sheet-id>  # if you want to link the project to an existing sheet, where <sheet-id> is the id of an the existing sheet
```

Once the project has been cloned / created, you can push the code using the following command

```sh
clasp push
```
