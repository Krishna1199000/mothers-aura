import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./components/signin-form";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
  title: "Sign In | Mothers Aura",
  description: "Sign in to your account",
};

interface SignInPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams.mode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === "forgot-password" ? "Reset Password" : "Sign In"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {mode === "forgot-password" ? (
            <ForgotPasswordForm />
          ) : (
            <SignInForm />
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {mode === "forgot-password" ? (
            <Button variant="link" asChild className="w-full">
              <Link href="/signin">Back to Sign In</Link>
            </Button>
          ) : (
            <>
              <Button variant="link" asChild className="w-full">
                <Link href="/signin?mode=forgot-password">
                  Forgot your password?
                </Link>
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Sign up
                </Link>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}