## Sensitive data protection examples

Implement controls that protect your sensitive data, that should not be made publicly accessible or deleted intentionally or unintentionally. 


| Included Policy | Rational | 
|------|-------------|
|[Deny resource sharing through AWS Resource access manager outside your organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_ram.html#example_ram_1) | Deny users from creating resource shares using AWS RAM that allow sharing with IAM users and roles that aren't part of the organization.|
|[Deny users from deleting Amazon Glacier vaults or archives](Deny-users-from-deleting-Amazon-Glacier-vaults-or-archives.json)| Restrict users or roles in any affected account from deleting any S3 Glacier vaults or archives.Consider replacing "Resource":"*" with specific sensitive Glacier vaults/archive resources to allow developers freedom to manage other vaults/archives.|
|[Deny AWS Backup deletion and changes to configuration](Deny-AWS-Backup-deletion-and-changes-to-configuration.json) |Restrict users or roles in any affected account from deleting AWS Backup vaults.[Unlike other IAM-based policies, AWS Backup access policies don't support a wildcard in the Action key.](https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-vault-access-policy.html)|
|[Deny users from deleting Amazon S3 Buckets or objects](Deny-users-from-deleting-Amazon-S3-Buckets-or-objects.json) |Restrict users or roles in any affected account from deleting S3 bucket or objects.You can also consider adding this policy as bucket policy on the sensitive buckets. |
| [Deny ACL disablement for all new buckets (bucket owner enforced)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ensure-object-ownership.html#object-ownership-requiring-bucket-owner-enforced) | Require that all new buckets are created with ACLs disabled. Note: When you apply this setting, ACLs are disabled and you automatically own and have full control over all objects in your bucket.|
| [Deny users from modifying S3 Block Public Access (Account Level)](Deny-users-from-modifying-S3-Block-Public-Access.json) |Deny users or roles in any affected account from modifying the S3 Block Public Access Account level settings.Note: When you apply block public access settings to an account, the settings apply to all AWS Regions globally.|
| [Deny users from modifying S3 Block Public Access(Bucket level)](Deny-users-from-modifying-S3-Block-Public-Access-Bucket-level.json) |Deny users or roles in any affected account from modifying the S3 Block Public Access bucket level settings.|
| [Deny modification to Lambda URL Config](Deny-modification-to-Lambda-URL-Config.json) |Enforce lambda function URLs are called using IAM authentication.|
| [Deny RAM from sharing resources to external accounts.json](Deny-RAM-from-sharing-resources-to-external-accounts.json) |AWS Resource Access Manager allows you to share resources, such as VPCs with other AWS accounts. Deny users or roles from sharing resources with external account principals.|
| [Deny users from disabling block public access on AMIs](Deny-users-from-disabling-block-public-access-on-AMIs.json) |Deny public sharing of your AMIs. Note: The Block public access for AMIs setting default configuration depends on whether your [account is new or existing, and whether you have public AMIs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-intro.html#block-public-access-to-amis-default-settings).|
| [Deny modification to SSM service settings](Deny-modification-to-SSM-service-settings.json) |Deny public sharing of SSM documents and allow privileged access to configure or modify default host management configuration. Note: Make sure you have turned on block public access before implementing this policy.|






