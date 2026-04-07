## Service specific controls

These policies provide guidance on how to accomplish security objectives for specific AWS services.

**Amazon Bedrock**


| Included policy | Rationale |
|------|-------------|
|[Deny users from using short term or creating long term Amazon Bedrock API keys](Amazon-Bedrock/Deny-Bedrock-api-keys.json)| Used to help enforce that users within your AWS organization cannot create service specific credentials for an IAM user for use with Amazon Bedrock, and denies the usage of Bedrock API keys with the Amazon Bedrock Service.|
|[Deny users from creating long term Amazon Bedrock API keys valid for more than 30 days](Amazon-Bedrock/Deny-Bedrock-api-keys-longer-than-30-days.json) | Used to help enforce that users within your AWS organization cannot create service specific credentials for amazon bedrock (AKA long-lived Bedrock API keys) that are valid for longer than 30 days. |
|[Deny users from using long term Amazon Bedrock API keys](Amazon-Bedrock/Deny-Bedrock-long-term-api-keys.json) | Restrict users and roles from calling Amazon Bedrock API with long-term bearer tokens while allowing short-term bearer tokens. This provides a middle ground by permitting temporary credentials while blocking persistent API keys.|
|[Deny users from invoking and subscribing to the unapproved Bedrock models](Amazon-Bedrock/Deny-Bedrock-model-invocation-except-approved-models.json) | Restrict users and roles from invoking and subscribing to the unapproved Bedrock foundation models. Replace `<unique-identifier>` with specific model provider name like `amazon`, to allow developers access to the Amazon foundation models. This Policy contains an example entry for models being used by bedrock-mantle, and by calling bedrock directly. |

**Amazon EC2**

| Included policy | Rationale | 
|------|-------------|
|[Require Amazon EC2 instances to use specific instance type](Amazon-EC2/Require-Amazon-EC2-instances-to-use-a-specific-type.json)|Restrict users and roles from launching EC2 instances unless they use only approved instance types.|
| [Deny users from disabling block public access on AMIs](Amazon-EC2/Deny-users-from-disabling-block-public-access-on-AMIs.json) |Deny public sharing of your AMIs. Note: The Block public access for AMIs setting default configuration depends on whether your [account is new or existing, and whether you have public AMIs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-intro.html#block-public-access-to-amis-default-settings).|

**Amazon Q Developer**

| Included policy | Rationale | 
|------|-------------|
|[Deny actions invoked through Amazon Q Developer in chat applications configurations](Amazon-Q-Developer/Deny-actions-invoked-through-Amazon-Q-Developer-in-chat-applications-configurations.json)|Restrict IAM and account administration actions invoked through Amazon Q Developer in chat applications configurations.| 

**Amazon S3**

| Included policy | Rationale | 
|------|-------------|
|[Deny ACL disablement for all new buckets (bucket owner enforced)](Amazon-S3/Deny-ACL-disablement-for-all-new-buckets.json)|Require that all new buckets are created with ACLs disabled. Note: When you apply this setting, ACLs are disabled and you automatically own and have full control over all objects in your bucket.|
|[Deny users from deleting Amazon S3 buckets or objects](Amazon-S3/Deny-users-from-deleting-Amazon-S3-buckets-or-objects.json)|Restrict users or roles in any affected account from deleting S3 bucket or objects. You can also consider adding this policy as bucket policy on the sensitive buckets.|
|[Prevent S3 unencrypted object uploads](Amazon-S3/Prevent-Amazon-S3-unencrypted-object-uploads.json)|Restrict users and roles from uploading objects to Amazon S3 unless server-side encryption is enabled to ensure data is encrypted at rest.|
|[Require S3 regional account namespaces be used](Amazon-S3/enforce-s3-bucket-namespace.json)|Require that s3 buckets are created within an account-regional namespace to help protect against bucket squatting.|


**Amazon EKS**

| Included policy | Rationale | 
|------|-------------|
|[Deny Tagging Roles and users with EKS Pod Identities Tags](Amazon-EKS/ProtectPodIdentitiesTagsOnRolesAndUsers.json)| Help ensure that no one can tag IAM users and roles with the tags specific to EKS Pod Identities. This is useful in partnership with an RCP to help ensure that only AWS service principals can set these as session tags, and there is an example of this on our [Resource Control Policy example repo](https://github.com/aws-samples/resource-control-policy-examples/tree/main/Service-specific-controls) |

**AWS IAM Roles Anywhere**

| Included policy | Rationale | 
|------|-------------|
|[Deny Tagging Roles and users with IAM Roles Anywhere Tags](AWS-IAMRolesAnywhere/Protect-IAMRA-Specific-Tags.json)| Help ensure that no one can tag IAM users and roles with the tags specific to IAM Roles Anywhere. This is useful in partnership with an RCP to help ensure that only AWS service principals can set these as session tags, and there is an example of this on our [Resource Control Policy example repo](https://github.com/aws-samples/resource-control-policy-examples/tree/main/Service-specific-controls) |

**AWS IAM**
| Included policy | Rationale | 
|------|-------------|
|[Deny Creating Any Service Specific Credentials](AWS-IAM/deny-creating-any-service-specific-credentials.json)| This policy contains two statements. The first "DenyCreatingAnyServiceSpecificCredential" is a blanket deny that will help prevent any service specific credential from being created. The Second "DenyCreatingAnyServiceSpecificWithExceptionBasedOnTag" accomplishes the same thing, but with an example of an exception mechansim where an IAM user with the tag of "ServiceSpecificCredentialAllowed" with a value of "true" will not be subject to the denial and could have a service specific credential. Use whichever of these statements helps you accomplish your objectives best. |
|[Deny Creating Types of Service Specific Credentials](AWS-IAM/deny-service-specific-credential-by-type.json)| This policy example contains an example which lets you list which types of IAM service specific credentials you wish to deny. You may add or remove services from this list which support service specific credentials. Creation of service specific credentials for all named services in the list will be denied. |

