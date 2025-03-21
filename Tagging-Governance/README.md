# Tagging Governance using AWS Organizations
A solution for implementing enterprise-grade resource tagging governance using AWS Organizations Service Control Policies (SCPs).

## Overview
This project demonstrates how to implement preventative tagging controls for AWS resources using Service Control Policies. It leverages De Morgan's Laws to create complex logical conditions within SCP constraints, ensuring consistent resource tagging across multiple AWS accounts.

## Features
Enforce required tags at resource creation time
Scale across multiple AWS accounts
Support for complex tag validation patterns
Integration with AWS Backup based on compliance tags
Support for hybrid and edge deployment patterns
Architecture
The solution implements tagging governance through:

## Service Control Policies (SCPs) for tag enforcement
AWS Organizations for policy management
AWS Lambda for testing and validation
AWS Backup for automated backup policies

## Important Notes on SCP Implementation

### ⚠️ Testing and Deployment Strategy

The service control policies in this repository are provided as examples only. Before implementing any SCPs:

1. **Thoroughly test** all policies before attachment
2. Test in an isolated environment that mirrors your production setup
3. Use a gradual deployment approach:
   - Start with specific, limited-scope OUs
   - Gradually expand to broader OUs
   - Monitor and verify impact at each stage

### Understanding SCP Behavior

- SCPs provide coarse-grained guardrails but **do not grant permissions**
- Administrators must still manage identity-based and resource-based policies
- Effective permissions are the **logical intersection** of:
  - Service Control Policy/Resource Control Policy
  - Identity Policy or Resource Policy

### Organizational Design Recommendations

- Organize accounts by function, compliance requirements, or control sets
- Avoid mirroring organizational reporting structure
- Consider compliance and security requirements when designing OU structure

### Additional Resources

- [Understanding SCP Effects on Permissions](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scp.html)
- [Multi-account Strategy Design Principles](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/organizations.html)
- [AWS Organizations and SCP Evolution Case Studies](https://aws.amazon.com/organizations/getting-started/)

This implementation guide assumes familiarity with AWS Organizations and SCP concepts. For additional guidance, please consult the AWS documentation.

### Prerequisites
AWS Organizations enabled
Administrator access to AWS Management Account
AWS CDK v2.x installed
Node.js 18.x or later
AWS CLI v2 configured
### Installation
Clone the repository:
git clone https://github.com/aws-samples/aws-enterprise-tagging-governance
cd Tagging-Governance
Install dependencies:
npm install
Deploy the stack:
cdk deploy
Testing
The project includes comprehensive test scenarios for validating tag enforcement:

### Compliant resource creation
Non-compliant scenarios
Special pattern testing
Comprehensive boundary testing
Execute tests using the provided Lambda function:

aws lambda invoke --function-name TaggingTestFunction --payload file://tests/compliant-scenario.json response.json
Test Scenarios
| Scenario Type | Test Case | Expected Result |
|--------------|-----------|-----------------|
| Compliant | Full Compliance | Resource creation successful |
| Non-Compliant | Missing Tags | Resource creation denied |
| Non-Compliant | Invalid Values | Resource creation denied |
| Special Pattern | Invalid Prefix | Resource creation denied |
| Comprehensive | Multiple Violations | Resource creation denied |

## License
See LICENSE for more information.

## Contributing
See CONTRIBUTING for more information.

## Support
Please submit bug reports and feature requests through our GitHub issues page.