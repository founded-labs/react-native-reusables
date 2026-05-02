import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/nativewind/components/ui/card';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useSignIn } from '@clerk/expo';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function ResetPasswordForm() {
  const { signIn, fetchStatus } = useSignIn();
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState({ code: '', password: '' });

  async function onSubmit() {
    if (fetchStatus === 'fetching') {
      return;
    }
    try {
      const { error: verifyCodeError } = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });

      if (verifyCodeError) {
        setError({ code: verifyCodeError.longMessage ?? verifyCodeError.message, password: '' });
        return;
      }

      const { error: submitPasswordError } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
      });

      if (submitPasswordError) {
        setError({
          code: '',
          password: submitPasswordError.longMessage ?? submitPasswordError.message,
        });
        return;
      }

      if (signIn.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        await signIn.finalize();
        return;
      }
      // TODO: Handle other statuses
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      const message = err instanceof Error ? err.message : 'Something went wrong';
      const isPasswordMessage = message.toLowerCase().includes('password');
      setError({
        code: isPasswordMessage ? '' : message,
        password: isPasswordMessage ? message : '',
      });
      console.error(err);
    }
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Reset password</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to your email and set a new password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">New password</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
              />
              {error.password ? (
                <Text className="text-sm font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                autoCapitalize="none"
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
              />
              {error.code ? (
                <Text className="text-sm font-medium text-destructive">{error.code}</Text>
              ) : null}
            </View>
            <Button className={cn("w-full", fetchStatus === 'fetching' && 'opacity-50')} onPress={onSubmit}>
              <Text>Reset Password</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
