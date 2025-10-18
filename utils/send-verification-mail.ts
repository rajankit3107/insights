import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verification-email";
import { ApiResponse } from "@/types/api-response";

export async function sendVerificationEmail(
  email: string,
  username: string,
  code: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Insights | Verification Code",
      react: VerificationEmail({ userName: username, verificationCode: code }),
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
