.jobs[] | select(.name | contains("Studio")) | {name, conclusion, step: .steps[] | select(.conclusion=="failure") | {name, conclusion}}
