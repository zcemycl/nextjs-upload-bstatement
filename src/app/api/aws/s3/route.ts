import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION, // replace with your region
  // endpoint: process.env.NEXT_PUBLIC_S3_ENDPT_URL, // 👈 Your MinIO server URL
  endpoint: "http://s3:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET() {
  // request: Request
  return NextResponse.json({ msg: "Hello world" }, { status: 200 });
}

export async function POST(request: Request) {
  const data = await request.json();
  let uploadParams = data.uploadParams as PutObjectCommandInput;
  const payload = data.payload;
  const contentType = data.contentType;
  let body;
  if (contentType === "application/pdf") {
    body = Buffer.from(payload, "base64");
  } else {
    body = payload;
  }
  uploadParams.Body = body;

  const command = new PutObjectCommand(uploadParams);
  let response;
    try {
      response = await s3.send(command);
      console.log("Upload successful:", response);
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }

  return NextResponse.json({ msg: 'successful'}, { status: 200 });
}
