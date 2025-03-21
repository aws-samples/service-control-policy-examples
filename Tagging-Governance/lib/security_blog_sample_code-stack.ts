import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as backup from 'aws-cdk-lib/aws-backup';
import * as organizations from 'aws-cdk-lib/aws-organizations';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';

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

export class SecurityBlogSampleCodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    // Create privileged IAM role for tag management exception
    const privilegedRole = new iam.Role(this, 'PrivilegedRole', {
      roleName: 'PrivilegedRole',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com')
      ),
      description: 'A privileged role with the ability to delete Tags'
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
            },
            {
              Sid: 'DenyTagChangesOutsideOfRunInstances',
              Effect: 'Deny',
              Action: ['ec2:CreateTags'],
              Resource: ['arn:aws:ec2:*:*:instance/*'],
              Condition: {
                'StringNotEquals': {
                  'ec2:CreateAction': 'RunInstances'
                }
              }
            },
            {
              Sid: 'DenyTagDeletion',
              Effect: 'Deny',
              Action: ['ec2:DeleteTags'],
              Resource: ['arn:aws:ec2:*:*:*/*'],
              Condition: {
                'ArnNotLike': {
                  'aws:PrincipalARN': 'arn:aws:iam::${Account}:role/' + privilegedRole.roleArn
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
      actions: ['ec2:RunInstances'],
      resources: ['*']
    }));

    testFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ec2:CreateTags'],
      resources: ['arn:aws:ec2:*:*:instance/*'],
      condition: {
        'StringEquals': {
          'ec2:CreateAction': 'RunInstances'
        }
      }
    }));

    // Outputs
    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: testFunction.functionName,
      description: 'Name of the Lambda function for testing'
    });

  }
}