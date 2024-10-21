import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { envs_config } from "@/lib/envs_config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    const options = {
      method: "POST",
      url: envs_config.CLOUDE_RESPONSE_URL,
      headers: {
        "x-rapidapi-key": envs_config.RAPIDAPI_KEY,
        "x-rapidapi-host": "open-ai21.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
        web_access: false,
      },
    };
    const response = await axios.request(options);
    return NextResponse.json({ result: response.data.result }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error.response?.data?.message || "Failed to process request",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    msg: "Working",
  });
}
