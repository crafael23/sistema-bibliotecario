"use server";

import { generateAllDemoData } from "~/server/db/demo-data";

export async function generateReportsDemoData() {
  return await generateAllDemoData();
}
