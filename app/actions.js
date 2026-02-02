"use server"

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function addJob(formData) {
  await connectDB();
  const company = formData.get("company");
  const role = formData.get("role");
  const link = formData.get("link");

  await Job.create({ company, role, link, status: "Pending" });
  revalidatePath("/");
}

export async function deleteJob(formData) {
  await connectDB();
  const id = formData.get("id");
  await Job.findByIdAndDelete(id);
  revalidatePath("/");
}

export async function updateStatus(formData) {
  await connectDB();
  const id = formData.get("id");
  const newStatus = formData.get("status");
  await Job.findByIdAndUpdate(id, { status: newStatus });
  revalidatePath("/");
}