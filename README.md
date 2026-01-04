# LeetCode On The Go Chrome Extension

This Chrome extension allows you to solve LeetCode problems by writing solutions in English. It uses OpenAI's GPT models to convert your natural language instructions into Python 3 code and inserts it directly into the LeetCode editor.

## Features

- **Natural Language to Code**: Describe your logic in English, get Python code.
  ![code-generation-1](assets/readme/code-generation-1.png)
- **Chat History**: Maintains a conversation history per problem so you can refine your solution iteratively.
  ![update-code-1](assets/readme/update-code-1.png)
- **Test Case Generation**: Evaluates your existing code snippet. If the logic appears incorrect, it generates a single failing test case to help you debug.
  ![test-generation-1](assets/readme/test-generation-1.png)
  ![test-generation-2](assets/readme/test-generation-2.png)

## Usage

1.  Navigate to any LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`).
2.  A floating panel "English to Code" will appear in the bottom right.
3.  Type your solution logic in the text area.
    - Example: "Create a hash map to store the complement of each number. Iterate through the array, check if complement exists, if so return indices."
4.  Click **Code**.
5.  The extension will generate the Python code and replace the content in the LeetCode editor.
6.  You can continue the conversation to fix bugs or optimise the solution.

## For developers

### Install local copy

1.  Clone or download this repository.
2.  Build the repository: `npm run build`
3.  Open Chrome and navigate to `chrome://extensions/`.
4.  Enable **Developer mode** in the top right corner.
5.  Click **Load unpacked**.
6.  Select the `dist/src/` folder

### File description

- `src/manifest.json`: Extension configuration.
- `src/background.ts`: Handles asynchronous requests.
- `src/llm.ts`: Handles OpenAI API requests.
- `src/content.ts`: Injects UI and interacts with the page.
- `src/injected.ts`: Interacts with the Monaco editor.
- `src/options.html`: Settings page.

## Running tests

### Code generation

```bash
npx promptfoo@0.119.14 eval -c promptfoo/code/promptfooconfig.yaml --no-cache
```

### Test generation

```bash
npx promptfoo@0.119.14 eval -c promptfoo/test/promptfooconfig.yaml --no-cache
```

### View logs

Add a `--verbose` flag. For example,

```bash
npx promptfoo@0.119.14 eval -c promptfoo/code/promptfooconfig.yaml --no-cache --verbose
```

### View results in browser

```bash
npx promptfoo@0.119.14 view
```
