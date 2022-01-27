export default {
    "presets": [
      [
        "@babel/preset-react",
        {
          "pragma": "(typeof View !== 'undefined' ? View.createElement : command.getView().createElement)", // default pragma is React.createElement (only in classic runtime)
          "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
          "throwIfNamespace": true, // defaults to true
          "runtime": "classic" // defaults to classic
          // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
        }
      ]
    ]
}