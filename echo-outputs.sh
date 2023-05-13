#!/bin/bash

stage=dev # Default if not passed over

# Get the stage of the stack to get outputs from
while getopts s: flag
do
        case "${flag}" in
                s) stage=${OPTARG}
                         ;;
                *) echo "Invalid option: -$flag" ;;
        esac
done

# Read region from .env file
envFile=".env"
region=$(grep -i "^REGION=" "$envFile" | cut -d "=" -f 2)
profile=$(grep -i "^YOUR_AWS_IAM_PROFILE=" "$envFile" | cut -d "=" -f 2)
prefix=$(grep -i "^PREFIX=" "$envFile" | cut -d "=" -f 2)
service_name=$(grep -i "^SERVICE_NAME=" "$envFile" | cut -d "=" -f 2)

stack_name="$prefix$service_name-$stage"

# Get stack outputs
outputs=$(aws cloudformation --profile $profile describe-stacks --stack-name $stack_name --query "Stacks[0].Outputs")

# Extract specific output values
userPoolId=$(echo "$outputs" | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
userPoolClientId=$(echo "$outputs" | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
serviceEndpoint=$(echo "$outputs" | jq -r '.[] | select(.OutputKey=="ServiceEndpoint") | .OutputValue')

# Color variables
red=$(tput setaf 1)
blue=$(tput setaf 4)
reset=$(tput sgr0)

# Generate the colored output block
outputBlock="
Copy the following into your frontend .env.local file:

${red}NEXT_PUBLIC_AWS_REGION=${reset}${blue}${region}${reset}
${red}NEXT_PUBLIC_AWS_USER_POOL_ID=${reset}${blue}${userPoolId}${reset}
${red}NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=${reset}${blue}${userPoolClientId}${reset}
${red}NEXT_PUBLIC_AWSAPIENDPOINT=${reset}${blue}${serviceEndpoint}${reset}

"



# Print the output block
echo "$outputBlock"