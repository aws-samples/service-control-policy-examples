## Region controls 

Enforce controls in your multi-account environment to inhibit use of certain AWS Region or Regions.

| Included policy | Rationale |
|------|-------------|
|[Deny account region enable and disable actions](Deny-account-region-enable-and-disable-actions.json)| Restrict enabling or disabling [opt-in regions](https://docs.aws.amazon.com/general/latest/gr/rande-manage.html#rande-manage-enable) for an account to privileged role.| 
|[Deny access to AWS based on the requested AWS region](Deny-access-to-AWS-based-on-the-requested-AWS-region.json)| Deny access to any operations outside of the specified Regions while providing exemptions for operations in approved global services. Replace the list of services and operations with the global services used by accounts in your organization.Replace eu-central-1 and eu-west-1 with the AWS Regions you want to use. This example might not include all of the latest global AWS services or operations.|
|[Deny access to AWS based on the requested AWS region with Bedrock CRIS support](Deny-access-to-AWS-based-on-the-requested-AWS-region-with-Bedrock-CRIS.json)| Extends the region deny policy above to support Amazon Bedrock [Geographic cross-Region inference (CRIS)](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html) without enabling blocked regions. Bedrock inference actions are carved out of the region deny and controlled by a second statement that denies Bedrock inference outside approved regions unless the request uses a geographic CRIS inference profile (`eu.*`). This allows CRIS to route to destination regions transparently while blocking direct Bedrock calls outside approved regions. Replace `eu-central-1` and `eu-west-1` with your approved regions, and replace `eu.*` with the geographic prefix matching your [inference profile](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html). To restrict which models can be invoked, combine this with the [model approval SCP](../Service-specific-controls/Amazon-Bedrock/Deny-Bedrock-model-invocation-except-approved-models.json).|
|||

