## Service Control Policy examples
------------------------------------------------------------------------------

**The service control policies in this repository are shown as examples. You should not attach SCPs without thoroughly testing the impact that the policy has on accounts. Once you have a policy ready that you would like to implement, we recommend testing in a separate organization or OU that can be represent your production environment. Once tested, you should deploy changes to more specific OUs and then slowly deploy the changes to broader and broader OUs over time.**

[Service control policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) are meant to be used as coarse-grained guardrails, and they don’t directly grant access. The administrator must still attach [identity-based or resource-based policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html) to IAM principals or resources in your accounts to actually grant permissions. The effective permissions are the logical intersection between what is allowed by the SCP and what is allowed by the IAM and resource-based policies. You can get more details about SCP effects on permissions [here](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html#scp-effects-on-permissions).

A [Service control policy (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html), when attached to an AWS organization, organization unit or an account offers a central control over the maximum available permissions for all accounts in your organization, organization unit or an account. As an SCP can be applied at multiple levels in an AWS organization, understanding how [SCPs are evaluated](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html) can help you write SCPs that yield the right outcome. For in depth look at how to get more out of SCPs, visit [blog](https://aws.amazon.com/blogs/security/get-more-out-of-service-control-policies-in-a-multi-account-environment/).

We recommend that you organize accounts using [OUs based on function](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-ous.html#group-similar-accounts-based-on-function), compliance requirements, or a common set of controls rather than mirroring your organization’s reporting structure. For more details, reference: [Design principles for your multi-account strategy](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/design-principles-for-your-multi-account-strategy.html). If you are getting started with setting up your AWS Organizations organization, we recommend watching [Morgan Stanley](https://youtu.be/KFphCnN8WJo?t=1592) and [Inter & Co.](https://www.youtube.com/watch?v=rP8AboiFAoQ&ab_channel=AWSEvents) showcase their AWS Organization and SCP evolution journey and lessons learnt along the way.

 


## This  repository
------------------------------------------------------------------------------
The example policies are divided into different categories based on the type of control. These examples do not represent a complete list and are intended for you to tailor and extend to suit the needs of your environment. 

**Note** : The SCP examples in this repository use a [deny list strategy](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_strategies.html#orgs_policies_denylist), which means that you also need a [FullAWSAccess](https://console.aws.amazon.com/organizations/?#/policies/p-FullAWSAccess) policy or other policy that allows access attached to your AWS Organizations organization entities to allow actions. You still also need to grant appropriate permissions to your principals by using identity-based or resource-based policies.

* **[Data perimeter guardrails](https://github.com/aws-samples/data-perimeter-policy-examples)** : Enforce preventive guardrails that help ensure only your trusted identities are accessing trusted resources from expected networks.

* **[Deny changes to security services](Deny-changes-to-security-services/Deny-changes-to-security-services.md)**: AWS offers security services that help you monitor access, security posture, and activity within your organization. Enforce guardrails to restrict member accounts from disabling these tools that are used to govern and comply, in operational auditing, and risk auditing of your AWS accounts. 

* **[Privileged access controls](Privileged-access-controls/Privileged-access-controls.md)**: Enforce controls to make sure that your roles and applications are given only privileges which are essential to perform their intended function.

* **[Protect cloud platform resource](Protect-cloud-platform-resource/Protect-cloud-platform-resource.md)** : Enforce controls to protect your resources in cloud from being modified or deleted. 

* **[Region Controls](Region-controls/Region-controls.md)**: Enforce controls in your multi-account environment to inhibit use of certain AWS Region or Regions.
  
* **[Sensitive data protection](Sensitive-data-protection/Sensitive-data-protection.md)**: Implement controls that protect your sensitive data, that should not be made publicly accessible or deleted intentionally or unintentionally.






## Top SCPs to get started with
------------------------------------------------------------------------------

If you are just starting to implement SCPs in your environment, consider top 5 recommended SCPs. 

* [Deny member accounts from leaving the organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_general.html#example-scp-leave-org) 
* [Only allow usage of approved AWS Regions](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_general.html#example-scp-deny-region) 
* [Deny usage of the root user](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_general.html#example-scp-root-user)
* [Deny changes to security services](Deny-changes-to-security-services/Deny-changes-to-security-services.md)
* [Protect your sensitive Amazon S3 buckets](Sensitive-data-protection/Deny-users-from-deleting-Amazon-S3-Buckets-or-objects.json)

## Documentation links
------------------------------------------------------------------------------

* [Service control policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)

* [Get more out of service control policies in a multi-account environment](https://aws.amazon.com/blogs/security/get-more-out-of-service-control-policies-in-a-multi-account-environment/)

* [Achieving operational excellence with design considerations for AWS Organizations SCPs](https://aws.amazon.com/blogs/mt/achieving-operational-excellence-with-design-considerations-for-aws-organizations-scps/)

* [AWS re:Inforce 2022 - Getting more out of your service control policies, featuring Morgan Stanley](https://www.youtube.com/watch?v=KFphCnN8WJo&t=1578s&ab_channel=AWSEvents)

* [AWS re:Inforce 2023 - Create enterprise-wide preventive guardrails, featuring Inter & Co.](https://www.youtube.com/watch?v=rP8AboiFAoQ&ab_channel=AWSEvents)

* Pull requests : https://github.com/aws-samples/service-control-policy-examples/pulls

## Security
See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License
This library is licensed under the MIT-0 License. See the LICENSE file.
