# Serverless Personal Todo API

A lightweight, serverless CRUD REST API built with Node.js and the AWS SDK v3, designed to run on AWS Lambda integrated with Amazon API Gateway and Amazon DynamoDB.

---

## 🛠️ Architecture & Tech Stack

- **Compute:** AWS Lambda (Node.js 18.x / 20.x runtime)
- **Database:** Amazon DynamoDB (NoSQL)
- **API Interface:** Amazon API Gateway (HTTP / REST API)
- **SDK:** `@aws-sdk/client-dynamodb` & `@aws-sdk/lib-dynamodb` (AWS SDK v3)
- **IAM:** AWS IAM Execution Role with least-privilege DynamoDB policies

---

## 🚀 API Endpoints

| Method | Endpoint | Description | Sample Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/todos` | Create a new task | `{"task": "Learn AWS Lambda"}` |
| `GET` | `/todos` | Retrieve all tasks | *None* |
| `PUT` | `/todos/{id}` | Update task completion status | `{"completed": true}` |
| `DELETE` | `/todos/{id}` | Delete a task by ID | *None* |

---

## ⚙️ Environment Variables

Configure this environment variable inside the AWS Lambda Console or via your Infrastructure-as-Code template:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `TABLE_NAME` | The target DynamoDB Table name | `TodosTable` |

---

## 📦 Local Setup & Deployment

### 1. Clone the repository
```bash
git clone https://github.com/mustakkhan-dev/serverless-todo-api.git
cd serverless-todo-api/lambda
```

### 2. Install dependencies
```bash
npm install
```

### 3. Package for AWS Lambda Deployment
```bash
zip -r function.zip index.js node_modules package.json
```

Upload `function.zip` via the AWS Lambda Console, or deploy using the AWS CLI:

```bash
aws lambda update-function-code \
  --function-name YourLambdaFunctionName \
  --zip-file fileb://function.zip
```

---

## 🔐 IAM Policy Requirements

Ensure your Lambda execution role has the following DynamoDB permissions attached:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    }
  ]
}
```