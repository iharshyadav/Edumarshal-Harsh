import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

async function fetchAttendance() {
  const data = qs.stringify({
    grant_type: "password",
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: process.env.URL,
    headers: {
      Authorization: process.env.AUTH_TOKEN,
      Cookie: process.env.COOKIE,
      "X-Wb": "1",
      Sessionid: process.env.SESSION_ID,
      "X-Contextid": process.env.X_CONTEXT_ID,
      "X-Userid": process.env.X_USER_ID,
      X_token: process.env.X_TOKEN,
      "X-Rx": process.env.X_RX,
    },
    data: data,
  };

  try {
    console.log(config)
    const response = await axios(config);
    // console.log(response)
    console.log(response.data)
    const result = response.data;

    return {
      Name: process.env.NAME,
      overallPercentage: result.stdSubAtdDetails.overallPercentage,
      overallPresent: result.stdSubAtdDetails.overallPresent,
      overallLecture: result.stdSubAtdDetails.overallLecture,
      Subject: result.stdSubAtdDetails.subjects.map((item: any) => ({
        Name: item.name,
        PercentageAttendance: `${item.percentageAttendance} %`,
        TotalAttendance: item.totalLeactures,
        PresentAttendance: item.presentLeactures,
      })),
      attendanceData: result.attendanceData.reverse().map((item: any) => ({
        Subject: item.subjectName,
        Absent: new Date(item.absentDate).toLocaleDateString(),
        isAbsent: item.isAbsent,
      })),
    };
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
}

// API route handler
export async function GET(req: NextRequest) {
  try {
    const attendanceData = await fetchAttendance();
    return NextResponse.json(attendanceData);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
}
