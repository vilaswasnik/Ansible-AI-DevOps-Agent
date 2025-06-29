#!/bin/bash
# setup_new_shellscript.sh

SHELL_DIR="./public/scripts/shell_scripts"
JS_DIR="./public/scripts/shell_scripts_js"
AIAGENT="./public/scripts/aiagent.js"
TRAININGDATA="./public/trainingData.json"

echo "Enter the name of your new shell script (without .sh, e.g., myscript):"
read SCRIPT_NAME

SH_FILE="$SHELL_DIR/${SCRIPT_NAME}.sh"
JS_FILE="$JS_DIR/${SCRIPT_NAME}.js"
FUNC_NAME="execute${SCRIPT_NAME}script"

if [ ! -f "$SH_FILE" ]; then
  echo "ERROR: $SH_FILE does not exist. Please create your shell script first at $SH_FILE."
  exit 1
fi

# 1. Create the JS wrapper (hello2.js style)
cat > "$JS_FILE" <<EOF
let isCancelled = false;

function $FUNC_NAME(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }
    addMessage("Executing ${SCRIPT_NAME}.sh script...", 'bot');
    fetch('/run-shellscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptPath: '${SCRIPT_NAME}.sh' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            addMessage(\`Error executing script: \${data.error}\`, 'bot');
        } else {
            addMessage(\`Script executed successfully: \${data.output}\`, 'bot');
        }
    })
    .catch(error => {
        console.error('Error executing script:', error);
        addMessage(\`Error: \${error.message}\`, 'bot');
    });
}
export { $FUNC_NAME };
EOF
echo "Created $JS_FILE"

# 2. Update aiagent.js (import and respondToUser)
IMPORT_LINE="import { $FUNC_NAME } from './shell_scripts_js/${SCRIPT_NAME}.js';"

# Insert import if not present (exact match)
if ! grep -q "import { $FUNC_NAME } from './shell_scripts_js/${SCRIPT_NAME}.js';" "$AIAGENT"; then
    sed -i "/^import /a $IMPORT_LINE" "$AIAGENT"
    echo "Added import to aiagent.js"
else
    echo "Import already present in aiagent.js"
fi

# Remove any existing handler for this script to avoid duplicates or malformed blocks
sed -i "/else if (userMessage === \"execute ${SCRIPT_NAME}.sh\") {/,/^}/d" "$AIAGENT"

# Insert usage block in respondToUser (directly after hello2.sh block, with correct formatting)
awk -v handler="        } else if (userMessage === \"execute ${SCRIPT_NAME}.sh\") {\n            $FUNC_NAME(addMessage);" '
    BEGIN {inserted=0}
    {
        print $0
        if (!inserted && $0 ~ /else if \(userMessage === "execute hello2\.sh"\)/) {
            getline; print $0  # print the next line (the function call)
            print handler      # insert the new handler right after
            inserted=1
            next
        }
    }
' "$AIAGENT" > "${AIAGENT}.tmp" && mv "${AIAGENT}.tmp" "$AIAGENT"
echo "Added usage block to respondToUser in aiagent.js"

# 3. Update trainingData.json using jq for safe JSON edits

# Add to predefinedAnswers at the start
if ! jq -e --arg key "execute ${SCRIPT_NAME}.sh" '.predefinedAnswers[$key]' "$TRAININGDATA" > /dev/null; then
    tmpfile=$(mktemp)
    jq --arg key "execute ${SCRIPT_NAME}.sh" \
       --arg val "Executing ${SCRIPT_NAME}.sh script..." \
       '.predefinedAnswers = {($key): $val} + .predefinedAnswers' "$TRAININGDATA" > "$tmpfile" && mv "$tmpfile" "$TRAININGDATA"
    echo "Added to predefinedAnswers in trainingData.json"
else
    echo "predefinedAnswers already contains entry."
fi

# Add to spellCorrections at the start
if ! jq -e --arg key "run ${SCRIPT_NAME} script" '.spellCorrections[$key]' "$TRAININGDATA" > /dev/null; then
    tmpfile=$(mktemp)
    jq --arg key "run ${SCRIPT_NAME} script" \
       --arg val "execute ${SCRIPT_NAME}.sh" \
       '.spellCorrections = {($key): $val} + .spellCorrections' "$TRAININGDATA" > "$tmpfile" && mv "$tmpfile" "$TRAININGDATA"
    echo "Added to spellCorrections in trainingData.json"
else
    echo "spellCorrections already contains entry."
fi

echo ""
echo "Done! Your new shell script is fully integrated. Test it in your chatbot UI."