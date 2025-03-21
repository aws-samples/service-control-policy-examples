"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityBlogSampleCodeStack = void 0;
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const backup = require("aws-cdk-lib/aws-backup");
const organizations = require("aws-cdk-lib/aws-organizations");
// Updated Organizations check Lambda code
const organizationsCheckCode = `
const { OrganizationsClient, DescribeOrganizationCommand } = require('@aws-sdk/client-organizations');

exports.handler = async function(event, context) {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const client = new OrganizationsClient();
  
  try {
    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        try {
          const command = new DescribeOrganizationCommand({});
          const response = await client.send(command);
          console.log('Organizations API Response:', JSON.stringify(response, null, 2));
          
          return {
            Status: 'SUCCESS',
            PhysicalResourceId: event.LogicalResourceId,
            Data: {
              OrganizationsEnabled: true,
              OrganizationId: response.Organization.Id
            }
          };
        } catch (error) {
          console.log('Error checking organizations:', error);
          if (error.name === 'AWSOrganizationsNotInUseException') {
            return {
              Status: 'SUCCESS',
              PhysicalResourceId: event.LogicalResourceId,
              Data: {
                OrganizationsEnabled: false
              }
            };
          }
          throw error;
        }
        
      case 'Delete':
        return {
          Status: 'SUCCESS',
          PhysicalResourceId: event.LogicalResourceId,
          Data: {
            OrganizationsEnabled: false
          }
        };
        
      default:
        throw new Error('Invalid request type: ' + event.RequestType);
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      Status: 'FAILED',
      PhysicalResourceId: event.LogicalResourceId,
      Reason: error.message,
      Data: {
        OrganizationsEnabled: false
      }
    };
  }
};
`;
// Tagging test Lambda code remains the same
const taggingTestCode = `
const { EC2Client, RunInstancesCommand } = require('@aws-sdk/client-ec2');

/**
 * Lambda handler for testing EC2 instance creation with various tagging scenarios
 * Implements De Morgan's Laws for logical test cases:
 * 1. NOT (A AND B) = (NOT A) OR (NOT B)
 * 2. NOT (A OR B) = (NOT A) AND (NOT B)
 */
exports.handler = async function(event) {
  const ec2Client = new EC2Client();
  const testScenario = event.testScenario;
  const testVariation = event.testVariation || 'default';

  console.log(\`Executing test scenario: \${testScenario}, variation: \${testVariation}\`);

  try {
    switch(testScenario) {
      case 'compliant':
        return await createCompliantInstance(ec2Client);
      case 'non-compliant':
        return await createNonCompliantInstance(ec2Client, testVariation);
      case 'special-pattern':
        return await createSpecialPatternInstance(ec2Client, testVariation);
      case 'comprehensive':
        return await createComprehensiveTestInstance(ec2Client, testVariation);
      default:
        throw new Error('Invalid test scenario');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Creates a fully compliant instance - baseline for comparison
 * All conditions must be true: (A AND B AND C AND D)
 */
async function createCompliantInstance(ec2Client) {
  const params = {
    ImageId: 'ami-002b9d4784a46775f',
    InstanceType: 't3.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'infra-prod' }
      ]
    }]
  };
  const command = new RunInstancesCommand(params);
  return await ec2Client.send(command);
}

/**
 * Tests non-compliant scenarios based on De Morgan's Law:
 * NOT(all tags present AND all values valid) = 
 * (missing tags OR invalid values)
 */
async function createNonCompliantInstance(ec2Client, variation) {
  const testCases = {
    'missing-tags': {
      Tags: [
        // Missing DeploymentType - tests NOT A
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' }
        // Missing BusinessUnit - tests NOT D
      ]
    },
    'invalid-values': {
      Tags: [
        { Key: 'DeploymentType', Value: 'invalid' }, // Tests NOT valid(A)
        { Key: 'BackupCompliance', Value: 'not-critical' }, // Tests NOT valid(B)
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'infra-prod' }
      ]
    },
    'mixed-violations': {
      Tags: [
        { Key: 'DeploymentType', Value: 'invalid' },
        // Missing BackupCompliance
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'invalid-pattern' }
      ]
    }
  };

  const params = {
    ImageId: 'ami-002b9d4784a46775f',
    InstanceType: 't3.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: testCases[variation].Tags
    }]
  };

  const command = new RunInstancesCommand(params);
  return await ec2Client.send(command);
}

/**
 * Tests special pattern matching scenarios
 * Based on De Morgan's Law for pattern matching:
 * NOT(matches pattern) = matches NOT(pattern)
 */
async function createSpecialPatternInstance(ec2Client, variation) {
  const testCases = {
    'invalid-prefix': {
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'not-infra-prod' }
      ]
    },
    'missing-suffix': {
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'infra' }
      ]
    },
    'case-sensitivity': {
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'INFRA-PROD' }
      ]
    }
  };

  const params = {
    ImageId: 'ami-002b9d4784a46775f',
    InstanceType: 't3.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: testCases[variation].Tags
    }]
  };

  const command = new RunInstancesCommand(params);
  return await ec2Client.send(command);
}

/**
 * Comprehensive test combining multiple conditions
 * Tests complex combinations of De Morgan's Laws:
 * NOT(A AND B AND C) = NOT(A) OR NOT(B) OR NOT(C)
 */
async function createComprehensiveTestInstance(ec2Client, variation) {
  const testCases = {
    'multiple-violations': {
      Tags: [
        { Key: 'DeploymentType', Value: 'invalid' },
        { Key: 'BackupCompliance', Value: 'not-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'invalid-pattern' }
      ]
    },
    'boundary-conditions': {
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: '' }, // Empty value
        { Key: 'BusinessUnit', Value: 'infra-' } // Minimum pattern
      ]
    },
    'special-characters': {
      Tags: [
        { Key: 'DeploymentType', Value: 'edge' },
        { Key: 'BackupCompliance', Value: 'mission-critical' },
        { Key: 'OutpostIdentifier', Value: 'outpost-east-1' },
        { Key: 'BusinessUnit', Value: 'infra-prod#123' } // Special characters
      ]
    }
  };

  const params = {
    ImageId: 'ami-002b9d4784a46775f',
    InstanceType: 't3.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: testCases[variation].Tags
    }]
  };

  const command = new RunInstancesCommand(params);
  return await ec2Client.send(command);
}
`;
class SecurityBlogSampleCodeStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Define required tags and allowed values
        const REQUIRED_TAGS = {
            DeploymentType: ['edge', 'core', 'hybrid'],
            BackupCompliance: ['mission-critical', 'business-critical'],
            OutpostIdentifier: '*',
            BusinessUnit: 'infra-*'
        };
        // Create VPC for EC2 instance
        const vpc = new ec2.Vpc(this, 'TaggingTestVPC', {
            maxAzs: 2,
            natGateways: 1
        });
        // Create AWS Backup configuration
        const backupVault = new backup.BackupVault(this, 'EC2BackupVault', {
            backupVaultName: 'ec2-backup-vault',
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        // Create Mission Critical Backup Plan
        const missionCriticalPlan = new backup.BackupPlan(this, 'MissionCriticalBackupPlan', {
            backupVault,
            backupPlanRules: [
                new backup.BackupPlanRule({
                    completionWindow: cdk.Duration.hours(2),
                    startWindow: cdk.Duration.hours(1),
                    scheduleExpression: cdk.aws_events.Schedule.cron({
                        day: '*',
                        hour: '3',
                        minute: '0'
                    }),
                    deleteAfter: cdk.Duration.days(180),
                    moveToColdStorageAfter: cdk.Duration.days(90),
                    enableContinuousBackup: false
                })
            ]
        });
        // Create Business Critical Backup Plan
        const businessCriticalPlan = new backup.BackupPlan(this, 'BusinessCriticalBackupPlan', {
            backupVault,
            backupPlanRules: [
                new backup.BackupPlanRule({
                    completionWindow: cdk.Duration.hours(3),
                    startWindow: cdk.Duration.hours(1),
                    scheduleExpression: cdk.aws_events.Schedule.cron({
                        day: '*',
                        hour: '12',
                        minute: '0'
                    }),
                    deleteAfter: cdk.Duration.days(97),
                    moveToColdStorageAfter: cdk.Duration.days(7)
                })
            ]
        });
        // Add selection for Mission Critical resources
        new backup.BackupSelection(this, 'MissionCriticalSelection', {
            backupPlan: missionCriticalPlan,
            resources: [
                backup.BackupResource.fromTag('BackupCompliance', 'mission-critical')
            ]
        });
        // Add selection for Business Critical resources
        new backup.BackupSelection(this, 'BusinessCriticalSelection', {
            backupPlan: businessCriticalPlan,
            resources: [
                backup.BackupResource.fromTag('BackupCompliance', 'business-critical')
            ]
        });
        // Create SCP policies using De Morgan's Laws
        const tagEnforcementSCP = new organizations.CfnPolicy(this, 'TagEnforcementSCP', {
            content: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Sid: 'EnforceRequiredTags',
                        Effect: 'Deny',
                        Action: ['ec2:RunInstances'],
                        Resource: ['arn:aws:ec2:*:*:instance/*'],
                        Condition: {
                            'Null': {
                                'aws:RequestTag/OutpostIdentifier': 'true',
                            }
                        }
                    },
                    {
                        Sid: 'EnforceDeploymentTypeValues',
                        Effect: 'Deny',
                        Action: ['ec2:RunInstances'],
                        Resource: ['arn:aws:ec2:*:*:instance/*'],
                        Condition: {
                            'StringNotEquals': {
                                'aws:RequestTag/DeploymentType': ['edge', 'core', 'hybrid']
                            }
                        }
                    },
                    {
                        Sid: 'EnforceBackupComplianceValues',
                        Effect: 'Deny',
                        Action: ['ec2:RunInstances'],
                        Resource: ['arn:aws:ec2:*:*:instance/*'],
                        Condition: {
                            'StringNotEquals': {
                                'aws:RequestTag/BackupCompliance': ['mission-critical', 'business-critical']
                            }
                        }
                    },
                    {
                        Sid: 'EnforceBusinessUnitPattern',
                        Effect: 'Deny',
                        Action: ['ec2:RunInstances'],
                        Resource: ['arn:aws:ec2:*:*:instance/*'],
                        Condition: {
                            'StringNotLike': {
                                'aws:RequestTag/BusinessUnit': 'infra-*'
                            }
                        }
                    }
                ]
            },
            name: 'TagEnforcementPolicy',
            type: 'SERVICE_CONTROL_POLICY',
            targetIds: ['ou-8033-hltnny6u'] // update with your OU
        });
        // Create Lambda function for testing EC2 creation scenarios
        const testFunction = new lambda.Function(this, 'TaggingTestFunction', {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(taggingTestCode),
            vpc,
            timeout: cdk.Duration.minutes(5),
            environment: {
                REQUIRED_TAGS: JSON.stringify(REQUIRED_TAGS)
            }
        });
        testFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ec2:RunInstances', 'ec2:CreateTags'],
            resources: ['*']
        }));
        // Outputs
        new cdk.CfnOutput(this, 'LambdaFunctionName', {
            value: testFunction.functionName,
            description: 'Name of the Lambda function for testing'
        });
    }
}
exports.SecurityBlogSampleCodeStack = SecurityBlogSampleCodeStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHlfYmxvZ19zYW1wbGVfY29kZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlY3VyaXR5X2Jsb2dfc2FtcGxlX2NvZGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCwrREFBK0Q7QUFLL0QsMENBQTBDO0FBQzFDLE1BQU0sc0JBQXNCLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQStEOUIsQ0FBQztBQUVGLDRDQUE0QztBQUM1QyxNQUFNLGVBQWUsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBNdkIsQ0FBQztBQUVGLE1BQWEsMkJBQTRCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDeEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwwQ0FBMEM7UUFDMUMsTUFBTSxhQUFhLEdBQUc7WUFDcEIsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDMUMsZ0JBQWdCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQztZQUMzRCxpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLFlBQVksRUFBRSxTQUFTO1NBQ3hCLENBQUM7UUFFRiw4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U0FBUzs2QkFDekM7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELElBQUksRUFBRSxzQkFBc0I7WUFDNUIsSUFBSSxFQUFFLHdCQUF3QjtZQUM5QixTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLHNCQUFzQjtTQUN2RCxDQUFDLENBQUM7UUFFTCw0REFBNEQ7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNwRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7WUFDN0MsR0FBRztZQUNILE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsV0FBVyxFQUFFO2dCQUNYLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQzthQUM3QztTQUNGLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ25ELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLFVBQVU7UUFDVixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWTtZQUNoQyxXQUFXLEVBQUUseUNBQXlDO1NBQ3ZELENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQTdKRCxrRUE2SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYmFja3VwIGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYWNrdXAnO1xuaW1wb3J0ICogYXMgb3JnYW5pemF0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtb3JnYW5pemF0aW9ucyc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVGFncyB9IGZyb20gJ2F3cy1jZGstbGliJztcblxuLy8gVXBkYXRlZCBPcmdhbml6YXRpb25zIGNoZWNrIExhbWJkYSBjb2RlXG5jb25zdCBvcmdhbml6YXRpb25zQ2hlY2tDb2RlID0gYFxuY29uc3QgeyBPcmdhbml6YXRpb25zQ2xpZW50LCBEZXNjcmliZU9yZ2FuaXphdGlvbkNvbW1hbmQgfSA9IHJlcXVpcmUoJ0Bhd3Mtc2RrL2NsaWVudC1vcmdhbml6YXRpb25zJyk7XG5cbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uKGV2ZW50LCBjb250ZXh0KSB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDonLCBKU09OLnN0cmluZ2lmeShldmVudCwgbnVsbCwgMikpO1xuICBcbiAgY29uc3QgY2xpZW50ID0gbmV3IE9yZ2FuaXphdGlvbnNDbGllbnQoKTtcbiAgXG4gIHRyeSB7XG4gICAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBEZXNjcmliZU9yZ2FuaXphdGlvbkNvbW1hbmQoe30pO1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ09yZ2FuaXphdGlvbnMgQVBJIFJlc3BvbnNlOicsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFN0YXR1czogJ1NVQ0NFU1MnLFxuICAgICAgICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgICAgICAgIERhdGE6IHtcbiAgICAgICAgICAgICAgT3JnYW5pemF0aW9uc0VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgIE9yZ2FuaXphdGlvbklkOiByZXNwb25zZS5Pcmdhbml6YXRpb24uSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBjaGVja2luZyBvcmdhbml6YXRpb25zOicsIGVycm9yKTtcbiAgICAgICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0FXU09yZ2FuaXphdGlvbnNOb3RJblVzZUV4Y2VwdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIFN0YXR1czogJ1NVQ0NFU1MnLFxuICAgICAgICAgICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgICAgICAgICBEYXRhOiB7XG4gICAgICAgICAgICAgICAgT3JnYW5pemF0aW9uc0VuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBTdGF0dXM6ICdTVUNDRVNTJyxcbiAgICAgICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgICAgIERhdGE6IHtcbiAgICAgICAgICAgIE9yZ2FuaXphdGlvbnNFbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVxdWVzdCB0eXBlOiAnICsgZXZlbnQuUmVxdWVzdFR5cGUpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIFN0YXR1czogJ0ZBSUxFRCcsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgUmVhc29uOiBlcnJvci5tZXNzYWdlLFxuICAgICAgRGF0YToge1xuICAgICAgICBPcmdhbml6YXRpb25zRW5hYmxlZDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuYDtcblxuLy8gVGFnZ2luZyB0ZXN0IExhbWJkYSBjb2RlIHJlbWFpbnMgdGhlIHNhbWVcbmNvbnN0IHRhZ2dpbmdUZXN0Q29kZSA9IGBcbmNvbnN0IHsgRUMyQ2xpZW50LCBSdW5JbnN0YW5jZXNDb21tYW5kIH0gPSByZXF1aXJlKCdAYXdzLXNkay9jbGllbnQtZWMyJyk7XG5cbi8qKlxuICogTGFtYmRhIGhhbmRsZXIgZm9yIHRlc3RpbmcgRUMyIGluc3RhbmNlIGNyZWF0aW9uIHdpdGggdmFyaW91cyB0YWdnaW5nIHNjZW5hcmlvc1xuICogSW1wbGVtZW50cyBEZSBNb3JnYW4ncyBMYXdzIGZvciBsb2dpY2FsIHRlc3QgY2FzZXM6XG4gKiAxLiBOT1QgKEEgQU5EIEIpID0gKE5PVCBBKSBPUiAoTk9UIEIpXG4gKiAyLiBOT1QgKEEgT1IgQikgPSAoTk9UIEEpIEFORCAoTk9UIEIpXG4gKi9cbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnN0IGVjMkNsaWVudCA9IG5ldyBFQzJDbGllbnQoKTtcbiAgY29uc3QgdGVzdFNjZW5hcmlvID0gZXZlbnQudGVzdFNjZW5hcmlvO1xuICBjb25zdCB0ZXN0VmFyaWF0aW9uID0gZXZlbnQudGVzdFZhcmlhdGlvbiB8fCAnZGVmYXVsdCc7XG5cbiAgY29uc29sZS5sb2coXFxgRXhlY3V0aW5nIHRlc3Qgc2NlbmFyaW86IFxcJHt0ZXN0U2NlbmFyaW99LCB2YXJpYXRpb246IFxcJHt0ZXN0VmFyaWF0aW9ufVxcYCk7XG5cbiAgdHJ5IHtcbiAgICBzd2l0Y2godGVzdFNjZW5hcmlvKSB7XG4gICAgICBjYXNlICdjb21wbGlhbnQnOlxuICAgICAgICByZXR1cm4gYXdhaXQgY3JlYXRlQ29tcGxpYW50SW5zdGFuY2UoZWMyQ2xpZW50KTtcbiAgICAgIGNhc2UgJ25vbi1jb21wbGlhbnQnOlxuICAgICAgICByZXR1cm4gYXdhaXQgY3JlYXRlTm9uQ29tcGxpYW50SW5zdGFuY2UoZWMyQ2xpZW50LCB0ZXN0VmFyaWF0aW9uKTtcbiAgICAgIGNhc2UgJ3NwZWNpYWwtcGF0dGVybic6XG4gICAgICAgIHJldHVybiBhd2FpdCBjcmVhdGVTcGVjaWFsUGF0dGVybkluc3RhbmNlKGVjMkNsaWVudCwgdGVzdFZhcmlhdGlvbik7XG4gICAgICBjYXNlICdjb21wcmVoZW5zaXZlJzpcbiAgICAgICAgcmV0dXJuIGF3YWl0IGNyZWF0ZUNvbXByZWhlbnNpdmVUZXN0SW5zdGFuY2UoZWMyQ2xpZW50LCB0ZXN0VmFyaWF0aW9uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0ZXN0IHNjZW5hcmlvJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVsbHkgY29tcGxpYW50IGluc3RhbmNlIC0gYmFzZWxpbmUgZm9yIGNvbXBhcmlzb25cbiAqIEFsbCBjb25kaXRpb25zIG11c3QgYmUgdHJ1ZTogKEEgQU5EIEIgQU5EIEMgQU5EIEQpXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUNvbXBsaWFudEluc3RhbmNlKGVjMkNsaWVudCkge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgSW1hZ2VJZDogJ2FtaS0wMDJiOWQ0Nzg0YTQ2Nzc1ZicsXG4gICAgSW5zdGFuY2VUeXBlOiAndDMubWljcm8nLFxuICAgIE1pbkNvdW50OiAxLFxuICAgIE1heENvdW50OiAxLFxuICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbe1xuICAgICAgUmVzb3VyY2VUeXBlOiAnaW5zdGFuY2UnLFxuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdlZGdlJyB9LFxuICAgICAgICB7IEtleTogJ0JhY2t1cENvbXBsaWFuY2UnLCBWYWx1ZTogJ21pc3Npb24tY3JpdGljYWwnIH0sXG4gICAgICAgIHsgS2V5OiAnT3V0cG9zdElkZW50aWZpZXInLCBWYWx1ZTogJ291dHBvc3QtZWFzdC0xJyB9LFxuICAgICAgICB7IEtleTogJ0J1c2luZXNzVW5pdCcsIFZhbHVlOiAnaW5mcmEtcHJvZCcgfVxuICAgICAgXVxuICAgIH1dXG4gIH07XG4gIGNvbnN0IGNvbW1hbmQgPSBuZXcgUnVuSW5zdGFuY2VzQ29tbWFuZChwYXJhbXMpO1xuICByZXR1cm4gYXdhaXQgZWMyQ2xpZW50LnNlbmQoY29tbWFuZCk7XG59XG5cbi8qKlxuICogVGVzdHMgbm9uLWNvbXBsaWFudCBzY2VuYXJpb3MgYmFzZWQgb24gRGUgTW9yZ2FuJ3MgTGF3OlxuICogTk9UKGFsbCB0YWdzIHByZXNlbnQgQU5EIGFsbCB2YWx1ZXMgdmFsaWQpID0gXG4gKiAobWlzc2luZyB0YWdzIE9SIGludmFsaWQgdmFsdWVzKVxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVOb25Db21wbGlhbnRJbnN0YW5jZShlYzJDbGllbnQsIHZhcmlhdGlvbikge1xuICBjb25zdCB0ZXN0Q2FzZXMgPSB7XG4gICAgJ21pc3NpbmctdGFncyc6IHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgLy8gTWlzc2luZyBEZXBsb3ltZW50VHlwZSAtIHRlc3RzIE5PVCBBXG4gICAgICAgIHsgS2V5OiAnQmFja3VwQ29tcGxpYW5jZScsIFZhbHVlOiAnbWlzc2lvbi1jcml0aWNhbCcgfSxcbiAgICAgICAgeyBLZXk6ICdPdXRwb3N0SWRlbnRpZmllcicsIFZhbHVlOiAnb3V0cG9zdC1lYXN0LTEnIH1cbiAgICAgICAgLy8gTWlzc2luZyBCdXNpbmVzc1VuaXQgLSB0ZXN0cyBOT1QgRFxuICAgICAgXVxuICAgIH0sXG4gICAgJ2ludmFsaWQtdmFsdWVzJzoge1xuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdpbnZhbGlkJyB9LCAvLyBUZXN0cyBOT1QgdmFsaWQoQSlcbiAgICAgICAgeyBLZXk6ICdCYWNrdXBDb21wbGlhbmNlJywgVmFsdWU6ICdub3QtY3JpdGljYWwnIH0sIC8vIFRlc3RzIE5PVCB2YWxpZChCKVxuICAgICAgICB7IEtleTogJ091dHBvc3RJZGVudGlmaWVyJywgVmFsdWU6ICdvdXRwb3N0LWVhc3QtMScgfSxcbiAgICAgICAgeyBLZXk6ICdCdXNpbmVzc1VuaXQnLCBWYWx1ZTogJ2luZnJhLXByb2QnIH1cbiAgICAgIF1cbiAgICB9LFxuICAgICdtaXhlZC12aW9sYXRpb25zJzoge1xuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdpbnZhbGlkJyB9LFxuICAgICAgICAvLyBNaXNzaW5nIEJhY2t1cENvbXBsaWFuY2VcbiAgICAgICAgeyBLZXk6ICdPdXRwb3N0SWRlbnRpZmllcicsIFZhbHVlOiAnb3V0cG9zdC1lYXN0LTEnIH0sXG4gICAgICAgIHsgS2V5OiAnQnVzaW5lc3NVbml0JywgVmFsdWU6ICdpbnZhbGlkLXBhdHRlcm4nIH1cbiAgICAgIF1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIEltYWdlSWQ6ICdhbWktMDAyYjlkNDc4NGE0Njc3NWYnLFxuICAgIEluc3RhbmNlVHlwZTogJ3QzLm1pY3JvJyxcbiAgICBNaW5Db3VudDogMSxcbiAgICBNYXhDb3VudDogMSxcbiAgICBUYWdTcGVjaWZpY2F0aW9uczogW3tcbiAgICAgIFJlc291cmNlVHlwZTogJ2luc3RhbmNlJyxcbiAgICAgIFRhZ3M6IHRlc3RDYXNlc1t2YXJpYXRpb25dLlRhZ3NcbiAgICB9XVxuICB9O1xuXG4gIGNvbnN0IGNvbW1hbmQgPSBuZXcgUnVuSW5zdGFuY2VzQ29tbWFuZChwYXJhbXMpO1xuICByZXR1cm4gYXdhaXQgZWMyQ2xpZW50LnNlbmQoY29tbWFuZCk7XG59XG5cbi8qKlxuICogVGVzdHMgc3BlY2lhbCBwYXR0ZXJuIG1hdGNoaW5nIHNjZW5hcmlvc1xuICogQmFzZWQgb24gRGUgTW9yZ2FuJ3MgTGF3IGZvciBwYXR0ZXJuIG1hdGNoaW5nOlxuICogTk9UKG1hdGNoZXMgcGF0dGVybikgPSBtYXRjaGVzIE5PVChwYXR0ZXJuKVxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVTcGVjaWFsUGF0dGVybkluc3RhbmNlKGVjMkNsaWVudCwgdmFyaWF0aW9uKSB7XG4gIGNvbnN0IHRlc3RDYXNlcyA9IHtcbiAgICAnaW52YWxpZC1wcmVmaXgnOiB7XG4gICAgICBUYWdzOiBbXG4gICAgICAgIHsgS2V5OiAnRGVwbG95bWVudFR5cGUnLCBWYWx1ZTogJ2VkZ2UnIH0sXG4gICAgICAgIHsgS2V5OiAnQmFja3VwQ29tcGxpYW5jZScsIFZhbHVlOiAnbWlzc2lvbi1jcml0aWNhbCcgfSxcbiAgICAgICAgeyBLZXk6ICdPdXRwb3N0SWRlbnRpZmllcicsIFZhbHVlOiAnb3V0cG9zdC1lYXN0LTEnIH0sXG4gICAgICAgIHsgS2V5OiAnQnVzaW5lc3NVbml0JywgVmFsdWU6ICdub3QtaW5mcmEtcHJvZCcgfVxuICAgICAgXVxuICAgIH0sXG4gICAgJ21pc3Npbmctc3VmZml4Jzoge1xuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdlZGdlJyB9LFxuICAgICAgICB7IEtleTogJ0JhY2t1cENvbXBsaWFuY2UnLCBWYWx1ZTogJ21pc3Npb24tY3JpdGljYWwnIH0sXG4gICAgICAgIHsgS2V5OiAnT3V0cG9zdElkZW50aWZpZXInLCBWYWx1ZTogJ291dHBvc3QtZWFzdC0xJyB9LFxuICAgICAgICB7IEtleTogJ0J1c2luZXNzVW5pdCcsIFZhbHVlOiAnaW5mcmEnIH1cbiAgICAgIF1cbiAgICB9LFxuICAgICdjYXNlLXNlbnNpdGl2aXR5Jzoge1xuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdlZGdlJyB9LFxuICAgICAgICB7IEtleTogJ0JhY2t1cENvbXBsaWFuY2UnLCBWYWx1ZTogJ21pc3Npb24tY3JpdGljYWwnIH0sXG4gICAgICAgIHsgS2V5OiAnT3V0cG9zdElkZW50aWZpZXInLCBWYWx1ZTogJ291dHBvc3QtZWFzdC0xJyB9LFxuICAgICAgICB7IEtleTogJ0J1c2luZXNzVW5pdCcsIFZhbHVlOiAnSU5GUkEtUFJPRCcgfVxuICAgICAgXVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgSW1hZ2VJZDogJ2FtaS0wMDJiOWQ0Nzg0YTQ2Nzc1ZicsXG4gICAgSW5zdGFuY2VUeXBlOiAndDMubWljcm8nLFxuICAgIE1pbkNvdW50OiAxLFxuICAgIE1heENvdW50OiAxLFxuICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbe1xuICAgICAgUmVzb3VyY2VUeXBlOiAnaW5zdGFuY2UnLFxuICAgICAgVGFnczogdGVzdENhc2VzW3ZhcmlhdGlvbl0uVGFnc1xuICAgIH1dXG4gIH07XG5cbiAgY29uc3QgY29tbWFuZCA9IG5ldyBSdW5JbnN0YW5jZXNDb21tYW5kKHBhcmFtcyk7XG4gIHJldHVybiBhd2FpdCBlYzJDbGllbnQuc2VuZChjb21tYW5kKTtcbn1cblxuLyoqXG4gKiBDb21wcmVoZW5zaXZlIHRlc3QgY29tYmluaW5nIG11bHRpcGxlIGNvbmRpdGlvbnNcbiAqIFRlc3RzIGNvbXBsZXggY29tYmluYXRpb25zIG9mIERlIE1vcmdhbidzIExhd3M6XG4gKiBOT1QoQSBBTkQgQiBBTkQgQykgPSBOT1QoQSkgT1IgTk9UKEIpIE9SIE5PVChDKVxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVDb21wcmVoZW5zaXZlVGVzdEluc3RhbmNlKGVjMkNsaWVudCwgdmFyaWF0aW9uKSB7XG4gIGNvbnN0IHRlc3RDYXNlcyA9IHtcbiAgICAnbXVsdGlwbGUtdmlvbGF0aW9ucyc6IHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgeyBLZXk6ICdEZXBsb3ltZW50VHlwZScsIFZhbHVlOiAnaW52YWxpZCcgfSxcbiAgICAgICAgeyBLZXk6ICdCYWNrdXBDb21wbGlhbmNlJywgVmFsdWU6ICdub3QtY3JpdGljYWwnIH0sXG4gICAgICAgIHsgS2V5OiAnT3V0cG9zdElkZW50aWZpZXInLCBWYWx1ZTogJ291dHBvc3QtZWFzdC0xJyB9LFxuICAgICAgICB7IEtleTogJ0J1c2luZXNzVW5pdCcsIFZhbHVlOiAnaW52YWxpZC1wYXR0ZXJuJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICAnYm91bmRhcnktY29uZGl0aW9ucyc6IHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgeyBLZXk6ICdEZXBsb3ltZW50VHlwZScsIFZhbHVlOiAnZWRnZScgfSxcbiAgICAgICAgeyBLZXk6ICdCYWNrdXBDb21wbGlhbmNlJywgVmFsdWU6ICdtaXNzaW9uLWNyaXRpY2FsJyB9LFxuICAgICAgICB7IEtleTogJ091dHBvc3RJZGVudGlmaWVyJywgVmFsdWU6ICcnIH0sIC8vIEVtcHR5IHZhbHVlXG4gICAgICAgIHsgS2V5OiAnQnVzaW5lc3NVbml0JywgVmFsdWU6ICdpbmZyYS0nIH0gLy8gTWluaW11bSBwYXR0ZXJuXG4gICAgICBdXG4gICAgfSxcbiAgICAnc3BlY2lhbC1jaGFyYWN0ZXJzJzoge1xuICAgICAgVGFnczogW1xuICAgICAgICB7IEtleTogJ0RlcGxveW1lbnRUeXBlJywgVmFsdWU6ICdlZGdlJyB9LFxuICAgICAgICB7IEtleTogJ0JhY2t1cENvbXBsaWFuY2UnLCBWYWx1ZTogJ21pc3Npb24tY3JpdGljYWwnIH0sXG4gICAgICAgIHsgS2V5OiAnT3V0cG9zdElkZW50aWZpZXInLCBWYWx1ZTogJ291dHBvc3QtZWFzdC0xJyB9LFxuICAgICAgICB7IEtleTogJ0J1c2luZXNzVW5pdCcsIFZhbHVlOiAnaW5mcmEtcHJvZCMxMjMnIH0gLy8gU3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICBdXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBJbWFnZUlkOiAnYW1pLTAwMmI5ZDQ3ODRhNDY3NzVmJyxcbiAgICBJbnN0YW5jZVR5cGU6ICd0My5taWNybycsXG4gICAgTWluQ291bnQ6IDEsXG4gICAgTWF4Q291bnQ6IDEsXG4gICAgVGFnU3BlY2lmaWNhdGlvbnM6IFt7XG4gICAgICBSZXNvdXJjZVR5cGU6ICdpbnN0YW5jZScsXG4gICAgICBUYWdzOiB0ZXN0Q2FzZXNbdmFyaWF0aW9uXS5UYWdzXG4gICAgfV1cbiAgfTtcblxuICBjb25zdCBjb21tYW5kID0gbmV3IFJ1bkluc3RhbmNlc0NvbW1hbmQocGFyYW1zKTtcbiAgcmV0dXJuIGF3YWl0IGVjMkNsaWVudC5zZW5kKGNvbW1hbmQpO1xufVxuYDtcblxuZXhwb3J0IGNsYXNzIFNlY3VyaXR5QmxvZ1NhbXBsZUNvZGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIERlZmluZSByZXF1aXJlZCB0YWdzIGFuZCBhbGxvd2VkIHZhbHVlc1xuICAgIGNvbnN0IFJFUVVJUkVEX1RBR1MgPSB7XG4gICAgICBEZXBsb3ltZW50VHlwZTogWydlZGdlJywgJ2NvcmUnLCAnaHlicmlkJ10sXG4gICAgICBCYWNrdXBDb21wbGlhbmNlOiBbJ21pc3Npb24tY3JpdGljYWwnLCAnYnVzaW5lc3MtY3JpdGljYWwnXSxcbiAgICAgIE91dHBvc3RJZGVudGlmaWVyOiAnKicsXG4gICAgICBCdXNpbmVzc1VuaXQ6ICdpbmZyYS0qJ1xuICAgIH07XG5cbiAgICAvLyBDcmVhdGUgVlBDIGZvciBFQzIgaW5zdGFuY2VcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVGFnZ2luZ1Rlc3RWUEMnLCB7XG4gICAgICBtYXhBenM6IDIsXG4gICAgICBuYXRHYXRld2F5czogMVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIEFXUyBCYWNrdXAgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IGJhY2t1cFZhdWx0ID0gbmV3IGJhY2t1cC5CYWNrdXBWYXVsdCh0aGlzLCAnRUMyQmFja3VwVmF1bHQnLCB7XG4gICAgICBiYWNrdXBWYXVsdE5hbWU6ICdlYzItYmFja3VwLXZhdWx0JyxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSBNaXNzaW9uIENyaXRpY2FsIEJhY2t1cCBQbGFuXG4gICAgY29uc3QgbWlzc2lvbkNyaXRpY2FsUGxhbiA9IG5ldyBiYWNrdXAuQmFja3VwUGxhbih0aGlzLCAnTWlzc2lvbkNyaXRpY2FsQmFja3VwUGxhbicsIHtcbiAgICAgIGJhY2t1cFZhdWx0LFxuICAgICAgYmFja3VwUGxhblJ1bGVzOiBbXG4gICAgICAgIG5ldyBiYWNrdXAuQmFja3VwUGxhblJ1bGUoe1xuICAgICAgICAgIGNvbXBsZXRpb25XaW5kb3c6IGNkay5EdXJhdGlvbi5ob3VycygyKSxcbiAgICAgICAgICBzdGFydFdpbmRvdzogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgICAgIHNjaGVkdWxlRXhwcmVzc2lvbjogY2RrLmF3c19ldmVudHMuU2NoZWR1bGUuY3Jvbih7XG4gICAgICAgICAgICBkYXk6ICcqJyxcbiAgICAgICAgICAgIGhvdXI6ICczJyxcbiAgICAgICAgICAgIG1pbnV0ZTogJzAnXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZGVsZXRlQWZ0ZXI6IGNkay5EdXJhdGlvbi5kYXlzKDE4MCksXG4gICAgICAgICAgbW92ZVRvQ29sZFN0b3JhZ2VBZnRlcjogY2RrLkR1cmF0aW9uLmRheXMoOTApLFxuICAgICAgICAgIGVuYWJsZUNvbnRpbnVvdXNCYWNrdXA6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgQnVzaW5lc3MgQ3JpdGljYWwgQmFja3VwIFBsYW5cbiAgICBjb25zdCBidXNpbmVzc0NyaXRpY2FsUGxhbiA9IG5ldyBiYWNrdXAuQmFja3VwUGxhbih0aGlzLCAnQnVzaW5lc3NDcml0aWNhbEJhY2t1cFBsYW4nLCB7XG4gICAgICBiYWNrdXBWYXVsdCxcbiAgICAgIGJhY2t1cFBsYW5SdWxlczogW1xuICAgICAgICBuZXcgYmFja3VwLkJhY2t1cFBsYW5SdWxlKHtcbiAgICAgICAgICBjb21wbGV0aW9uV2luZG93OiBjZGsuRHVyYXRpb24uaG91cnMoMyksXG4gICAgICAgICAgc3RhcnRXaW5kb3c6IGNkay5EdXJhdGlvbi5ob3VycygxKSxcbiAgICAgICAgICBzY2hlZHVsZUV4cHJlc3Npb246IGNkay5hd3NfZXZlbnRzLlNjaGVkdWxlLmNyb24oe1xuICAgICAgICAgICAgZGF5OiAnKicsXG4gICAgICAgICAgICBob3VyOiAnMTInLFxuICAgICAgICAgICAgbWludXRlOiAnMCdcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBkZWxldGVBZnRlcjogY2RrLkR1cmF0aW9uLmRheXMoOTcpLFxuICAgICAgICAgIG1vdmVUb0NvbGRTdG9yYWdlQWZ0ZXI6IGNkay5EdXJhdGlvbi5kYXlzKDcpXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgc2VsZWN0aW9uIGZvciBNaXNzaW9uIENyaXRpY2FsIHJlc291cmNlc1xuICAgIG5ldyBiYWNrdXAuQmFja3VwU2VsZWN0aW9uKHRoaXMsICdNaXNzaW9uQ3JpdGljYWxTZWxlY3Rpb24nLCB7XG4gICAgICBiYWNrdXBQbGFuOiBtaXNzaW9uQ3JpdGljYWxQbGFuLFxuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIGJhY2t1cC5CYWNrdXBSZXNvdXJjZS5mcm9tVGFnKCdCYWNrdXBDb21wbGlhbmNlJywgJ21pc3Npb24tY3JpdGljYWwnKVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIHNlbGVjdGlvbiBmb3IgQnVzaW5lc3MgQ3JpdGljYWwgcmVzb3VyY2VzXG4gICAgbmV3IGJhY2t1cC5CYWNrdXBTZWxlY3Rpb24odGhpcywgJ0J1c2luZXNzQ3JpdGljYWxTZWxlY3Rpb24nLCB7XG4gICAgICBiYWNrdXBQbGFuOiBidXNpbmVzc0NyaXRpY2FsUGxhbixcbiAgICAgIHJlc291cmNlczogW1xuICAgICAgICBiYWNrdXAuQmFja3VwUmVzb3VyY2UuZnJvbVRhZygnQmFja3VwQ29tcGxpYW5jZScsICdidXNpbmVzcy1jcml0aWNhbCcpXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAgIC8vIENyZWF0ZSBTQ1AgcG9saWNpZXMgdXNpbmcgRGUgTW9yZ2FuJ3MgTGF3c1xuICAgIGNvbnN0IHRhZ0VuZm9yY2VtZW50U0NQID0gbmV3IG9yZ2FuaXphdGlvbnMuQ2ZuUG9saWN5KHRoaXMsICdUYWdFbmZvcmNlbWVudFNDUCcsIHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgU2lkOiAnRW5mb3JjZVJlcXVpcmVkVGFncycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgICAgICAgICBBY3Rpb246IFsnZWMyOlJ1bkluc3RhbmNlcyddLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogWydhcm46YXdzOmVjMjoqOio6aW5zdGFuY2UvKiddLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICAnTnVsbCc6IHtcbiAgICAgICAgICAgICAgICAgICdhd3M6UmVxdWVzdFRhZy9PdXRwb3N0SWRlbnRpZmllcic6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFNpZDogJ0VuZm9yY2VEZXBsb3ltZW50VHlwZVZhbHVlcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgICAgICAgICBBY3Rpb246IFsnZWMyOlJ1bkluc3RhbmNlcyddLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogWydhcm46YXdzOmVjMjoqOio6aW5zdGFuY2UvKiddLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICAnU3RyaW5nTm90RXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgJ2F3czpSZXF1ZXN0VGFnL0RlcGxveW1lbnRUeXBlJzogWydlZGdlJywgJ2NvcmUnLCAnaHlicmlkJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFNpZDogJ0VuZm9yY2VCYWNrdXBDb21wbGlhbmNlVmFsdWVzJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnRGVueScsXG4gICAgICAgICAgICAgIEFjdGlvbjogWydlYzI6UnVuSW5zdGFuY2VzJ10sXG4gICAgICAgICAgICAgIFJlc291cmNlOiBbJ2Fybjphd3M6ZWMyOio6KjppbnN0YW5jZS8qJ10sXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgICdTdHJpbmdOb3RFcXVhbHMnOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlJlcXVlc3RUYWcvQmFja3VwQ29tcGxpYW5jZSc6IFsnbWlzc2lvbi1jcml0aWNhbCcsICdidXNpbmVzcy1jcml0aWNhbCddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBTaWQ6ICdFbmZvcmNlQnVzaW5lc3NVbml0UGF0dGVybicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgICAgICAgICBBY3Rpb246IFsnZWMyOlJ1bkluc3RhbmNlcyddLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogWydhcm46YXdzOmVjMjoqOio6aW5zdGFuY2UvKiddLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICAnU3RyaW5nTm90TGlrZSc6IHtcbiAgICAgICAgICAgICAgICAgICdhd3M6UmVxdWVzdFRhZy9CdXNpbmVzc1VuaXQnOiAnaW5mcmEtKidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICdUYWdFbmZvcmNlbWVudFBvbGljeScsXG4gICAgICAgIHR5cGU6ICdTRVJWSUNFX0NPTlRST0xfUE9MSUNZJyxcbiAgICAgICAgdGFyZ2V0SWRzOiBbJ291LTgwMzMtaGx0bm55NnUnXSAvLyB1cGRhdGUgd2l0aCB5b3VyIE9VXG4gICAgICB9KTtcblxuICAgIC8vIENyZWF0ZSBMYW1iZGEgZnVuY3Rpb24gZm9yIHRlc3RpbmcgRUMyIGNyZWF0aW9uIHNjZW5hcmlvc1xuICAgIGNvbnN0IHRlc3RGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ1RhZ2dpbmdUZXN0RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjJfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUodGFnZ2luZ1Rlc3RDb2RlKSxcbiAgICAgIHZwYyxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUkVRVUlSRURfVEFHUzogSlNPTi5zdHJpbmdpZnkoUkVRVUlSRURfVEFHUylcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3RGdW5jdGlvbi5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydlYzI6UnVuSW5zdGFuY2VzJywgJ2VjMjpDcmVhdGVUYWdzJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddXG4gICAgfSkpO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdMYW1iZGFGdW5jdGlvbk5hbWUnLCB7XG4gICAgICB2YWx1ZTogdGVzdEZ1bmN0aW9uLmZ1bmN0aW9uTmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTmFtZSBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uIGZvciB0ZXN0aW5nJ1xuICAgIH0pO1xuXG4gIH1cbn0iXX0=