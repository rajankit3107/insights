import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationCode?: string;
  userName?: string;
}

export default function VerificationEmail({
  verificationCode = "123456",
  userName = "there",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code: {verificationCode}</Preview>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white shadow-lg">
          {/* Header */}
          <Section className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-center">
            <Heading className="m-0 text-3xl font-semibold text-white">
              Verify Your Email
            </Heading>
          </Section>

          {/* Content */}
          <Section className="px-8 py-10">
            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              Hi {userName},
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              We received a request to verify your email address. Please use the
              verification code below to complete your registration:
            </Text>

            {/* Verification Code Box */}
            <Section className="my-8 rounded-lg border-2 border-dashed border-purple-600 bg-gray-50 px-8 py-10 text-center">
              <Text className="m-0 font-mono text-5xl font-bold tracking-widest text-purple-600">
                {verificationCode}
              </Text>
              <Text className="mt-4 text-sm text-gray-600">
                This code will expire in 10 minutes
              </Text>
            </Section>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              If you didn't request this code, you can safely ignore this email.
              Someone else might have typed your email address by mistake.
            </Text>

            {/* Warning Box */}
            <Section className="my-6 rounded border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <Text className="m-0 text-sm text-yellow-800">
                <strong>Security tip:</strong> Never share this code with
                anyone. Our team will never ask you for your verification code.
              </Text>
            </Section>

            <Text className="text-base text-gray-700">
              Best regards,
              <br />
              The Team
            </Text>
          </Section>

          <Hr className="mx-8 border-gray-200" />

          {/* Footer */}
          <Section className="bg-gray-50 px-8 py-8 text-center">
            <Text className="mb-2 text-sm text-gray-600">
              This is an automated message, please do not reply to this email.
            </Text>
            <Text className="m-0 text-sm text-gray-600">
              © 2025 Your Company. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
