"use server"

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function addJob(formData) {
  await connectDB();
  
  // Extract data from the form fields
  const company = formData.get("company");
  const role = formData.get("role");
  const link = formData.get("link");

  // Create the entry in your MongoDB
  await Job.create({
    company,
    role,
    link,
    status: "Pending"
  });

  // This tells Next.js to refresh the page so the new job shows up!
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