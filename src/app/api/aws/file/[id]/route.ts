import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION, // replace with your region
  endpoint: process.env.NEXT_PUBLIC_S3_SERVER_ENDPT_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
    Key: `${id}/document.pdf`,
  });
  const response = await s3.send(command);

  if (!response.Body) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Convert the stream to buffer
  const buffer = await response.Body.transformToByteArray();
  const contentType = "application/pdf";

  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Length": buffer.length.toString(),
    "Accept-Ranges": "bytes",
    // Important: Set inline disposition for PDFs to display in browser
    "Content-Disposition":
      contentType === "application/pdf"
        ? 'inline; filename="document.pdf"'
        : "attachment",
    // CORS headers for iframe embedding
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
    // Security headers
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    // Cache control
    "Cache-Control": "public, max-age=3600",
  });

  return new NextResponse(buffer, { headers });
}
