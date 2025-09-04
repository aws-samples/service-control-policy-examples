## Service Specific Controls

These policies provide guidance on how to accomplish security objectives for specific AWS services.


| Included Policy | Rational | 
|------|-------------|
|[Deny users from creating short term or long term Amazon Bedrock API keys.](Deny-Bedrock-Api-Keys.json)| Used to help enforce that users within your AWS organization cannot create service specific credentials for an IAM user for use with Amazon Bedrock, and denies the usage of Bedrock API keys with the Amazon Bedrock Service.|
| [Deny Users from creating long term Amazon Bedrock API keys valid for more than 30 days](deny_bedrock_api_keys_longer_than_30_days.json | used to help enforce that users within your AWS organization cannot create service specific credentials for amazon bedrock (AKA long-lived Bedrock API keys) that are valid for longer than 30 days. |
