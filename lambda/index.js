const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const { randomUUID } = require("crypto");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  };

  try {
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path;
    const id = event.pathParameters?.id;

    // Create Task
    if (method === "POST" && path === "/todos") {
      const body = JSON.parse(event.body);

      const item = {
        id: randomUUID(),
        task: body.task,
        completed: false,
        createdAt: new Date().toISOString()
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item
        })
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: "Task created successfully",
          data: item
        })
      };
    }

    // Get All Tasks
    if (method === "GET" && path === "/todos") {
      const result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Items)
      };
    }

    // Update Task
    if (method === "PUT" && id) {
      const body = JSON.parse(event.body);

      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression: "SET completed = :completed",
          ExpressionAttributeValues: {
            ":completed": body.completed
          }
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Task updated successfully"
        })
      };
    }

    // Delete Task
    if (method === "DELETE" && id) {
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id }
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Task deleted successfully"
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: "Route not found"
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      })
    };
  }
};