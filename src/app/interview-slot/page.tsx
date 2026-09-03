import { getStudentInterviewState } from "@/app/actions/interview";
import { InterviewSlotClient } from "./InterviewSlotClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function InterviewSlotPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const state = await getStudentInterviewState();

  if (state.error) {
    // Either not shortlisted or some other error, redirect to status
    redirect("/status");
  }

  return (
    <InterviewSlotClient
      session={session}
      pref1={state.pref1 as string}
      pref2={state.pref2 as string}
      availableSessions={state.availableSessions as any[]}
      existingSelection={state.selection}
    />
  );
}
