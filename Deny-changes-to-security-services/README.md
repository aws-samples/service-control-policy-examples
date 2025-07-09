## Deny changes to security services

AWS offers security services that help you monitor access, security posture, and activity within your organization. Enforce guardrails to restrict member accounts from disabling these tools that are used to govern and comply, in operational auditing, and risk auditing of your AWS accounts. 


| Included Policy | Rational | 
|------|-------------|
|[Deny users from disabling Amazon CloudWatch or altering its configuration](Deny-users-from-disabling-or-altering-CloudWatch.json)| Restrict delete or configuration change to your critical dashboards or alarms to a privileged role.|
| [Deny enabling and disabling AWS Config](Deny-enabling-and-disabling-AWS-Config.json) |Restrict enabling/disabling AWS Config to a privileged role. If you use AWS Control Tower, refer to [Disallow Changes to AWS Config Rules Set Up by AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/mandatory-controls.html#config-rule-disallow-changes) applied by default.|
|[Deny users from disabling Amazon GuardDuty or modifying its configuration](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_guardduty.html#example_guardduty_1) | Deny users or roles in any affected account from disabling GuardDuty or altering its configuration, either directly as a command or through the console. Effectively enable read-only access to the GuardDuty information and resources.|
|[Deny deletion of AWS Access Analyzer and findings in an account](Deny-deletion-of-AWS-Access-Analyzer-and-findings-in-an-account.json)| Deny deletion of IAM Access Analyzer and the findings generated that can help you identify the resources in your organization and accounts, such as Amazon S3 buckets or IAM roles, shared with an external entity.|
|[Deny modifications to specific AWS CloudTrail trails](Deny-modifications-to-specific-CloudTrail-trails.json) | Restrict CloudTrail actions to specific CloudTrails that are required by the security or compliance teams. Note that there are alternatives to enable this control outside of SCP. For Example, you can create an Organization trail, that will log all events for all AWS accounts in that organization. Users in member accounts will not have sufficient permissions to delete the organization trail, turn logging on or off, change what types of events are logged, or otherwise alter the organization trail in any way.|
|[Protect disabling/deleting Amazon Macie](Protect-disabling-or-deleting-Amazon-Macie.json)| Restrict disabling/deleting member accounts or disassociating an account from a master Macie account action to a privileged role.|
|[Deny deletion or disassociation of members and invitations from AWS SecurityHub](Deny-deletion-or-disassociation-or-updation-to-AWS-SecurityHub.json)| Restrict disabling and updating SecurityHub, deleting member accounts or disassociating an account from a master SecurityHub account to a privileged role.|
|[Use Identity Center for AWS Managed Applications or Trusted Identity Propagation Only](Deny-Permission-sets-for-Identity-Center.json)| Does not allow the creation or modification of permission sets for an Identity Center delegated admin account, helping ensure Identity Center is only used for Applications and Trusted Identity Propagation|




