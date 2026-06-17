# HIPAA based Service Control Policies (SCPs)

## Overview

The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting sensitive patient health information. AWS enables covered entities and their business associates subject to HIPAA to securely process, store, and transmit protected health information (PHI) through [HIPAA-eligible services](https://aws.amazon.com/compliance/hipaa-compliance/).

AWS offers a comprehensive [HIPAA compliance program](https://aws.amazon.com/compliance/hipaa-compliance/) that includes a Business Associate Addendum (BAA) for customers who need to process PHI. When you sign a BAA with AWS, specific AWS services become HIPAA-eligible, meaning they can be used to store, process, and transmit PHI in compliance with HIPAA requirements.

## Purpose of this SCP

This Service Control Policy (SCP) restricts API actions to only HIPAA-eligible services and features, plus essential management and monitoring tools that don't typically store, process, or transmit PHI (such as IAM, Cost Management, and Support services). By applying this SCP, you can:

- Enforce guardrails that prevent the use of non-HIPAA-eligible services in accounts handling PHI
- Reduce the risk of accidental PHI exposure through unauthorized service usage
- Maintain compliance boundaries across your AWS Organization
- Simplify audit and compliance reporting by limiting the service scope

> **Important:** This SCP is provided as a starting reference and should be thoroughly tested in a non-production environment before deployment. AWS continuously evaluates and adds services to the HIPAA-eligible services list as they demonstrate compliance with HIPAA requirements under the shared responsibility model. This SCP aligns with the list of published eligible services dated May 22, 2026. Because the eligible services list is updated periodically, you should verify the current list at [AWS HIPAA Eligible Services Reference](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/) and adjust this policy accordingly before applying it to your organization.

Here are some statistics about the SCPs:

- HIPAA Lookup Data Service Count: 173
- HIPAAA Eligible Services API Count: 191
- Additional Services Count: 9
- Additional Services API Count: 20
- Total APIs in SCP: 211

The reference guide can be accessed via the following link: https://aws.amazon.com/compliance/hipaa-eligible-services-reference/

### Note on Amazon Application Recovery Controller (ARC)

ARC appears as a single entry on the HIPAA Eligible Services list, but it is composed of multiple capabilities, each with its own IAM service prefix. To grant full coverage of the service in this SCP, all five prefixes are included.

| ARC Capability | IAM Service Prefix | Service Authorization Reference |
|----------------|--------------------|--------------------------------|
| Zonal shift / Zonal autoshift (multi-AZ recovery) | `arc-zonal-shift` | [list_amazonapplicationrecoverycontroller-zonalshift](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonapplicationrecoverycontroller-zonalshift.html) |
| Region switch (multi-Region recovery orchestration) | `arc-region-switch` | [list_amazonarcregionswitch](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonarcregionswitch.html) |
| Routing control - data plane (cluster) | `route53-recovery-cluster` | [list_amazonroute53recoverycluster](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonroute53recoverycluster.html) |
| Routing control - control plane (configuration) | `route53-recovery-control-config` | [list_amazonroute53recoverycontrols](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonroute53recoverycontrols.html) |
| Readiness check | `route53-recovery-readiness` | [list_amazonroute53recoveryreadiness](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonroute53recoveryreadiness.html) |

Source: [What is ARC? – AWS documentation](https://docs.aws.amazon.com/r53recovery/latest/dg/what-is-route53-recovery.html). If your workload only uses a subset of these capabilities, you can scope the SCP down to just the prefixes you need.

### Note on Kiro

Kiro appears on the [HIPAA Eligible Services Reference](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/) (excluding Kiro Web), but it is a **client-side IDE/CLI tool** — it does not expose its own AWS API endpoint. There is no published IAM service prefix for Kiro in the [Service Authorization Reference](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html). Because SCPs evaluate IAM actions at the API level, there is nothing to allow or deny for Kiro in a `NotAction` policy. Kiro authenticates using other AWS services (e.g., IAM, STS, Bedrock) whose prefixes are already included in this SCP. If AWS publishes a `kiro:*` IAM prefix in the future, this SCP should be updated to include it.


Please also check the notes below for specific services:
Alexa for Business [for healthcare skills only — requires Alexa Skills BAA] \
AWS Amplify Console \
Amazon API Gateway \
AWS App Mesh \
AWS AppFabric \
Amazon AppFlow \
AWS Application Migration Service \
Amazon Application Recovery Controller \
AWS AppSync \
Amazon Athena \
AWS Audit Manager \
Amazon Augmented AI [excludes Public Workforce and Vendor Workforce for all features] \
Amazon Aurora \
AWS B2B Data Interchange \
AWS Backup \
AWS Batch \
Amazon Bedrock \
Amazon Bedrock AgentCore \
AWS Certificate Manager \
Amazon Chime \
Amazon Chime SDK \
AWS Clean Rooms \
AWS Cloud 9 \
Amazon Cloud Directory \
AWS Cloud Map \
AWS CloudEndure \
AWS CloudFormation \
Amazon CloudFront [excludes content delivery through Amazon CloudFront Embedded Point of Presences] \
AWS CloudHSM \
AWS CloudShell \
AWS CloudTrail \
Amazon CloudWatch \
Amazon CloudWatch Logs \
Amazon CloudWatch SDK Metrics \
AWS CodeBuild \
AWS CodeCommit \
AWS CodeDeploy \
AWS CodePipeline \
Amazon Cognito \
Amazon Comprehend \
Amazon Comprehend Medical \
AWS Config \
Amazon Connect \
Amazon Connect Health [a HCLS Service- Healthcare and Life Sciences Addendum applies] \
AWS Control Tower \
AWS Data Exchange \
AWS Database Migration Service (DMS) \
AWS DataSync \
Amazon DataZone \
Amazon Detective \
AWS DevOps Agent \
Amazon DevOps Guru \
AWS Direct Connect \
AWS Directory Service [excludes Simple AD] \
Amazon DocumentDB [with MongoDB compatibility] \
Amazon DynamoDB \
Amazon EC2 Auto Scaling \
Amazon ElastiCache \
AWS Elastic Beanstalk \
Amazon Elastic Block Store (Amazon EBS) \
Amazon Elastic Compute Cloud (Amazon EC2) \
Amazon Elastic Container Registry (ECR) \
Amazon Elastic Container Service (ECS) \
AWS Elastic Disaster Recovery \
Amazon Elastic File System (EFS) \
Amazon Elastic Kubernetes Service (EKS) \
Elastic Load Balancing \
Amazon Elastic MapReduce (EMR) \
AWS Elemental MediaConnect \
AWS Elemental MediaConvert \
AWS Elemental MediaLive \
AWS Entity Resolution \
Amazon EventBridge [formerly Amazon Cloudwatch Events] \
AWS Fargate [ECS and EKS engines only] \
AWS Fault Injection Simulator \
AWS Firewall Manager \
Amazon Forecast \
Amazon FreeRTOS \
Amazon FSx \
AWS Global Accelerator \
AWS Glue \
AWS Glue DataBrew \
Amazon GuardDuty \
AWS HealthLake \
AWS HealthOmics \
AWS HealthImaging \
AWS IAM Identity Center \
Amazon Inspector \
AWS IoT Core \
AWS IoT Device Management \
AWS IoT Events \
AWS IoT Greengrass \
AWS IoT SiteWise \
Amazon Kendra \
AWS Key Management Service (KMS) \
Amazon Managed Service for Apache Flink \
Amazon Keyspaces [For Apache Cassandra] \
Amazon Kinesis Data Streams \
Amazon Kinesis Data Firehose \
Amazon Kinesis Video Streams \
Kiro [excluding Kiro Web] — *see note below* \
AWS Lake Formation \
AWS Lambda \
Amazon Lex \
Amazon Location Service \
Amazon Macie \
AWS Mainframe Modernization \
AWS Managed Services [excluding Operations on Demand Services, except for the RFC Expedite feature] \
Amazon Managed Service for Prometheus \
Amazon Managed Workflow for Apache Airflow \
Amazon Managed Streaming for Apache Kafka \
Amazon MemoryDB \
Amazon MQ \
Amazon Neptune \
AWS Network Firewall \
Amazon Nova Act \
Amazon OpenSearch Service \
AWS OpsWorks for Chef Automate \
AWS OpsWorks for Puppet Enterprise \
AWS OpsWorks Stacks \
AWS Organizations \
AWS Outposts \
AWS Parallel Computing Service (PCS) \
Amazon Personalize \
Amazon Pinpoint and End User Messaging (formerly Amazon Pinpoint) [excluding Voice Message capabilities and WhatsApp Channel] \
Amazon Polly \
AWS Private Certificate Authority \
Amazon Q Business \
Amazon Quantum Ledger Database (QLDB) \
Amazon Quick Suite [formerly Amazon QuickSight] \
Amazon Rekognition \
Amazon Redshift \
Amazon Relational Database Service (Amazon RDS) [SQL Server, MySQL, Oracle, PostgreSQL, Db2 and MariaDB engines only] \
AWS Resilience Hub \
AWS Resource Access Manager (RAM) \
AWS Resource Explorer \
Amazon Route 53 \
Amazon S3 Glacier \
Amazon SageMaker AI [formerly Amazon Sagemaker, excludes Studio Lab, Ground Truth Plus, Public Workforce and Vendor Workforce for all features] \
AWS Secrets Manager \
AWS Security Hub CSPM (formerly AWS Security Hub) \
AWS Service Catalog \
AWS Serverless Application Repository \
AWS Shield [Standard and Advanced] \
Amazon Simple Email Service (Amazon SES) \
Amazon Simple Notification Service (SNS) \
Amazon Simple Queue Service (SQS) \
Amazon Simple Storage Service (S3) \
Amazon Simple Workflow Service (SWF) \
AWS Snowball \
AWS Snowball Edge \
AWS Step Functions \
AWS Storage Gateway \
AWS Systems Manager \
Amazon Textract \
Amazon Timestream \
AWS Transcribe [Includes Healthscribe] \
AWS Transfer Family \
AWS Transform \
Amazon Translate \
AWS Verified Access \
Amazon Verified Permissions \
Amazon Virtual Private Cloud (VPC) \
AWS Web Application Firewall (WAF) \
AWS Wickr \
Amazon WorkDocs [Excluding Adding Controls for Deleting Previous File Version Feature] \
Amazon WorkLink \
Amazon WorkSpaces \
Amazon WorkSpaces Applications [formerly known as Amazon AppStream 2.0] \
Amazon WorkSpaces Thin Client \
Amazon WorkSpaces Secure Browser \
AWS X-Ray \
VM Import/Export \

**NOTE:** If you are a Covered Entity or Business Associate as defined by the Health Insurance Portability and Accountability Act of 1996 (as amended, “HIPAA”), you agree not to use these HIPAA Eligible Services for any purpose or in any manner involving Protected Health Information (as defined by HIPAA) without first entering into an AWS business associate agreement.

Unless specifically excluded, generally available features of each of the HIPAA eligible services listed are also considered HIPAA eligible.

## "Tools" related APIs included

The featured scp-hcl-hipaa-service.json includes APIs for other tools / services within AWS that do not typically store, transform, or process PHI data.

### Service Catagory - Cost Management

- "aws-portal:\*"
- "budgets:\*"
- "ce:\*"
- "cur:\*"
- "bcm-data-exports:\*"
- "pricing:\*"

### Service Catagory - Identity and Access Management

- "apiname": "iam:\*"
- "apiname": "access-analyzer:\*"
- "apiname": "sts:\*"

### Service Catagory - Compliance

- "apiname": "artifact:\*"

### Service Catagory - License Manager

- "apiname": "license-manager:\*"

### Service Catagory - Resource Management

- "apiname": "resource-groups:\*"
- "apiname": "resource-explorer:\*"
- "apiname": "tag:\*"


### Service Catagory - Support

- "apiname": "support:\*"
- "apiname": "supportplans:\*"
- "apiname": "trustedadvisor:\*"

### Service Catagory - Monitoring / Telemetry

- "apiname": "pi:\*"
- "apiname": "applicationinsights:\*"

### Service Catagory - Notable Tools not intended to store, process, or transmit PHI

- "apiname": "qdeveloper:\*"