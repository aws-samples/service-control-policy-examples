## Protect cloud platform resource examples

Enforce controls to protect your resources in cloud from being modified or deleted. 

| Included Policy | Rational | 
|------|-------------|
|[Deny unwanted cancellation or changes to AWS Marketplace product subscription](Deny-unwanted-cancellation-or-changes-to-AWS-Marketplace-product-subscription.json)| Restrict AWS Marketplace product subscription changes to privileged role|
| [Deny users from deleting Amazon VPC flow logs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_vpc.html#example_vpc_1)|Deny users or roles in any affected account from deleting Amazon Elastic Compute Cloud (Amazon EC2) flow logs or CloudWatch log groups or log streams.|
| [Deny creation of default VPC and Subnet](Deny-creation-of-default-VPC-and-subnet.json) | All VPCs and Subnets are created by the Network team following specific configurations.|
| [Deny modifications to specific SNS topics](Deny-modifications-to-specific-SNS-topics.json)|Protect infrastructure automation solution SNS Topics. If you use AWS Control Tower, refer to [Disallow Changes to Amazon SNS Set Up by AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/mandatory-controls.html#sns-disallow-changes) applied by default.|
| [Deny modifications to specific Amazon Lambda functions](Deny-modifications-to-specific-Amazon-Lambda-functions.json) |Platform solutions deploy Lambda functions that need protection. If you use AWS Control Tower, refer to [Disallow Changes to AWS Lambda Functions Set Up by AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/mandatory-controls.html#lambda-disallow-changes) applied by default.|
| [Deny disabling default EBS encryption](Deny-disabling-default-EBS-encryption.json)|Require all EBS volumes are encrypted by default. Note : Enable your accounts for [encryption by default](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_key_mgmt) before implementing this policy.|
| [Deny KMS key deletion](Deny-KMS-key-deletion.json) |Deny the accidental or intentional deletion of a KMS key and only allow specific roles to delete KMS keys.|
| [Deny modifications to specific AWS CloudFormation resources](Deny-modifications-to-specific-AWS-CloudFormation-resources.json) |Restrict CloudFormation actions to specific CloudFormation Stacks and StackSets that were created by an infrastructure automation framework. If you use AWS Control Tower, refer to [Disallow Changes to AWS IAM Roles Set Up by AWS Control Tower and AWS CloudFormation](https://docs.aws.amazon.com/controltower/latest/userguide/mandatory-controls.html#iam-disallow-changes) applied by default.|



