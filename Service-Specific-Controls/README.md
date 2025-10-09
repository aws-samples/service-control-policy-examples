## Service Specific Controls

These policies provide guidance on how to accomplish security objectives for specific AWS services.


| Included Policy | Rational | 
|------|-------------|
|[Deny users from using short term or creating long term Amazon Bedrock API keys](Deny-Bedrock-api-keys.json)| Used to help enforce that users within your AWS organization cannot create service specific credentials for an IAM user for use with Amazon Bedrock, and denies the usage of Bedrock API keys with the Amazon Bedrock Service.|
|[Deny users from creating long term Amazon Bedrock API keys valid for more than 30 days](Deny_Bedrock_api_keys_longer_than_30_days.json) | Used to help enforce that users within your AWS organization cannot create service specific credentials for amazon bedrock (AKA long-lived Bedrock API keys) that are valid for longer than 30 days. |
|[Deny users from invoking and subscribing to the unapproved Bedrock models](Deny-Bedrock-model-invocation-except-approved-models.json) | Restrict users and roles from invoking and subscribing to the unapproved Bedrock foundation models. Replace `<unique-identifier>` with specific model provider name like `amazon`, to allow developers access to the Amazon foundation models.|
