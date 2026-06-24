# IF node: Should Call Flowise?

Place after `Prepare Telegram Session`.

Condition:

```text
{{ $json.shouldCallFlowise }} is true
```

True branch:

```text
HTTP Request -> Normalize Flowise Response -> Send a text message
```

False branch:

```text
Send a text message
```

For false branch, Telegram text should be:

```text
{{ $json.responseText }}
```

For true branch, HTTP Request body should be:

```json
{
  "question": "{{ $json.flowisePayload.question }}",
  "sessionId": "{{ $json.flowisePayload.sessionId }}",
  "overrideConfig": "{{ $json.flowisePayload.overrideConfig }}"
}
```

The HTTP URL should point to the edited Flowise copy:

```text
https://cloud.flowiseai.com/api/v1/prediction/e52f27b3-06e2-4fb0-b853-30e936b99839
```
