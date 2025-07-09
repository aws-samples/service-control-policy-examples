## Service Specific Controls

These policies provide guidance on how to accomplish security objectives for specific AWS services.


| Included Policy | Rational | 
|------|-------------|
|[Deny users from creating short term or long term Amazon Bedrock API keys.](Deny-Bedrock-Api-Keys.json)| Used to help enforce that users within your AWS organization cannot create service specific credentials for an IAM user for use with Amazon Bedrock, and denies the usage of Bedrock API keys with the Amazon Bedrock Service.|